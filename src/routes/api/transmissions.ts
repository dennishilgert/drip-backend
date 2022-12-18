import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../util/asyncHandlerDecorator'
import transmissionsController from '../controller/transmissionsController'
import isAuthenticated from '../middlewares/authenticationMiddleware'
import formDataParser from '../middlewares/formDataMiddleware'

const router = Router()

/**
 * @swagger
 * /transmissions/message:
 *  post:
 *    tags:
 *      - transmissions
 *    summary: Send a message transmission request to a other identity
 *    description: Send a message transmission request to a other identity
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      description: Send a message transmission request to a other identity
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              toName:
 *                type: string
 *                description: Name of the receiving identity
 *                example: Anonymous Blobfish
 *              message:
 *                type: string
 *                description: Message to transmit
 *                example: Hello how are you today?
 *    responses:
 *      200:
 *        description: Request sent
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                requestUuid:
 *                  type: string
 *                  format: uuid
 *                  description: UUID of the created request
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      409:
 *        $ref: '#/components/responses/ConflictError'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.post(
  '/message',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
      toName: Joi.string().required(),
      message: Joi.string().min(1).max(256).required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(transmissionsController.transmitMessage)
)

/**
 * @swagger
 * /transmissions/file:
 *  post:
 *    tags:
 *      - transmissions
 *    summary: Send a file transmission request to a other identity
 *    description: Send a file transmission request to a other identity
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      description: Send a file transmission request to a other identity
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              toName:
 *                type: string
 *                description: Name of the receiving identity
 *                example: Anonymous Blobfish
 *              fileToTransmit:
 *                type: string
 *                format: binary
 *                description: File to transmit
 *    responses:
 *      200:
 *        description: Request sent
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                requestUuid:
 *                  type: string
 *                  format: uuid
 *                  description: UUID of the created request
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      409:
 *        $ref: '#/components/responses/ConflictError'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.post(
  '/file',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  formDataParser,
  isAuthenticated,
  asyncHandlerDecorator(transmissionsController.transmitFile)
)

/**
 * @swagger
 * /transmissions/message/{uuid}:
 *  get:
 *    tags:
 *      - transmissions
 *    summary: Retrieve a message transmission
 *    description: Retrieve a message transmission
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        required: true
 *        description: UUID of the message transmission
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Retrieve message
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *              description: Content of the message
 *              example: Hello how are you today?
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.get(
  '/message/:uuid',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(transmissionsController.retrieveMessage)
)

/**
 * @swagger
 * /transmissions/file/{uuid}:
 *  get:
 *    tags:
 *      - transmissions
 *    summary: Retrieve a file transmission
 *    description: Retrieve a file transmission
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        required: true
 *        description: UUID of the file transmission
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Retrieve file
 *        content:
 *          application/octet-stream:
 *            schema:
 *              type: string
 *              format: binary
 *              description: Transmitted file
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.get(
  '/file/:uuid',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(transmissionsController.retrieveFile)
)

export default router