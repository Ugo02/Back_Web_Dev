// Import the framework and instantiate it
import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import User from './users/user-model.js'
import {connect } from './db/connect.js'
import {getHashFromClearText } from './utils/crypto.js'

dotenv.config()

const port = process.env.PORT

const fastify = Fastify({
  logger: true
})
await fastify.register(cors)

fastify.get('/api/hello', async function handler (request, reply) {
  return { hello: 'world' }
})


fastify.post('/api/users', async function handler (request, reply) {
  const {username, password : clearPassword, email } = request.body; // Retrieving sent credentials
  const password = getHashFromClearText(clearPassword)
  const user = new User({username, password, email})
  await user.save()
  reply.status(201).send(user)
  return user
})

fastify.post('/api/token', async function handler (request, reply) {
  const user = await User.findOne({ username: request.body.username });
  
  if (!user) {
    return reply.status(401).send({
      error: 401,
      message: 'User not found'
    });
  }

  if (!user.comparePassword(request.body.password)) {
    return reply.status(401).send({ 
        error: 'Invalid credentials' 
    });
  }

  return {
    token: createJWT()
  };
});

function createJWT (){
  return 'todo'
}

// Run the server!
try {
  await connect()
  await fastify.listen({ port, host:'0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}