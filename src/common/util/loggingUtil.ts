import winston from 'winston'
import _ from 'lodash'
import { asString } from '../helpers/dataHelper'

const formatters: winston.Logform.Format[] = (['production'].includes(asString(process.env.NODE_ENV)))
  ? [ // https://github.com/winstonjs/winston/issues/1338
      winston.format.printf((info) => {
        return JSON.stringify(info, (key: string, value: object) => {
          if (value instanceof Error) {
            return { name: value.name, message: value.message, stack: value.stack }
          }
          return value
        })
      })
    ]
  : [
      winston.format.colorize({ all: true }),
      winston.format.align(),
      winston.format.printf((info) => {
        const { level, message, ...args } = info
        const stack = _.get(args, 'error.stack') || _.get(args, 'err.stack', '')
        const stringified = Object.keys(args).length ? JSON.stringify(args, errorReplacer) : ''
        return `[${level}]:${message} ${stringified}${stack ? '\n' : ''}${stack}`
      })
    ]

const transports: winston.transports.ConsoleTransportInstance[] = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info'
  })
]

function errorReplacer (key: string, value: any): string {
  if (key === 'stack') return '...'
  if (value instanceof Error) return value.message
  return value
}

function loggerFactory (): winston.Logger {
  return winston.createLogger({
    format: winston.format.combine(...formatters),
    transports
  })
}

export const logger: winston.Logger = loggerFactory()