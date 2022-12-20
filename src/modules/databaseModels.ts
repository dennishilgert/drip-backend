import { DataTypes, Sequelize } from 'sequelize'
import glob from 'glob'
import path from 'path'

const database: any = {}

const sequelize: Sequelize = new Sequelize('database', 'username', 'password', {
	dialect: 'sqlite',
	storage: process.env.DB_STORAGE || './database.sqlite',
	logging: (sql: string) => {
		logger.debug(sql)
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
