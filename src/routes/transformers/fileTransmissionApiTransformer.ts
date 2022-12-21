import BaseTransformer from '../../common/transformers/baseTransformer'
import * as TransmissionsModule from '../../modules/transmissions'
import _ from 'lodash'

class FileTransmissionApiTransformer extends BaseTransformer {
  private readonly fileTransmission: TransmissionsModule.types.IFileSending

  constructor(fileTransmission: TransmissionsModule.types.IFileSending) {
    super()
    this.fileTransmission = fileTransmission
  }

  transform(): TransmissionsModule.types.ITransformedFileSending {
    const pickProperties: Array<string> = ['uuid', 'fromName', 'fileOriginalName', 'fileMimeType']
    const transformedFileTransmission: TransmissionsModule.types.ITransformedFileSending = _.pick(
      this.fileTransmission,
      pickProperties
    ) as TransmissionsModule.types.ITransformedFileSending
    return transformedFileTransmission
  }
}

export default FileTransmissionApiTransformer
