import { NextFunction, Request, Response, Router } from 'express'
import apiRouter from './api'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const router = Router()

/**
 * Add root path of the api
 */
router.use('/api', apiRouter)

/**
 * Add Swagger for auto-generation of api-docs
 */
const swaggerDefinition: swaggerJsDoc.OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description:
      'This is the documentation of the REST API for the Drip application'
  },
  servers: [
    {
      url: 'http://localhost:8081/api',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'identities',
      description: 'Everything about identities'
    },
    {
      name: 'nearby',
      description: 'Everything about nearby identities'
    },
    {
      name: 'transmissions',
      description: 'Everything about transmissions'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'uuid'
      }
    },
    responses: {
      BadRequestError: {
        description: 'BadRequest',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the error',
                  example: 'BadRequestError'
                },
                status: {
                  type: 'integer',
                  description: 'Status of the response',
                  example: 400
                },
                code: {
                  type: 'integer',
                  description: 'Code of the error',
                  example: 400
                },
                stack: {
                  type: 'string',
                  description: 'Stack of the error',
                  example:
                    'BadRequestError Provided identity does not have a geolocation ...'
                },
                message: {
                  type: 'string',
                  description: 'Message of the error',
                  example: 'Provided identity does not have a geolocation'
                }
              }
            }
          }
        }
      },
      UnauthorizedError: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the error',
                  example: 'UnauthorizedError'
                },
                status: {
                  type: 'integer',
                  description: 'Status of the response',
                  example: 401
                },
                code: {
                  type: 'integer',
                  description: 'Code of the error',
                  example: 401
                },
                stack: {
                  type: 'string',
                  description: 'Stack of the error',
                  example:
                    'UnauthorizedError Provided auth-token is invalid ...'
                },
                message: {
                  type: 'string',
                  description: 'Message of the error',
                  example: 'Provided auth-token is invalid'
                }
              }
            }
          }
        }
      },
      NotFoundError: {
        description: 'NotFound',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the error',
                  example: 'NotFoundError'
                },
                status: {
                  type: 'integer',
                  description: 'Status of the response',
                  example: 404
                },
                code: {
                  type: 'integer',
                  description: 'Code of the error',
                  example: 404
                },
                stack: {
                  type: 'string',
                  description: 'Stack of the error',
                  example:
                    'IdentityNotFoundError Requested identity does not exist ...'
                },
                message: {
                  type: 'string',
                  description: 'Message of the error',
                  example: 'Requested identity does not exist'
                }
              }
            }
          }
        }
      },
      ConflictError: {
        description: 'Conflict',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the error',
                  example: 'ConflictError'
                },
                status: {
                  type: 'integer',
                  description: 'Status of the response',
                  example: 409
                },
                code: {
                  type: 'integer',
                  description: 'Code of the error',
                  example: 409
                },
                stack: {
                  type: 'string',
                  description: 'Stack of the error',
                  example:
                    'IdentityNotConnectedError Target Identity is not connected ...'
                },
                message: {
                  type: 'string',
                  description: 'Message of the error',
                  example: 'Target Identity is not connected'
                }
              }
            }
          }
        }
      },
      ValidationError: {
        description: 'ValidationFailed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the error',
                  example: 'ValidationFailedError'
                },
                status: {
                  type: 'integer',
                  description: 'Status of the response',
                  example: 422
                },
                code: {
                  type: 'integer',
                  description: 'Code of the error',
                  example: 422
                },
                stack: {
                  type: 'string',
                  description: 'Stack of the error',
                  example: 'Error Validation failed ...'
                },
                message: {
                  type: 'string',
                  description: 'Message of the error',
                  example: 'Validation failed'
                }
              }
            }
          }
        }
      },
      InternalError: {
        description: 'InternalError',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the error',
                  example: 'InternalError'
                },
                status: {
                  type: 'integer',
                  description: 'Status of the response',
                  example: 500
                },
                code: {
                  type: 'integer',
                  description: 'Code of the error',
                  example: 500
                },
                stack: {
                  type: 'string',
                  description: 'Stack of the error',
                  example: 'InternalError Failed to retrieve identity ...'
                },
                message: {
                  type: 'string',
                  description: 'Message of the error',
                  example: 'Failed to retrieve identity'
                }
              }
            }
          }
        }
      }
    }
  }
}
const options: swaggerJsDoc.Options = {
  swaggerDefinition,
  // Path to files containing OpenAPI definitions
  apis: ['src/routes/api/*.ts']
}
const swaggerSpec = swaggerJsDoc(options)
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

router.use('/api-docs-json', (req: Request, res: Response, next: NextFunction) => {
  res
    .status(200)
    .type('application/json')
    .send(JSON.stringify(swaggerSpec, null, 2))
  next()
})

export default router
