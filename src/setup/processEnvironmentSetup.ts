import dotenv from 'dotenv'
import path from 'path'

// Load the environment vairables
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Add global logger instance
// eslint-disable-next-line import/first
import { logger } from '../common/util/loggingUtil'
// @ts-expect-error
global.logger = logger
