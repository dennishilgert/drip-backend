import { DataTypes, Sequelize } from 'sequelize'
import glob from 'glob'
import path from 'path'
import { asNumber, asString } from '../common/helpers/dataHelper'

const database: any = {}

const sequelize: Sequelize = new Sequelize(
  asString(process.env.DB_DATABASE),
  asString(process.env.DB_USERNAME),
  asString(process.env.DB_PASSWORD),
  {
    dialect: 'mariadb',
    host: asString(process.env.DB_HOST),
    port: asNumber(process.env.DB_PORT),
    pool: {
      max: asNumber(process.env.DB_MAX_CONNECTIONS_PER_POOL),
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
  }
)

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
