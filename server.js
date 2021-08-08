// Require the framework and instantiate it

require('dotenv').config();


const fastify = require('fastify')({
    logger: false
  })


  const db = require('./app/models')

   db.connection.authenticate()
      .then(()=>{
          fastify.log.info('Database connected')
          db.connection.sync()
      })
      .catch(err=>fastify.log.error(err))
   
  // Declare a route
  fastify.get('/', function (request, reply) {
    console.log(fastify);
    reply.send({ hello: 'world' })
  })

  fastify.register(require('./app/middlewares/authenticate'),{logLevel:'debug'})
  fastify.register(require('./routes'),{logLevel:'debug'})


  const PORT = process.env.PORT || 3000
  
  // Run the server!
  fastify.listen(PORT, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })