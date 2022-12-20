import { ITransformation } from '../interfaces/ITransformation'

class BaseTransformer {
	transform(): ITransformation {
		throw new Error(
			'Transform method must be implemented by the child transformer'
		)
	}
}

export default BaseTransformer
