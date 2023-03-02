// load process environmenmt setup first
import './setup/processEnvironmentSetup'

import express, { Application } from 'express'
import helmet from 'helmet'
import { errors } from 'celebrate'
import { Server, Socket } from 'socket.io'
import { asNumber } from './common/helpers/dataHelper'
import { container } from './modules/dependencyContainer'
import * as SocketModule from './modules/socket'

import router from './routes'

const server: Application = express()
const io: Server = new Server({
  cors: {
    origin: process.env.NODE_ENV === 'development' ? process.env.APP_DEV_URL : process.env.APP_URL
  }
})

const socketService: SocketModule.interfaces.ISocketService = container.get(SocketModule.DI_TYPES.SocketService)

server
  // inject express included body-parser to handle requests with json body
  .use(express.json())

  // inject helmet to add headers that help to keep the application secure
  .use(helmet())

  // inject router to handle the request routes
  .use('/', router)

  // inject celebrate error handler middleware
  .use(errors())

server.listen(process.env.API_PORT || 8081, () => {
  logger.info(`API-Server is listening on port ${process.env.API_PORT || 8081}`)
  logger.info(`API-Docs are available under http://localhost:${process.env.API_PORT || 8081}/api-docs`)
})

io.on(SocketModule.enums.SocketEvent.CONNECT, (socket: Socket) => {
  logger.debug('Socket-Client connected')

  const timeout: NodeJS.Timeout = setTimeout(() => {
    socket.disconnect(true)
    logger.debug('Socket-Client has not identified itself before timeout - connection closed')
  }, 1000)

  socket.on(SocketModule.enums.SocketEvent.IDENTIFY, (uuid: string) => {
    clearTimeout(timeout)
    socketService.registerClient(socket, uuid)
  })
})

io.listen(asNumber(process.env.SOCKET_PORT || 8082))
logger.info(`Socket-Server is listening on port ${process.env.SOCKET_PORT || 8082}`)

export default server
