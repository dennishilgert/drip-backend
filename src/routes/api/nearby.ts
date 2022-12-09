import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../util/asyncHandlerDecorator'
import nearbyController from '../controller/nearbyController'

const router = Router()

router.get(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  asyncHandlerDecorator(nearbyController.getNearbyIp)
)

router.get(
  '/geolocation',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  asyncHandlerDecorator(nearbyController.getNearbyGeolocation)
)

export default router