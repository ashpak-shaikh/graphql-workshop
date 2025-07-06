const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie,
  addReview, updateReview, deleteReview, filterByGenre, filterByYear,
  getTopRated, getRecent, searchMovies } = require('./data/movieService');

const fs = require('fs');
const path = require('path');

// Load schema from file
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf-8'
);

// Resolvers
const resolvers = {
  Query: {
    movies: () => getAllMovies(),
    movie: (_, { id }) => getMovieById(id),
    moviesByGenre: (_, { genre }) => filterByGenre(genre),
    moviesByYear: (_, { year }) => filterByYear(year),
    topRatedMovies: (_, { limit }) => getTopRated(limit),
    recentMovies: (_, { limit }) => getRecent(limit),
    searchMovies: (_, { query }) => searchMovies(query)
  },
  Mutation: {
    addMovie: (_, { movie }) => addMovie(movie),
    updateMovie: (_, { id, movie }) => updateMovie(id, movie),
    deleteMovie: (_, { id }) => deleteMovie(id),
    addReview: (_, { review }) => addReview(review),
    updateReview: (_, { id, review }) => updateReview(id, review),
    deleteReview: (_, { id }) => deleteReview(id)
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  cors: true
});

// Start the server
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
