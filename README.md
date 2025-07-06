# GraphQL Demo App

This demo application showcases the core concepts of GraphQL using a movies database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will start on `http://localhost:4000` with GraphiQL interface available at the same URL.

## Features Demonstrated

1. **Data Fetching**
   - Query movies with nested relationships (reviews)
   - Filter movies by genre, year, rating
   - Search movies by title, director, or genre
   - Paginate results
   - Sort movies by rating or release year

2. **Mutations**
   - Add new movies
   - Update existing movies
   - Delete movies
   - Add reviews to movies
   - Update reviews
   - Delete reviews

3. **Schema Features**
   - Input types for mutations
   - Type validation
   - Custom scalars
   - Aliases and fragments
   - Error handling

## Query Examples

1. Get all movies with reviews:
```graphql
query {
  movies {
    id
    title
    director
    releaseYear
    genre
    duration
    rating
    reviews {
      id
      reviewer
      rating
      comment
      createdAt
    }
  }
}
```

2. Get top rated movies:
```graphql
query {
  topRatedMovies(limit: 5) {
    title
    director
    rating
    reviews {
      reviewer
      rating
    }
  }
}

3. Search movies:
```graphql
query {
  searchMovies(query: "shaw") {
    title
    director
    genre
    rating
  }
}

4. Add a movie:
```graphql
mutation {
  addMovie(
    movie: {
      title: "New Movie"
      director: "Director Name"
      releaseYear: 2023
      genre: "Action"
      duration: 120
      rating: 8.5
    }
  ) {
    id
    title
    director
  }
}

5. Add a review:
```graphql
mutation {
  addReview(
    review: {
      movieId: "1"
      rating: 5
      comment: "Great movie!"
      reviewer: "John Doe"
    }
  ) {
    id
    reviewer
    rating
    comment
  }
}
```

## Key GraphQL Concepts Demonstrated

1. **Type System**: Defined schema with Movie type
2. **Queries**: Fetching data with specific fields
3. **Mutations**: Creating new data
4. **Resolvers**: Business logic implementation
5. **Query Variables**: Using arguments for filtering
6. **Data Fetching**: Single endpoint for multiple operations


