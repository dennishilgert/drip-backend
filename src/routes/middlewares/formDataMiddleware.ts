import { NextFunction, Request, Response } from 'express'
import { IUploadedFile } from '../../common/interfaces'
import busboy from 'busboy'
import { asNumber, asString } from '../../common/helpers/dataHelper'
import internal from 'stream'
import path from 'path'
import fs from 'fs'
import { extractExtension } from '../../common/helpers/fileHelper'
import { uniqueId } from '../../common/helpers/uuidHelper'
import { ValidationError } from '../../errors'
import { deleteFile } from '../../common/util/fileUtil'
import { isSupported } from '../../common/util/mimeTypeUtil'

function formDataParser(req: Request, res: Response, next: NextFunction): void {
	const uploadedFiles: Map<string, IUploadedFile> = new Map<
		string,
		IUploadedFile
	>()
	const busboyParser: busboy.Busboy = busboy({
		headers: req.headers,
		limits: {
			fileSize: asNumber(process.env.FILE_MAX_SIZE)
		}
	})

	/* Parsing and uploading the files attached to the request. */
	busboyParser.on(
		'file',
		(
			fieldName: string,
			fileStream: internal.Readable,
			fileInfo: busboy.FileInfo
		) => {
			let fileSize: number = 0
			let exceededSizeLimit: boolean = false

			if (!isSupported(fileInfo.mimeType)) {
				fileStream.destroy()
				next(
					new ValidationError(
						`File mime type ${fileInfo.mimeType} is not supported`
					)
				)
				return
			}

			const fileExtension: string | undefined = extractExtension(
				fileInfo.filename
			)
			const fileUuid: string = uniqueId()
			const fileName: string =
				fileUuid + (fileExtension ? `.${fileExtension}` : '')
			const filePath = path.join(asString(process.env.FILE_STORAGE), fileName)

			logger.debug(`[${fileName}] Upload started`)

			const writeStream: fs.WriteStream = fs.createWriteStream(filePath)
			fileStream.pipe(writeStream)

			fileStream.on('limit', () => {
				fileStream.destroy()
				exceededSizeLimit = true
				logger.debug(`[${fileName}] Exceeded file size limit`)
				next(
					new ValidationError(
						`File exceeds file size limit of ${asNumber(
							process.env.FILE_MAX_SIZE
						)} bytes`
					)
				)
			})

			fileStream.on('data', (data: Buffer) => {
				fileSize = fileSize + data.length
			})

			fileStream.on('close', () => {
				if (exceededSizeLimit) {
					deleteFile(filePath).then(() => {
						logger.debug(`[${fileName}] Already written chunks were deleted`)
					})
					return
				}
				const uploadedFile: IUploadedFile = {
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
				uploadedFiles.set(fieldName, uploadedFile)
				logger.debug(`[${fileName}] Upload done after ${fileSize} bytes`)
			})

			fileStream.on('error', (error: Error) => {
				next(error)
			})
		}
	)

	/* Parsing the fields in the request. */
	busboyParser.on('field', (name: string, value: string) => {
		req.body[name] = value
	})

	busboyParser.on('close', () => {
		req.files = uploadedFiles
		next()
	})

	req.pipe(busboyParser)
}

export default formDataParser
