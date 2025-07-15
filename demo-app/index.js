const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { getAllMovies, addMovie, updateMovie, deleteMovie,
  addReview, updateReview, deleteReview, filterByGenre, filterByYear,
  getTopRated, getRecent, searchMovies, getMoviesByLanguage } = require('./data/movieService');
const movieLoader = require('./data/movieLoader');

const fs = require('fs');
const path = require('path');

// Custom scalar types
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  parseValue(value) {
    // Handle both string and Date input
    return value instanceof Date ? value : new Date(value);
  },
  serialize(value) {
    // Handle both string and Date input
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});

// Load schema from file
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf-8'
);

// Resolvers
const resolvers = {
  Query: {
    movies: () => {
      console.log('Query: Fetching all movies');
      return getAllMovies();
    },
    movie: async (_, { id }) => {
      console.log(`Query: Fetching movie with id: ${id}`);
      return await movieLoader.load(id);
    },
    moviesByGenre: (_, { genre }) => {
      console.log(`Query: Fetching movies by genre: ${genre}`);
      return filterByGenre(genre);
    },
    moviesByYear: (_, { year }) => {
      console.log(`Query: Fetching movies from year: ${year}`);
      return filterByYear(year);
    },
    topRatedMovies: (_, { limit }) => {
      console.log(`Query: Fetching top rated movies (limit: ${limit || 'default'})`);
      return getTopRated(limit);
    },
    recentMovies: (_, { limit }) => {
      console.log(`Query: Fetching recent movies (limit: ${limit || 'default'})`);
      return getRecent(limit);
    },
    searchMovies: (_, { query }) => {
      console.log(`Query: Searching movies for query: ${query}`);
      return searchMovies(query);
    },
    moviesByLanguage: (_, { language }) => {
      console.log(`Query: Fetching movies by language: ${language}`);
      return getMoviesByLanguage(language);
    }
  },
  Mutation: {
    addMovie: (_, { movie }) => {
      console.log('Mutation: Adding new movie:', movie.title);
      return addMovie(movie);
    },
    updateMovie: (_, { id, movie }) => {
      console.log(`Mutation: Updating movie with id: ${id}`, movie.title);
      return updateMovie(id, movie);
    },
    deleteMovie: (_, { id }) => {
      console.log(`Mutation: Deleting movie with id: ${id}`);
      return deleteMovie(id);
    },
    addReview: (_, { review }) => {
      console.log(`Mutation: Adding review for movie: ${review.movieId}`);
      return addReview(review);
    },
    updateReview: (_, { id, review }) => {
      console.log(`Mutation: Updating review with id: ${id}`);
      return updateReview(id, review);
    },
    deleteReview: (_, { id }) => {
      console.log(`Mutation: Deleting review with id: ${id}`);
      return deleteReview(id);
    }
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  cors: true,
  scalars: {
    DateTime
  }
});

// Start the server
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
