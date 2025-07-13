const fs = require('fs');
const path = require('path');

// Load movies from JSON file
const loadMovies = () => {
  const moviesPath = path.join(__dirname, 'movies.json');
  const moviesData = fs.readFileSync(moviesPath, 'utf-8');
  return JSON.parse(moviesData);
};

// Save movies to JSON file
const saveMovies = (movies) => {
  const moviesPath = path.join(__dirname, 'movies.json');
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2));
};

// Get all movies
const getAllMovies = () => {
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
  // Convert language to string and uppercase to match our enum values
  const upperCaseLanguage = String(language).toUpperCase();
  const movies = loadMovies();
  // Always return an array, even if empty
  return movies.filter(movie => movie.language === upperCaseLanguage) || [];
};

// Add a new movie
const addMovie = (movie) => {
  const movies = loadMovies();
  const newMovie = {
    id: (movies.length + 1).toString(),
    ...movie,
    reviews: [],
    createdAt: movie.createdAt || new Date().toISOString(),
    updatedAt: movie.updatedAt || new Date().toISOString()
  };
  movies.push(newMovie);
  saveMovies(movies);
  return newMovie;
};

// Update a movie
const updateMovie = (id, updates) => {
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
  return movies[movieIndex];
};

// Delete a movie
const deleteMovie = (id) => {
  const movies = loadMovies();
  const movieIndex = movies.findIndex(m => m.id === id);
  if (movieIndex === -1) {
    throw new Error('Movie not found');
  }
  movies.splice(movieIndex, 1);
  saveMovies(movies);
  return true;
};

// Add a review to a movie
const addReview = (review) => {
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
  return newReview;
};

// Update a review
const updateReview = (id, updates) => {
  const movies = loadMovies();
  const movie = movies.find(m => 
    m.reviews.some(r => r.id === id)
  );
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
  return movie.reviews[reviewIndex];
};

// Delete a review
const deleteReview = (id) => {
  const movies = loadMovies();
  const movie = movies.find(m => 
    m.reviews.some(r => r.id === id)
  );
  if (!movie) {
    throw new Error('Movie not found');
  }
  const reviewIndex = movie.reviews.findIndex(r => r.id === id);
  if (reviewIndex === -1) {
    throw new Error('Review not found');
  }
  movie.reviews.splice(reviewIndex, 1);
  saveMovies(movies);
  return true;
};

// Filter movies by genre
const filterByGenre = (genre) => {
  const movies = loadMovies();
  return movies.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
};

// Filter movies by year
const filterByYear = (year) => {
  const movies = loadMovies();
  return movies.filter(movie => movie.releaseYear === year);
};

// Get top rated movies
const getTopRated = (limit = 10) => {
  const movies = loadMovies();
  return [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Get recent movies
const getRecent = (limit = 10) => {
  const movies = loadMovies();
  return [...movies]
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, limit);
};

// Search movies
const searchMovies = (query) => {
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
