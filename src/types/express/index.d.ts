/* eslint-disable no-unused-vars */
import { IUploadedFile } from '../../common/interfaces/IUploadedFile'
import * as IdentityModule from '../../modules/identity'

declare global {
  namespace Express {
    export interface Request {
      fromIdentity?: IdentityModule.types.IIdentity
      files?: Map<string, IUploadedFile>
    }
  }
}

export {}
