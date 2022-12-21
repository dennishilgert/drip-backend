/**
 * Generic service error with possibility to add response code
 * @property {string} name Name of it
 * @extends Error
 */
class ServiceError extends Error {
  declare status: number
  declare code: any
  declare errors: any[]

  /**
   * @param {string} message Error message
   * @param {number} [status=500] Status code for http response
   * @param {number|string} [errorCode=null] Custom error code (e.g. some 3rd party error codes)
   * @param {Array<any>} [errors=[]] Additional errors (e.g. validation one)
   */
  constructor (
    message: string,
    status: number = 500,
    errorCode: any = null,
    errors: Array<any> = []
  ) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.status = status
    this.code = errorCode || status // keep it for back compatibility with existent error classes
    this.errors = errors
  }

  toJSON () {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
      code: this.code,
      errors: this.errors,
      stack: this.stack
    }
  }

  toString () {
    return `${this.code} - ${this.message}`
  }
}

export default ServiceError
