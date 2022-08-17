const { Sequelize } = require('sequelize')

const debug = require('debug')('app:main')
const config = require('config')

const sequelize = new Sequelize('test-db', 'user', 'pass', {
  dialect: 'sqlite',
  host: './Mokarrar.db',
})
module.exports = sequelize
   