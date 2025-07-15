const DataLoader = require('dataloader');
const { getAllMovies } = require('./movieService');

// Create DataLoader instance with batch loading
const movieLoader = new DataLoader(
  async (movieIds) => {
    console.log(`\nBatch loading movies for IDs: ${movieIds.join(', ')}`);
    
    // Load all movies once and filter by IDs
    const allMovies = await getAllMovies();
    console.log(`Loaded ${allMovies.length} movies from file`);
    
    const movies = movieIds.map(id => {
      const movie = allMovies.find(m => m.id === id);
      if (!movie) {
        console.log(`Movie with id ${id} not found`);
        return null;
      }
      console.log(`Found movie with id ${id}: ${movie.title}`);
      return movie;
    });
    
    console.log(`Batch loaded ${movies.length} movies\n`);
    return movies;
  },
  { cache: false }
);


module.exports = movieLoader;