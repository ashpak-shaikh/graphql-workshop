const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie,
  addReview, updateReview, deleteReview, filterByGenre, filterByYear,
  getTopRated, getRecent, searchMovies, authenticateUser, registerUser, generateToken } = require('./data/movieService');
const { authDirective } = require('./directives/authDirective');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, 'your-secret-key-here');
      req.user = decoded;
    } catch (error) {
      // Token verification failed, continue without user
    }
  }
  next();
};

// Create Express app
const app = express();
app.use(authMiddleware);

// Load schema from file
const schema = loadSchemaSync('./schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});

// Resolvers
const resolvers = {
  Query: {
    movies: (_, __, { user }) => getAllMovies(),
    movie: (_, { id }, { user }) => getMovieById(id),
    moviesByGenre: (_, { genre }, { user }) => filterByGenre(genre),
    moviesByYear: (_, { year }, { user }) => filterByYear(year),
    topRatedMovies: (_, { limit }, { user }) => getTopRated(limit),
    recentMovies: (_, { limit }, { user }) => getRecent(limit),
    searchMovies: (_, { query }, { user }) => searchMovies(query),
    me: (_, __, { user }) => user
  },
  Mutation: {
    addMovie: (_, { movie }, { user }) => addMovie(movie, user?.id),
    updateMovie: (_, { id, movie }, { user }) => updateMovie(id, movie, user?.id),
    deleteMovie: (_, { id }, { user }) => deleteMovie(id, user?.id),
    addReview: (_, { review }, { user }) => addReview(review, user?.id),
    updateReview: (_, { id, review }, { user }) => updateReview(id, review, user?.id),
    deleteReview: (_, { id }, { user }) => deleteReview(id, user?.id),
    register: async (_, { email, password, name }) => {
      const user = await registerUser(email, password, name);
      const token = generateToken(user);
      return {
        token,
        user
      };
    },
    login: async (_, { email, password }) => {
      const user = await authenticateUser(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const token = generateToken(user);
      return {
        token,
        user
      };
    }
  }
};

    try {
      const decoded = jwt.verify(token, 'your-secret-key-here');
      req.user = decoded;
    } catch (error) {
      // Token verification failed, continue without user
    }
// Add auth directive
const schemaWithDirectives = addResolversToSchema({
  schema,
  resolvers,
  directiveResolvers: {
    auth: authDirective
  }
});

async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer({
    schema: schemaWithDirectives,
    context: ({ req }) => ({
      user: req.user
    }),
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
  });

  // Apply middleware
  app.use(authMiddleware);

  // Start the server
  await server.start();

  // Apply Apollo Server middleware
  server.applyMiddleware({
    app,
    path: '/graphql',
    onHealthCheck: () => Promise.resolve()
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(console.error);
