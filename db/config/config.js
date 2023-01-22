module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    migrationStorage: 'json',
    migrationStoragePath: 'sequelize-meta.json',
    seederStorage: 'json',
    seederStoragePath: 'sequelize-data.json'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    migrationStorage: 'json',
    migrationStoragePath: 'sequelize-meta.json',
    seederStorage: 'json',
    seederStoragePath: 'sequelize-data.json'
  }
}
