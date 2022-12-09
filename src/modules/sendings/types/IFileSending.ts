import { ISending } from './ISending'

export interface IFileSending extends ISending {
  uuid: string
  toName: string
  fileOriginalName: string
  fileName: string
  filePath: string
  fileMimeType: string
}