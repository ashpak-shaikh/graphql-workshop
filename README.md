# GraphQL Workshop

This repository contains a comprehensive GraphQL workshop with practical examples and exercises.

## Project Structure

- `demo-app/` - A complete GraphQL movies demo application with:
  - Apollo Server implementation
  - Custom scalars and enums
  - Query and mutation operations
  - Data modeling with nested types
  - Error handling and validation

For detailed setup instructions and usage examples, please refer to the [demo-app README](demo-app/README.md).

## Learning Objectives

This workshop covers:

1. **GraphQL Fundamentals**
   - Schema design
   - Type system
   - Resolvers
   - Queries and mutations

2. **Advanced Concepts**
   - Custom scalars
   - Enums
   - Input types
   - Data validation
   - Error handling

3. **Practical Implementation**
   - Apollo Server setup
   - Data modeling
   - API design patterns
   - Best practices

## Getting Started

To get started with the workshop:

1. Check out the [demo-app README](demo-app/README.md) for detailed setup instructions
2. Explore the [demo-app/schema.graphql](demo-app/schema.graphql) to see the GraphQL schema
3. Run queries in Apollo Studio Explorer using the instructions in the demo-app README

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.    genre
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


