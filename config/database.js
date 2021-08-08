

const Sequelize = require('sequelize')

exports.connection = new Sequelize(process.env.DB_URL)

// module.exports= (fastify)=>{
//     connection.authenticate().then((r)=>fastify.log.info("database connected"))
//     .catch(err=>fastify.log.error(err))

//     return {connection}
// }