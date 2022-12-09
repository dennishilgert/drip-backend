import { IUploadedFile } from '../../common/interfaces/IUploadedFile'

declare global {
  namespace Express {
    export interface Request {
      files?: Map<string, IUploadedFile>
    }
  }
}

export { }