import BaseTransformer from '../../../common/transformers/baseTransformer'
import _ from 'lodash'
import { ITransformedTransmissionRequest, ITransmissionRequest } from '../types'

class TransmissionRequestTransformer extends BaseTransformer {
	private readonly transmissionRequest: ITransmissionRequest

	constructor(transmissionRequest: ITransmissionRequest) {
		super()
		this.transmissionRequest = transmissionRequest
	}

	transform(): ITransformedTransmissionRequest {
		const omitProperties: Array<string> = ['transmissionUuid']
		const transformedTransmissionRequest: ITransformedTransmissionRequest =
			_.omit(
				this.transmissionRequest,
				omitProperties
			) as ITransformedTransmissionRequest
		return transformedTransmissionRequest
	}
}

export default TransmissionRequestTransformer
