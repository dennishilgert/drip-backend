import BaseApiTransformer from './baseApiTransformer'
import * as SendingsModule from '../../modules/sendings'
import _ from 'lodash'

class FileSendingApiTransformer extends BaseApiTransformer {
  private readonly fileSending: SendingsModule.types.IFileSending

  constructor (fileSending: SendingsModule.types.IFileSending) {
    super()
    this.fileSending = fileSending
  }

  transform(): SendingsModule.types.ITransformedFileSending {
    const pickProperties: Array<string> = ['uuid', 'fromName', 'fileOriginalName', 'fileMimeType']
    const transformedFileSending: SendingsModule.types.ITransformedFileSending = _.pick(this.fileSending, pickProperties) as SendingsModule.types.ITransformedFileSending
    return transformedFileSending
  }
}

export default FileSendingApiTransformer