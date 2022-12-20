import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../util/asyncHandlerDecorator'
import identitiesController from '../controller/identitiesController'
import isAuthenticated from '../middlewares/authenticationMiddleware'

const router = Router()

/**
 * @swagger
 * /identities:
 *  post:
 *    tags:
 *      - identities
 *    summary: Retrieve a newly generated identity
 *    description: Retrieve a newly generated identity
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uuid:
 *                  type: string
 *                  format: uuid
 *                  description: UUID of the identity
 *                  example: f791638f-ce4c-44ed-bde4-760357e76da6
 *                name:
 *                  type: string
 *                  description: Name of the identity
 *                  example: Anonymous Blobfish
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.post('/', asyncHandlerDecorator(identitiesController.createIdentity))

/**
 * @swagger
 * /identities/{name}:
 *  get:
 *    tags:
 *      - identities
 *    summary: Lookup for an identity
 *    description: Lookup for an identity
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: Name of the identity to look for
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: Name of the matched identity
 *                  example: Anonymous Blobfish
 *
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
	'/:name',
	celebrate({
		[Segments.HEADERS]: Joi.object()
			.keys({
				authorization: Joi.string().required()
			})
			.unknown(true)
	}),
	isAuthenticated,
	asyncHandlerDecorator(identitiesController.lookupIdentity)
)

/**
 * @swagger
 * /identities/geolocation:
 *  patch:
 *    tags:
 *      - identities
 *    summary: Update the geolocation of an identity
 *    description: Update the geolocation of an identity
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      description: Update the geolocation of an identity
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              geolocation:
 *                type: object
 *                properties:
 *                  longitude:
 *                    type: integer
 *                    description: Longitude of the geolocation
 *                    example: 7.6307253
 *                  latitude:
 *                    type: integer
 *                    description: Latitude of the geolocation
 *                    example: 43.9649637
 *    responses:
 *      200:
 *        description: Updated
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    longitude:
 *                      type: integer
 *                      description: Longitude of the geolocation
 *                      example: 7.6307253
 *                    latitude:
 *                      type: integer
 *                      description: Latitude of the geolocation
 *                      example: 43.9649637
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.patch(
	'/geolocation',
	celebrate({
		[Segments.HEADERS]: Joi.object()
			.keys({
				authorization: Joi.string().required()
			})
			.unknown(true),
		[Segments.BODY]: Joi.object().keys({
			geolocation: Joi.object().keys({
				longitude: Joi.number().required(),
				latitude: Joi.number().required()
			})
		})
	}),
	isAuthenticated,
	asyncHandlerDecorator(identitiesController.updateLocation)
)

export default router
