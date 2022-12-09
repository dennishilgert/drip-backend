import { celebrate, Joi, Segments } from 'celebrate'
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandlerDecorator from '../util/asyncHandlerDecorator'
import sendingsController from '../controller/sendingsController'

const router = Router()

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
  asyncHandlerDecorator(sendingsController.sendMessage)
)

router.post(
  '/file',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  asyncHandlerDecorator(sendingsController.sendFile)
)

router.get(
  '/:sendingUuid',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({
      authorization: Joi.string().required()
    }).unknown(true)
  }),
  asyncHandlerDecorator(sendingsController.downloadSending)
)

export default router