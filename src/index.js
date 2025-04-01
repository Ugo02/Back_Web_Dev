import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { connect } from './db/connect.js';
import { helloHandler, createUserHandler, tokenHandler } from './handlers/handlers.js';

dotenv.config();

const port = process.env.PORT;

const fastify = Fastify({
  logger: true
});

await fastify.register(cors);

// Routes
fastify.get('/api/hello', helloHandler);
fastify.post('/api/users', createUserHandler);
fastify.post('/api/token', tokenHandler);

// Run the server!
try {
  await connect();
  await fastify.listen({ port, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}