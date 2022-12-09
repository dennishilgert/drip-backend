import { Router } from 'express'
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
    version: '1.0.0'
  }
}
const options: swaggerJsDoc.Options = {
  swaggerDefinition,
  // Path to files containing OpenAPI definitions
  apis: ['src/routes/api/*.ts']
}
const swaggerSpec = swaggerJsDoc(options)
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default router