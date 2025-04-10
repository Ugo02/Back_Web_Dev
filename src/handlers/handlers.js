import { getHashFromClearText } from '../utils/crypto.js';
import User from '../models/user-model.js';
import Movie from '../models/movie-model.js';
import jwt from 'jsonwebtoken';

export async function helloHandler(request, reply) {
  return { hello: 'world' };
}

export async function createUserHandler(request, reply) {
  const { username, password: clearPassword, email } = request.body;
  const password = getHashFromClearText(clearPassword);
  const user = new User({ username, password, email });
  await user.save();
  reply.status(201).send(user);
  return user;
}

export async function tokenHandler(request, reply) {
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
    token: createJWT(user) 
  };
}

function createJWT(user) {
    return jwt.sign(
      { 
        id: user._id, 
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }


export async function createMovieHandler(request, reply) {
  const { name, rating } = request.body;
  const userId = request.user.id; // Fetch the JWT token
  
  const movie = new Movie({ name, rating, userId });
  await movie.save();
  
  return reply.status(201).send(movie);
}

export async function getMoviesHandler(request, reply) {
  const userId = request.user.id;
  const movies = await Movie.find({ userId }).sort({ rating: -1 }); // Sort by descending rating
  
  return movies;
}
