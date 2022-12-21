import { inject, injectable } from 'inversify'
import { IFileTransmissionRepo, IMessageTransmissionRepo, ITransmissionService } from '../interfaces'
import * as IdentityModule from '../../identity'
import * as SocketModule from '../../socket'
import { IUploadedFile } from '../../../common/interfaces'
import {
  IFileTransmission,
  ICreateFileTransmissionData,
  ICreateMessageTransmissionData,
  IMessageTransmission,
  ITransmissionRequest,
  ITransmissionResponse,
  ITransformedFileTransmission,
  ITransformedTransmissionRequest,
  ITransformedMessageTransmission
} from '../types'
import { Request } from 'express'
import { DI_TYPES } from '../diTypes'
import { deleteFile } from '../../../common/util/fileUtil'
import { NoFileAttachedError, TransmissionDeletionError } from '../errors'
import TransmissionRequestTransformer from '../transformers/transmissionRequestTransformer'

@injectable()
class TransmissionService implements ITransmissionService {
  private readonly messageTransmissionRepo: IMessageTransmissionRepo
  private readonly fileTransmissionRepo: IFileTransmissionRepo
  private readonly socketService: SocketModule.interfaces.ISocketService

  public constructor (
    @inject(DI_TYPES.MessageTransmissionRepo) messageTransmissionRepo: IMessageTransmissionRepo,
    @inject(DI_TYPES.FileTransmissionRepo) fileTransmissionRepo: IFileTransmissionRepo,
    @inject(SocketModule.DI_TYPES.SocketService) socketService: SocketModule.interfaces.ISocketService
  ) {
    this.messageTransmissionRepo = messageTransmissionRepo
    this.fileTransmissionRepo = fileTransmissionRepo
    this.socketService = socketService
  }

  async cacheMessage (fromUuid: string, toUuid: string, message: string): Promise<IMessageTransmission> {
    const messageTransmissionData: ICreateMessageTransmissionData = {
      fromUuid,
      toUuid,
      message
    }
    return this.messageTransmissionRepo.create(messageTransmissionData)
  }

  async cacheFile (fromUuid: string, toUuid: string, request: Request): Promise<IFileTransmission> {
    const uploadedFiles: Map<string, IUploadedFile> | undefined = request.files
    if (!uploadedFiles || uploadedFiles.size < 1) {
      throw new NoFileAttachedError('Request has no attached file')
    }
    // Currently supporting only one file per sending
    const uploadedFile: IUploadedFile = uploadedFiles.values().next().value as IUploadedFile

    const fileTransmissionData: ICreateFileTransmissionData = {
      uuid: uploadedFile.fileUuid,
      fromUuid,
      toUuid,
      fileOriginalName: uploadedFile.originalName,
      fileName: uploadedFile.fileName,
      filePath: uploadedFile.path,
      fileMimeType: uploadedFile.mimeType
    }
    return this.fileTransmissionRepo.create(fileTransmissionData)
  }

  sendRequest (toUuid: string, transmissionRequest: ITransmissionRequest): void {
    const socketClient: SocketModule.interfaces.ISocketClient | undefined = this.socketService.getClient(toUuid)
    if (!socketClient) {
      throw new IdentityModule.errors.IdentityNotConnectedError('Target Identity is not connected')
    }

    // Deleting transmissionUuid from the request
    const transformedTransmissionRequest: ITransformedTransmissionRequest =
      new TransmissionRequestTransformer(transmissionRequest).transform()

    socketClient
      .openRequest(transformedTransmissionRequest)
      .then(async (socketResponse: SocketModule.types.ISocketResponse) => {
        const transmissionResponse: ITransmissionResponse =
          socketResponse as ITransmissionResponse
        this.socketService.emitEvent(
          transmissionRequest.fromUuid,
          SocketModule.enums.SocketEvent.RESPONSE,
          JSON.stringify(transmissionResponse)
        )

        switch (transmissionRequest.requestType) {
        case SocketModule.enums.RequestType.MESSAGE_TRANSMISSION: {
          if (transmissionResponse.accepted) {
            const transformedMessageTransmission: ITransformedMessageTransmission = {
              uuid: transmissionRequest.transmissionUuid,
              fromName: transmissionRequest.fromName
            }
            socketClient.emitEvent(
              SocketModule.enums.SocketEvent.MESSAGE_TRANSMISSION,
              JSON.stringify(transformedMessageTransmission)
            )
            return
          }

          const affectedRows: number = await this.deleteMessageTransmission(transmissionRequest.requestUuid)
          if (affectedRows < 1) {
            throw new TransmissionDeletionError('Failed to delete message transmission')
          }
          break
        }
        case SocketModule.enums.RequestType.FILE_TRANSMISSION: {
          if (transmissionResponse.accepted) {
            const transformedFileTransmission: ITransformedFileTransmission = {
              uuid: transmissionRequest.transmissionUuid,
              fromName: transmissionRequest.fromName,
              fileOriginalName: transmissionRequest.fileOriginalName!,
              fileMimeType: transmissionRequest.fileMimeType!
            }
            socketClient.emitEvent(
              SocketModule.enums.SocketEvent.FILE_TRANSMISSION,
              JSON.stringify(transformedFileTransmission)
            )
            return
          }
          const affectedRows: number = await this.deleteFileTransmission(transmissionRequest.requestUuid)
          if (affectedRows < 1) {
            throw new TransmissionDeletionError('Failed to delete file transmission')
          }
          break
        }
        }
      })
      .catch(async (error: Error) => {
        if (error instanceof SocketModule.errors.SocketRequestTimeoutError) {
          const socketResponse: SocketModule.types.ISocketResponse = {
            requestUuid: transmissionRequest.requestUuid
          }
          this.socketService.emitEvent(
            toUuid,
            SocketModule.enums.SocketEvent.REQUEST_RETRACTED,
            JSON.stringify(socketResponse)
          )
          this.socketService.emitEvent(
            transmissionRequest.fromUuid,
            SocketModule.enums.SocketEvent.REQUEST_TIMEOUT,
            JSON.stringify(socketResponse)
          )

          switch (transmissionRequest.requestType) {
          case SocketModule.enums.RequestType.MESSAGE_TRANSMISSION: {
            const affectedRows: number = await this.deleteMessageTransmission(transmissionRequest.requestUuid)
            if (affectedRows < 1) {
              throw new TransmissionDeletionError('Failed to delete message transmission')
            }
            break
          }
          case SocketModule.enums.RequestType.FILE_TRANSMISSION: {
            const affectedRows: number = await this.deleteFileTransmission(transmissionRequest.requestUuid)
            if (affectedRows < 1) {
              throw new TransmissionDeletionError('Failed to delete file transmission')
            }
            break
          }
          }
        } else {
          throw error
        }
      })
  }

  async getMessageTransmissionByUuid (uuid: string): Promise<IMessageTransmission | null> {
    return this.messageTransmissionRepo.getByUuid(uuid)
  }

  async getFileTransmissionByUuid (uuid: string): Promise<IFileTransmission | null> {
    return this.fileTransmissionRepo.getByUuid(uuid)
  }

  async cleanMessageTransmissions (identityUuid: string): Promise<void> {
    this.messageTransmissionRepo.deleteByToUuid(identityUuid)
  }

  async cleanFileTransmissions (identityUuid: string): Promise<void> {
    const fileTransmissions: IFileTransmission[] = await this.fileTransmissionRepo.getByToUuid(identityUuid)
    fileTransmissions.forEach((fileTransmission: IFileTransmission) => {
      deleteFile(fileTransmission.filePath)
        .then(() => {
          this.deleteFileTransmission(fileTransmission.uuid)
        })
        .catch((error: Error) => {
          logger.error('File deletion error', {
            filePath: fileTransmission.filePath,
            error
          })
        })
    })
  }

  async deleteMessageTransmission (requestUuid: string): Promise<number> {
    return this.messageTransmissionRepo.deleteByRequestUuid(requestUuid)
  }

  async deleteFileTransmission (requestUuid: string): Promise<number> {
    const fileTransmission: IFileTransmission | null = await this.fileTransmissionRepo.getByRequestUuid(requestUuid)
    if (!fileTransmission) return 0
    return deleteFile(fileTransmission.filePath)
      .then(() => {
        return this.fileTransmissionRepo.deleteByUuid(fileTransmission.uuid)
      })
      .catch((error: Error) => {
        logger.error('File deletion error', {
          filePath: fileTransmission.filePath,
          error
        })
        return 0
      })
  }
}

export default TransmissionService
