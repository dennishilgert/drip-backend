import ServiceError from './ServiceError'

class PreconditionFailedError extends ServiceError {
  /**
   * @param {string} message Error message
   * @param {number} errorCode Custom error code
   * @param {Array<any>} errors Additional errors (e.g. validation one)
   */
  constructor(message: string, errorCode: any = null, errors: Array<any> = []) {
    super(message, 412, errorCode, errors)
  }
}

export default PreconditionFailedError
