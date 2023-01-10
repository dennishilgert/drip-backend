import BaseTransformer from '../../common/transformers/baseTransformer'
import * as TransmissionsModule from '../../modules/transmissions'
import _ from 'lodash'

class FileTransmissionApiTransformer extends BaseTransformer {
  private readonly fileTransmission: TransmissionsModule.types.IFileTransmission

  constructor(fileTransmission: TransmissionsModule.types.IFileTransmission) {
    super()
    this.fileTransmission = fileTransmission
  }

  transform(): TransmissionsModule.types.ITransformedFileTransmission {
    const pickProperties: Array<string> = ['uuid', 'fromName', 'fileOriginalName', 'fileMimeType']
    const transformedFileTransmission: TransmissionsModule.types.ITransformedFileTransmission = _.pick(
      this.fileTransmission,
      pickProperties
    ) as TransmissionsModule.types.ITransformedFileTransmission
    return transformedFileTransmission
  }
}

export default FileTransmissionApiTransformer
