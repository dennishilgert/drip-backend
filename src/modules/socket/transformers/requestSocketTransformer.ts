import BaseTransformer from '../../../common/transformers/baseTransformer'
import { ISocketRequest, ITransformedSocketRequest } from '../types'
import _ from 'lodash'

class RequestSocketTransformer extends BaseTransformer {
  private readonly socketRequest: ISocketRequest

  constructor (socketRequest: ISocketRequest) {
    super()
    this.socketRequest = socketRequest
  }

  transform (): ITransformedSocketRequest {
    const omitProperties: Array<string> = ['fromUuid', 'toUuid']
    const transformedSocketRequest: ITransformedSocketRequest = _.omit(this.socketRequest, omitProperties) as ITransformedSocketRequest
    return transformedSocketRequest
  }
}

export default RequestSocketTransformer