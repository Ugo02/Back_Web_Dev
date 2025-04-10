import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { connect } from './db/connect.js';
import { helloHandler, createUserHandler, tokenHandler, createMovieHandler, getMoviesHandler } from './handlers/handlers.js';
import jwt from 'jsonwebtoken';


dotenv.config();

const port = process.env.PORT;

const fastify = Fastify({
  logger: true
});

await fastify.register(cors);

// Public routes
fastify.get('/api/hello', helloHandler);
fastify.post('/api/users', createUserHandler);
fastify.post('/api/token', tokenHandler);


//Private routes 
function authenticate(request, reply, done) {  
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      reply.code(401).send({ error: 'Unauthorized' });
      return done(); 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded; 
    done(); 
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
    return done(); 
  }
}

fastify.post('/api/movies', { preHandler: authenticate}, createMovieHandler);

fastify.get('/api/movies', { preHandler: authenticate }, getMoviesHandler);

// Run the server!
try {
  await connect();
  await fastify.listen({ port, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}