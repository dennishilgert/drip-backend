import dotenv from 'dotenv'
import path from 'path'

// Load the environment vairables
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Add global logger instance
import { logger } from '../common/util/loggingUtil'
// @ts-expect-error
global.logger = logger