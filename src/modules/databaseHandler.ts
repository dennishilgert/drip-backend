import { injectable } from 'inversify'
import { IDatabaseModel } from '../common/interfaces'

@injectable()
abstract class DatabaseHandler<T extends IDatabaseModel> {
  
}

export default DatabaseHandler