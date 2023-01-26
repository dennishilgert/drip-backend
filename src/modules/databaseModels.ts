import { DataTypes, Sequelize } from 'sequelize'
import glob from 'glob'
import path from 'path'
import { asNumber, asString } from '../common/helpers/dataHelper'

const database: any = {}

const databaseName: string = asString(process.env.DB_DATABASE)
const username: string = asString(process.env.DB_USERNAME)
const password: string = asString(process.env.DB_PASSWORD)
const maxConnectionsPerPool: number = asNumber(process.env.DB_MAX_CONNECTIONS_PER_POOL)

logger.debug('database', databaseName)
logger.debug('username', username)
logger.debug('maxConnectionsPerPool', maxConnectionsPerPool)

const sequelize: Sequelize = new Sequelize(databaseName, username, password, {
  dialect: 'mariadb',
  host: asString(process.env.DB_HOST),
  port: asNumber(process.env.DB_PORT),
  pool: {
    max: maxConnectionsPerPool,
    min: 2,
    acquire: 30000,
    idle: 10000
  },
  benchmark: true, // passes the query execution time as second arg to logging method
  logging: (queryString, execTimeMs) => {
    if (asNumber(execTimeMs) > asNumber(process.env.DB_SLOW_QUERY_THRESHOLD)) {
      logger.warn(`Slow sequelize query ${execTimeMs}ms`, {
        queryString
      })
    }
  }
})

const modelFiles = glob.sync(path.join(__dirname, '/', '**/*Model.*s'))

modelFiles.forEach((file: string) => {
  // since `modelFiles` and consequently `files` don't depend on user input, we can safely require these dynamic files
  const module: any = require(file)
  const factory: any = typeof module === 'function' ? module : module.default
  const model: any = factory(sequelize, DataTypes)
  database[model.name] = model
})

Object.keys(database).forEach((modelName) => {
  if (database[modelName].associate) {
    database[modelName].associate(database)
  }
})

database.sequelize = sequelize
database.Sequelize = Sequelize

export default database
