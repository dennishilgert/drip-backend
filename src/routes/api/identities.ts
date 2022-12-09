import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../util/asyncHandlerDecorator'
import identitiesController from '../controller/identitiesController'

const router = Router()

router.post(
  '/',
  asyncHandlerDecorator(identitiesController.createIdentity)
)

router.patch(
  '/geolocation',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
      geolocation: Joi.object().keys({
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
      })
    })
  }),
  asyncHandlerDecorator(identitiesController.updateLocation)
)

router.delete(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  asyncHandlerDecorator(identitiesController.deleteIdentity)
)

export default router