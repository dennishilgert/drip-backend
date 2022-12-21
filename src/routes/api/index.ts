import { NextFunction, Request, Response, Router } from 'express'
import cors from 'cors'
import timeout from 'connect-timeout'
import { asNumber } from '../../common/helpers/dataHelper'
import { NotFoundError, ServiceError, ServiceUnavailableError, ValidationError } from '../../errors'
import { isCelebrateError } from 'celebrate'
import identitiesRouter from './identities'
import nearbyRouter from './nearby'
import transmissionsRouter from './transmissions'

const router = Router()

/**
 * Add default headers
 */
router.use((req: Request, res: Response, next: NextFunction) => {
  // Disable caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')

  // Set content-type to JSON
  res.setHeader('Content-Type', 'application/json')

  next()
})

/**
 * Add CORS headers
 */
const corsOptions: cors.CorsOptions = {
  origin: process.env.NODE_ENV === 'development' ? process.env.APP_DEV_URL : process.env.APP_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
  maxAge: 300
}
router.use(cors(corsOptions))

/**
 * Add API timeout handler
 */
router.use(timeout(asNumber(process.env.API_TIMEOUT)))

/**
 * Inject module routers
 */
router.use('/identities', identitiesRouter)
router.use('/nearby', nearbyRouter)
router.use('/transmissions', transmissionsRouter)

/**
 * Add handler for requests to inexistent API endpoints
 */
router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('No API endpoint found'))
})

/**
 * Add handler for API errors
 */
router.use((err: any, req: Request, res: Response) => {
  let error = Object.assign({}, err)
  // saving the original error stack trace to not overwrite it when translating an unknown error to a generic one
  const originalStackTrace = err.stack

  // cast celebrate validation and unknown errors to app generic ones
  if (isCelebrateError(err)) {
    const errors = []

    // Iterate over the Map of errors to get the context key and message for the validation error.
    // The constant keySpecificErrors below contains the root-level keys eg. params, body.
    // Currently, we include all the errors to a single-level array of objects.
    for (const keySpecificErrors of error.details.values()) {
      errors.push(
        ...keySpecificErrors.details.map((error: any) => ({
          key: error.context.key,
          message: error.message.replace(/['"]/g, '')
        }))
      )
    }

    error = new ValidationError('Validation error', 422, errors)
  } else if (req.timedout) {
    // req.timedout is added by the connect-timeout middleware
    error = new ServiceUnavailableError('API response timeout')
  } else if (!(err instanceof ServiceError)) {
    logger.warn('Unknown error thrown. Consider extending it from the generic error classes', { err })
    error = new ServiceError(err.message, err.status || 500, err.code || 'UNKNOWN_ERROR')
  }

  error.stack = originalStackTrace
  error.message = err.message

  const requestInfo = req ? { url: `/api${req.url}`, method: req.method } : {}

  // logging only 5xx errors with error level to avoid false positive alerts for errors like 404, 401, etc
  if (err.status >= 500) {
    logger.error('Server API error', Object.assign(requestInfo, { error: err }))
  }

  if (process.env.NODE_ENV === 'production') {
    delete error.stack
  }

  res.status(error.status).json(error)
})

export default router
