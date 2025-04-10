import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { connect } from './db/connect.js';
import { helloHandler, createUserHandler, tokenHandler, createMovieHandler, getMoviesHandler } from './handlers/handlers.js';

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
function authenticate(request, reply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      reply.code(401).send({ error: 'Unauthorized' });
      return; // ⚠️ Important : arrête l'exécution !
    }
    request.user = jwt.verify(token, process.env.JWT_SECRET); // Décode et attache l'user
    // Pas de return ni de throw : laisse Fastify continuer vers le handler
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
    // ⚠️ Ne pas throw ! Juste répondre avec 401.
  }
}

fastify.post('/api/movies', (request, reply) => {
  authenticate(request, reply);
  return createMovieHandler(request, reply);
});

fastify.get('/api/movies', (request, reply) => {
  authenticate(request, reply);
  return getMoviesHandler(request, reply);
});

// Run the server!
try {
  await connect();
  await fastify.listen({ port, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}