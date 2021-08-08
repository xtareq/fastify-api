

const Sequelize = require('sequelize')
const {connection } = require('../../config/database')


const db = {}
db.connection= connection
db.user = require('./user')(connection,Sequelize)


module.exports = db 