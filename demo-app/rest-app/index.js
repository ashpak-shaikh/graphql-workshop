const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
const movies = [
  {
    id: '1',
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    releaseYear: 1994,
    genre: 'Drama',
    duration: 142,
    rating: 9.3
  },
  {
    id: '2',
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    releaseYear: 1972,
    genre: 'Crime',
    duration: 175,
    rating: 9.2
  }
];

// REST API endpoints

// Get all books
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// Get a specific book
app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }
  res.json(movie);
});

// Create a new book
app.post('/api/movies', (req, res) => {
  const { title, director, releaseYear, genre, duration, rating } = req.body;
  
  if (!title || !author || !published || !genre || !pages) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  const newMovie = {
    id: (movies.length + 1).toString(),
    title,
    director,
    releaseYear,
    genre,
    duration,
    rating
  };

  movies.push(newMovie);
  res.status(201).json(newBook);
});

// Update a book
app.put('/api/movies/:id', (req, res) => {
  const { title, director, releaseYear, genre, duration, rating } = req.body;
  const movieIndex = movies.findIndex(m => m.id === req.params.id);

  if (bookIndex === -1) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  movies[movieIndex] = {
    ...movies[movieIndex],
    title,
    director,
    releaseYear,
    genre,
    duration,
    rating
  };

  res.json(books[bookIndex]);
});

// Delete a book
app.delete('/api/movies/:id', (req, res) => {
  const movieIndex = movies.findIndex(m => m.id === req.params.id);

  if (movieIndex === -1) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  movies.splice(movieIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`REST API server running on port ${PORT}`);
});
