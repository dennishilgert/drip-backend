import { inject, injectable } from 'inversify'
import { IFileSendingRepo, ISendingService } from '../interfaces'
import * as IdentityModule from '../../identity'
import * as SocketModule from '../../socket'
import { ForbiddenError, InternalError, NotFoundError, ValidationError } from '../../../errors'
import { IUploadedFile } from '../../../common/interfaces/IUploadedFile'
import { IFileSending, ISendingRequest, ISendingResponse, IMessageSending, ICreateFileSendingData, ITransformedFileSending } from '../types'
import { Request } from 'express'
import busboy from 'busboy'
import { asNumber, asString } from '../../../common/helpers/dataHelper'
import internal from 'stream'
import path from 'path'
import fs from 'fs'
import { extractExtension } from '../../../common/helpers/fileHelper'
import { uniqueId } from '../../../common/helpers/uuidHelper'
import { SendingType } from '../enums'
import { DI_TYPES } from '../diTypes'
import FileSendingApiTransformer from '../../../routes/transformers/fileSendingApiTransformer'

@injectable()
class SendingService implements ISendingService {
  private readonly fileSendingRepo: IFileSendingRepo
  private readonly identityService: IdentityModule.interfaces.IIdentityService
  private readonly socketService: SocketModule.interfaces.ISocketService

  public constructor (
    @inject(DI_TYPES.FileSendingRepo) fileSendingRepo: IFileSendingRepo,
    @inject(IdentityModule.DI_TYPES.IdentityService) identityService: IdentityModule.interfaces.IIdentityService,
    @inject(SocketModule.DI_TYPES.SocketService) socketService: SocketModule.interfaces.ISocketService
  ) {
    this.fileSendingRepo = fileSendingRepo
    this.identityService = identityService
    this.socketService = socketService
  }

  /**
   * It creates a file sending
   * @param {ICreateFileSendingData} data - ICreateFileSendingData
   * @returns A file sending object
   */
  async createFileSending (data: ICreateFileSendingData): Promise<IFileSending> {
    return this.fileSendingRepo.create(data)
  }

  /**
   * "Send a message to a user."
   * 
   * The first thing we do is create a `messageSendingRequest` object. This object is used to send a
   * request to the user we want to send a message to. The request is used to get the user's identity
   * @param {string} fromName - The name of the user sending the message
   * @param {string} toName - The name of the user you want to send the message to.
   * @param {string} message - The message to send
   * @returns A promise that resolves to a boolean.
   */
  async sendMessage (fromName: string, toName: string, message: string): Promise<boolean> {
    const messageSendingRequest: ISendingRequest = {
      fromName,
      type: SendingType.MESSAGE
    }
    return this.sendRequest(toName, messageSendingRequest)
      .then((toIdentity: IdentityModule.types.IIdentity) => {
        const messageSending: IMessageSending = {
          fromName,
          message
        }
        return this.socketService.emitEvent(toIdentity.uuid, SocketModule.enums.SocketEvent.MESSAGE_SENDING, JSON.stringify(messageSending))
      })
  }

  /**
   * It uploads a file, creates a file sending, sends a file sending request to the recipient, and
   * emits a file sending event to the recipient
   * @param {string} fromName - The name of the user sending the file
   * @param {Request} req - Request - The request object from the HTTP request
   * @returns A promise that resolves to a boolean.
   */
  async sendFile (fromName: string, req: Request): Promise<boolean> {
    return this.uploadFiles(req)
      .then(async (uploadedFiles: IUploadedFile[]) => {
        // Currently supported is only one file per upload
        const file: IUploadedFile = uploadedFiles[0]
        const toName: string = req.body.toName

        const createFileSendingData: ICreateFileSendingData = {
          uuid: file.fileUuid,
          fromName,
          toName,
          fileOriginalName: file.originalName,
          fileName: file.fileName,
          filePath: file.path,
          fileMimeType: file.mimeType
        }
        const fileSending: IFileSending = await this.createFileSending(createFileSendingData)

        const fileSendingRequest: ISendingRequest = {
          fromName,
          type: SendingType.FILE,
          fileOriginalName: file.originalName,
          fileMimeType: file.mimeType
        }
        const toIdentity: IdentityModule.types.IIdentity = await this.sendRequest(toName, fileSendingRequest)
          .catch((error: Error) => {
            this.deleteFile(fileSending.filePath)
              .then(async () => {
                await this.deleteFileSending(fileSending.uuid)
                logger.debug(`[${fileSending.fileName}] Deleted after request declined`)
              })
            throw error
          }) as IdentityModule.types.IIdentity

        const transformedFileSending: ITransformedFileSending = new FileSendingApiTransformer(fileSending).transform()

        return this.socketService.emitEvent(toIdentity.uuid, SocketModule.enums.SocketEvent.FILE_SENDING, JSON.stringify(transformedFileSending))
      })
  }

  /**
   * It sends a request to a given identity, and returns the identity if the request is accepted
   * @param {string} toName - The name of the identity to send the request to.
   * @param {ISendingRequest} request - ISendingRequest
   * @returns The identity of the receiver
   */
  async sendRequest (toName: string, request: ISendingRequest): Promise<IdentityModule.types.IIdentity> {
    return new Promise(async (resolve: Function, reject: Function) => {
      const toIdentity: IdentityModule.types.IIdentity | null = await this.identityService.getIdentityByName(toName)
      if (!toIdentity) {
        throw new NotFoundError('Provided identity does not exist')
      }
      const socketClient: SocketModule.interfaces.ISocketClient | undefined = this.socketService.getClient(toIdentity.uuid)
      if (!socketClient) {
        return reject(new NotFoundError('Provided identity is not connected'))
      }
      socketClient.injectListener(
        SocketModule.enums.SocketEvent.SENDING_RESPONSE,
        (response: string) => {
          const sendingResponse: ISendingResponse = JSON.parse(response)
          if (sendingResponse.accepted) {
            return resolve(toIdentity)
          }
          return reject(new ForbiddenError('Receiver has declined the request'))
        }
      )
      const success: boolean = socketClient.emitEvent(
        SocketModule.enums.SocketEvent.SENDING_REQUEST,
        JSON.stringify(request)
      )
      if (!success) {
        return reject(new InternalError('Failed to emit event to client'))
      }
    })
  }

  /**
   * It takes a request object, parses the request body and files, and returns a promise that resolves
   * to an array of uploaded files
   * @param {Request} req - Request - The request object
   * @returns An array of IUploadedFile objects.
   */
  async uploadFiles (req: Request): Promise<IUploadedFile[]> {
    return new Promise((resolve: Function, reject: Function) => {
      const files: Map<string, IUploadedFile> = new Map()
  
      const busboyParser: busboy.Busboy = busboy({
        headers: req.headers,
        limits: {
          fileSize: asNumber(process.env.FILE_MAX_SIZE)
        }
      })
    
      // Parse files attached to the request
      busboyParser.on('file', (fieldName: string, fileStream: internal.Readable, fileInfo: busboy.FileInfo) => {
        let fileSize: number = 0
        let exceededSizeLimit: boolean = false
        const fileExtension: string | undefined = extractExtension(fileInfo.filename)
        const fileUuid: string = uniqueId()
        const fileName: string = fileUuid + (fileExtension ? (`.${fileExtension}`) : '')
        const filePath = path.join(asString(process.env.FILE_STORAGE), fileName)
    
        logger.debug(`[${fileName}] Upload started`)
    
        const writeStream: fs.WriteStream = fs.createWriteStream(filePath)
        fileStream.pipe(writeStream)
    
        fileStream.on('limit', () => {
          fileStream.destroy()
          exceededSizeLimit = true
          logger.debug(`[${fileName}] Exceeded file size limit`)
          reject(new ValidationError(`Provided file exceeds file limit of ${asNumber(process.env.FILE_MAX_SIZE)} byte`))
        })
    
        fileStream.on('data', (data: Buffer) => {
          fileSize = fileSize + data.length
        })
    
        fileStream.on('close', () => {
          if (exceededSizeLimit) {
            this.deleteFile(filePath)
              .then(() => {
                logger.debug(`[${fileName}] Already written chunks were deleted`)
              })
            return
          }
          const file: IUploadedFile = {
            fieldName,
            originalName: fileInfo.filename,
            encoding: fileInfo.encoding,
            mimeType: fileInfo.mimeType,
            destination: asString(process.env.FILE_STORAGE),
            fileUuid,
            fileName,
            path: filePath,
            size: fileSize
          }
          files.set(fieldName, file)
          logger.debug(`[${fileName}] Upload done after ${fileSize} bytes`)
        })
    
        fileStream.on('error', (error: Error) => {
          reject(error)
        })
      })
    
      // Parse fields in the request
      busboyParser.on('field', (name: string, value: string, fieldInfo: busboy.FieldInfo) => {
        req.body[name] = value
      })
    
      busboyParser.on('close', () => {
        req.files = files
        resolve(Array.from(files.values()))
      })
    
      req.pipe(busboyParser)
    })
  }

  /**
   * It returns a file sending object from the database, given a uuid
   * @param {string} uuid - The uuid of the file sending.
   * @returns A file sending object
   */
  async getFileSendingByUuid (uuid: string): Promise<IFileSending | null> {
    return this.fileSendingRepo.getByUuid(uuid)
  }

  async cleanFileSendings (identityName: string): Promise<void> {
    const fileSendings: IFileSending[] = await this.fileSendingRepo.getByToName(identityName)
    fileSendings.forEach((fileSending: IFileSending) => {
      this.deleteFile(fileSending.filePath)
        .then(() => {
          this.deleteFileSending(fileSending.uuid)
        })
    })
  }

  /**
   * It deletes a file sending by its uuid
   * @param {string} uuid - The uuid of the file sending to be deleted.
   * @returns The number of rows affected by the delete operation.
   */
  async deleteFileSending (uuid: string): Promise<number> {
    return this.fileSendingRepo.deleteByUuid(uuid)
  }

  /**
   * It deletes a file at the given path
   * @param {string} path - The path to the file you want to delete.
   */
  async deleteFile (path: string): Promise<void> {
    fs.unlink(path, (error: any) => {
      if (error) throw error
    })
  }
}

export default SendingService