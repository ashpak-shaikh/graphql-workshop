const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load users from JSON file
const loadUsers = () => {
  const usersPath = path.join(__dirname, 'users.json');
  const usersData = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(usersData);
};

// Save users to JSON file
const saveUsers = (users) => {
  const usersPath = path.join(__dirname, 'users.json');
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    'your-secret-key-here',
    { expiresIn: '1d' }
  );
};

// Authenticate user
const authenticateUser = async (email, password) => {
  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) return null;
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return null;
  
  return user;
};

// Register new user
const registerUser = async (email, password, name) => {
  const users = loadUsers();
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password: hashedPassword,
    name,
    role: 'USER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Load movies from JSON file
const loadMovies = () => {
  const moviesPath = path.join(__dirname, 'movies.json');
  const moviesData = fs.readFileSync(moviesPath, 'utf-8');
  return JSON.parse(moviesData);
};

// Helper function to find a review by ID
const findReviewById = (reviewId, movies) => {
  return movies.flatMap(movie => movie.reviews)
    .find(review => review.id === reviewId);
};

// Save movies to JSON file
const saveMovies = (movies) => {
  const moviesPath = path.join(__dirname, 'movies.json');
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2));
};

// Get all movies
const getAllMovies = () => {
  return loadMovies();
};

// Get a single movie by ID
const getMovieById = (id) => {
  const movies = loadMovies();
  return movies.find(movie => movie.id === id);
};

// Add a new movie
const addMovie = (movie, userId) => {
  const movies = loadMovies();
  const newMovie = {
    id: (movies.length + 1).toString(),
    ...movie,
    reviews: [],
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  movies.push(newMovie);
  saveMovies(movies);
  return newMovie;
};

// Update a movie
const updateMovie = (id, updates, userId) => {
  if (!userId) {
    throw new Error('Authentication required to update a movie');
  }
  const movies = loadMovies();
  const movieIndex = movies.findIndex(m => m.id === id);
  if (movieIndex === -1) {
    throw new Error('Movie not found');
  }

  // Only admin or the creator can update a movie
  if (movies[movieIndex].createdBy !== userId && !isAdmin(userId)) {
    throw new Error('Unauthorized');
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
const deleteMovie = (id, userId) => {
  if (!userId) {
    throw new Error('Authentication required to delete a movie');
  }
  const movies = loadMovies();
  const movieIndex = movies.findIndex(m => m.id === id);
  if (movieIndex === -1) {
    throw new Error('Movie not found');
  }

  // Only admin or the creator can delete a movie
  if (movies[movieIndex].createdBy !== userId && !isAdmin(userId)) {
    throw new Error('Unauthorized');
  }

  movies.splice(movieIndex, 1);
  saveMovies(movies);
  return true;
};

// Add a review to a movie
const addReview = (review, userId) => {
  if (!userId) {
    throw new Error('Authentication required to add a review');
  }

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
    reviewer: userId,
    createdAt: new Date().toISOString()
  };

  movie.reviews.push(newReview);
  saveMovies(movies);
  return newReview;
};

// Update a review
const updateReview = (id, updates, userId) => {
  if (!userId) {
    throw new Error('Authentication required to update a review');
  }

  const movies = loadMovies();
  const review = findReviewById(id, movies);
  if (!review) {
    throw new Error('Review not found');
  }

  // Only the reviewer can update their own review
  if (review.reviewer !== userId) {
    throw new Error('Unauthorized: Only the reviewer can update their review');
  }

  review.rating = updates.rating || review.rating;
  review.comment = updates.comment || review.comment;
  review.updatedAt = new Date().toISOString();
  saveMovies(movies);
  return review;
};

// Delete a review
const deleteReview = (id, userId) => {
  if (!userId) {
    throw new Error('Authentication required to delete a review');
  }

  const movies = loadMovies();
  const review = findReviewById(id, movies);
  if (!review) {
    throw new Error('Review not found');
  }

  // Only the reviewer can delete their own review
  if (review.reviewer !== userId) {
    throw new Error('Unauthorized: Only the reviewer can delete their review');
  }

  const movieIndex = movies.findIndex(m => m.reviews.some(r => r.id === id));
  if (movieIndex === -1) {
    throw new Error('Review not found');
  }

  movies[movieIndex].reviews = movies[movieIndex].reviews.filter(r => r.id !== id);
  saveMovies(movies);
  return true;
};

// Filter movies by genre
const filterByGenre = (genre, userId) => {
  if (!userId) {
    throw new Error('Authentication required to filter movies by genre');
  }
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

const isAdmin = (userId) => {
  const users = loadUsers();
  const user = users.find(u => u.id === userId);
  return user && user.role === 'ADMIN';
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
  authenticateUser,
  registerUser,
  generateToken
};
