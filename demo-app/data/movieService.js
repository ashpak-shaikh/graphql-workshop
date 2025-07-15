const fs = require('fs');
const path = require('path');

// Load movies from JSON file
const loadMovies = () => {
  console.log('Service: Loading movies from JSON file');
  const moviesPath = path.join(__dirname, 'movies.json');
  const moviesData = fs.readFileSync(moviesPath, 'utf-8');
  const movies = JSON.parse(moviesData);
  console.log(`Service: Loaded ${movies.length} movies`);
  return movies;
};

// Save movies to JSON file
const saveMovies = (movies) => {
  console.log('Service: Saving movies to JSON file');
  const moviesPath = path.join(__dirname, 'movies.json');
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2));
  console.log('Service: Movies saved successfully');
};

// Get all movies
const getAllMovies = () => {
  console.log('Service: Getting all movies');
  const movies = loadMovies();
  // Ensure all movies have timestamps
  return movies.map(movie => ({
    ...movie,
    createdAt: movie.createdAt || new Date().toISOString(),
    updatedAt: movie.updatedAt || new Date().toISOString()
  }));
};

// Get a single movie by ID
const getMovieById = (id) => {
  console.log(`Service: Getting movie by id: ${id}`);
  const movies = loadMovies();
  const movie = movies.find(m => m.id === id);
  if (!movie) return null;
  return {
    ...movie,
    createdAt: movie.createdAt || new Date().toISOString(),
    updatedAt: movie.updatedAt || new Date().toISOString()
  };
};

// Get movies by language
const getMoviesByLanguage = (language) => {
  console.log(`Service: Getting movies by language: ${language}`);
  const upperCaseLanguage = String(language).toUpperCase();
  const movies = loadMovies();
  // Always return an array, even if empty
  return movies.filter(movie => movie.language === upperCaseLanguage) || [];
};

// Add a new movie
const addMovie = (movie) => {
  console.log('Service: Adding new movie:', movie.title);
  const movies = loadMovies();
  const newMovie = {
    id: (movies.length + 1).toString(),
    ...movie,
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  movies.push(newMovie);
  saveMovies(movies);
  console.log('Service: Movie added successfully:', newMovie.title);
  return newMovie;
};

// Update a movie
const updateMovie = (id, updates) => {
  console.log(`Service: Updating movie with id: ${id}`);
  const movies = loadMovies();
  const movieIndex = movies.findIndex(m => m.id === id);
  if (movieIndex === -1) {
    throw new Error('Movie not found');
  }
  movies[movieIndex] = {
    ...movies[movieIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveMovies(movies);
  console.log('Service: Movie updated successfully:', movies[movieIndex].title);
  return movies[movieIndex];
};

// Delete a movie
const deleteMovie = (id) => {
  console.log(`Service: Deleting movie with id: ${id}`);
  const movies = loadMovies();
  const movieIndex = movies.findIndex(m => m.id === id);
  if (movieIndex === -1) {
    throw new Error('Movie not found');
  }
  const deletedMovie = movies[movieIndex];
  movies.splice(movieIndex, 1);
  saveMovies(movies);
  console.log('Service: Movie deleted successfully:', deletedMovie.title);
  return deletedMovie;
};

// Add a review to a movie
const addReview = (review) => {
  console.log(`Service: Adding review for movie: ${review.movieId}`);
  const movies = loadMovies();
  const movie = movies.find(m => m.id === review.movieId);
  if (!movie) {
    throw new Error('Movie not found');
  }
  const newReview = {
    id: (movie.reviews.length + 1).toString(),
    movieId: review.movieId,
    rating: review.rating,
    comment: review.comment || '',
    reviewer: review.reviewer,
    createdAt: new Date().toISOString()
  };
  movie.reviews.push(newReview);
  saveMovies(movies);
  console.log('Service: Review added successfully');
  return newReview;
};

// Update a review
const updateReview = (id, updates) => {
  console.log(`Service: Updating review with id: ${id}`);
  const movies = loadMovies();
  const movie = movies.find(m => m.reviews.some(r => r.id === id));
  if (!movie) {
    throw new Error('Movie not found');
  }
  const reviewIndex = movie.reviews.findIndex(r => r.id === id);
  if (reviewIndex === -1) {
    throw new Error('Review not found');
  }
  movie.reviews[reviewIndex] = {
    ...movie.reviews[reviewIndex],
    ...updates
  };
  saveMovies(movies);
  console.log('Service: Review updated successfully');
  return movie.reviews[reviewIndex];
};

// Delete a review
const deleteReview = (id) => {
  console.log(`Service: Deleting review with id: ${id}`);
  const movies = loadMovies();
  const movie = movies.find(m => m.reviews.some(r => r.id === id));
  if (!movie) {
    throw new Error('Movie not found');
  }
  const reviewIndex = movie.reviews.findIndex(r => r.id === id);
  if (reviewIndex === -1) {
    throw new Error('Review not found');
  }
  const deletedReview = movie.reviews[reviewIndex];
  movie.reviews.splice(reviewIndex, 1);
  saveMovies(movies);
  console.log('Service: Review deleted successfully');
  return deletedReview;
};

// Filter movies by genre
const filterByGenre = (genre) => {
  console.log(`Service: Filtering movies by genre: ${genre}`);
  const movies = loadMovies();
  return movies.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
};

// Filter movies by year
const filterByYear = (year) => {
  console.log(`Service: Filtering movies by year: ${year}`);
  const movies = loadMovies();
  return movies.filter(movie => movie.releaseYear === year);
};

// Get top rated movies
const getTopRated = (limit = 10) => {
  console.log(`Service: Getting top rated movies (limit: ${limit})`);
  const movies = loadMovies();
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

// Get recent movies
const getRecent = (limit = 10) => {
  console.log(`Service: Getting recent movies (limit: ${limit})`);
  const movies = loadMovies();
  return [...movies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
};

// Search movies
const searchMovies = (query) => {
  console.log(`Service: Searching movies for query: ${query}`);
  const movies = loadMovies();
  const searchQuery = query.toLowerCase();
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery) ||
    movie.director.toLowerCase().includes(searchQuery) ||
    movie.genre.toLowerCase().includes(searchQuery)
  );
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  addReview,
  updateReview,
  deleteReview,
  filterByGenre,
  filterByYear,
  getTopRated,
  getRecent,
  searchMovies,
  getMoviesByLanguage
};
