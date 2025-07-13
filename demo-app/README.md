# GraphQL Movies Demo Application

This is a GraphQL demo application that showcases how to build a GraphQL API with Node.js and Apollo Server. The application provides a movies database with features like searching, filtering, and reviewing movies.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ashpak-shaikh/graphql-workshop.git
cd graphql-workshop/demo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start at http://localhost:4000

## Using Apollo Studio Explorer

Once the server is running, you can access the Apollo Studio Explorer at http://localhost:4000. This provides a powerful interface for exploring and testing the GraphQL API. The explorer is available at:

- **Local Explorer**: http://localhost:4000
- **Apollo Studio**: https://studio.apollographql.com/sandbox/explorer

This provides a powerful interface for:

1. **Querying Data**:
```graphql
{
  movies {
    id
    title
    director
    rating
    genre
    language
    createdAt
    updatedAt
  }
}
```

2. **Filtering Movies**:
```graphql
{
  moviesByLanguage(language: "HINDI") {
    title
    director
    genre
  }
}

{
  moviesByGenre(genre: "ACTION") {
    title
    rating
  }
}
```

3. **Adding a Movie**:
```graphql
mutation {
  addMovie(movie: {
    title: "The Matrix",
    director: "Lana Wachowski",
    releaseYear: 1999,
    genre: "ACTION",
    duration: 136,
    rating: 8.7,
    language: "ENGLISH"
  }) {
    id
    title
    createdAt
  }
}
```

4. **Updating a Movie**:
```graphql
mutation {
  updateMovie(id: "1", movie: {
    rating: 9.4
  }) {
    id
    title
    rating
  }
}
```

## Application Structure

```
demo-app/
├── data/                    # Data storage and service layer
│   ├── movies.json         # Movie data storage
│   └── movieService.js     # Movie business logic
├── schema.graphql          # GraphQL schema definitions
└── index.js                # Apollo Server configuration
```

## GraphQL Concepts

### 1. Schema
The schema defines the data types and operations available in your GraphQL API. It's defined in `schema.graphql` and includes:

- **Types**: Define the shape of your data
- **Queries**: Read operations
- **Mutations**: Write operations
- **Enums**: Fixed set of values
- **Scalars**: Basic data types
- **Input Types**: Used for mutations

### 2. Resolvers
Resolvers are functions that resolve data for each field in your schema. They're defined in `index.js` and handle:

- Fetching data from the data source
- Transforming data
- Error handling
- Business logic

Example resolver:
```javascript
const resolvers = {
  Query: {
    movies: () => getAllMovies(),
    movie: (_, { id }) => getMovieById(id)
  }
}
```

### 3. Scalars
Custom scalars extend GraphQL's built-in types. This application uses a custom `DateTime` scalar:

```javascript
const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  }
});
```

### 4. Enums
Enums define a fixed set of values. This application uses:

- `Language` enum: `ENGLISH`, `HINDI`, `OTHER`
- `Genre` enum: `ACTION`, `DRAMA`, `COMEDY`, etc.

Example usage:
```graphql
enum Language {
  ENGLISH
  HINDI
  OTHER
}
```

## Features

1. **Movie Management**:
   - Add new movies
   - Update existing movies
   - Delete movies
   - Search movies
   - Filter by language and genre

2. **Review System**:
   - Add reviews to movies
   - Update reviews
   - Delete reviews

3. **Data Types**:
   - Custom DateTime scalar
   - Language and Genre enums
   - Nested types (Movie -> Reviews)

## Error Handling

The application includes error handling for:
- Invalid input data
- Missing required fields
- Non-existent movie IDs
- Invalid enum values

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.
