import ServiceError from './ServiceError'

class InternalError extends ServiceError {
	/**
	 * @param {string} message Error message
	 * @param {number} errorCode Custom error code
	 * @param {Array<any>} errors Additional errors (e.g. validation one)
	 */
	constructor(message: string, errorCode: any = null, errors: Array<any> = []) {
		super(message, 500, errorCode, errors)
	}
}

export default InternalError
