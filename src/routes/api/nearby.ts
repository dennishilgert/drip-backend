import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../util/asyncHandlerDecorator'
import nearbyController from '../controller/nearbyController'
import isAuthenticated from '../middlewares/authenticationMiddleware'

const router = Router()

/**
 * @swagger
 * /nearby:
 *  get:
 *    tags:
 *      - nearby
 *    summary: Retrieve nearby identities by ip address
 *    description: Retrieve nearby identities by ip address
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Nearby identities
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                nearbyIdentities:
 *                  type: array
 *                  description: Array of nearby identities
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        description: Name of the identity
 *                        example: Anonymous Blobfish
 *                      distance:
 *                        type: string
 *                        description: Distance between the requesting and the nearby identity
 *                        example: Same network
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.get(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(nearbyController.getNearbyIp)
)

/**
 * @swagger
 * /nearby/geolocation:
 *  get:
 *    tags:
 *      - nearby
 *    summary: Retrieve nearby identities by geolocation
 *    description: Retrieve nearby identities by geolocation
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Nearby identities
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                nearbyIdentities:
 *                  type: array
 *                  description: Array of nearby identities
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        description: Name of the identity
 *                        example: Anonymous Blobfish
 *                      distance:
 *                        type: string
 *                        description: Distance between the requesting and the nearby identity
 *                        example: 1.2 km
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      500:
 *        $ref: '#/components/responses/InternalError'
 */
router.get(
  '/geolocation',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(nearbyController.getNearbyGeolocation)
)

export default router