import { ITransformation } from '../../common/interfaces/ITransformation'

class BaseApiTransformer {
  
  transform (): ITransformation {
    throw new Error('Transform method must be implemented by the child transformer')
  }
}

export default BaseApiTransformer