# GraphQL vs REST Demo App

This demo application showcases the core concepts of GraphQL and demonstrates the differences between REST and GraphQL APIs.

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

## GraphQL vs REST Comparison

### REST Approach
To get book details in REST, you would need:
- One endpoint to get all books: `GET /books`
- Another endpoint to get a specific book: `GET /books/:id`
- Another endpoint to create a book: `POST /books`

### GraphQL Approach
With GraphQL, you have a single endpoint `/graphql` that can handle all these operations:

#### Query Examples

1. Get all books:
```graphql
query {
  books {
    id
    title
    author
    published
    genre
    pages
  }
}
```

2. Get a specific book:
```graphql
query {
  book(id: "1") {
    title
    author
    published
  }
}
```

3. Create a new book:
```graphql
mutation {
  addBook(
    title: "New Book"
    author: "Author Name"
    published: 2023
    genre: "Fiction"
    pages: 300
  ) {
    id
    title
    author
  }
}
```

## Key GraphQL Concepts Demonstrated

1. **Type System**: Defined schema with Book type
2. **Queries**: Fetching data with specific fields
3. **Mutations**: Creating new data
4. **Resolvers**: Business logic implementation
5. **Query Variables**: Using arguments for filtering
6. **Data Fetching**: Single endpoint for multiple operations

## Benefits Over REST

1. **Over-fetching Prevention**: Only request what you need
2. **Under-fetching Prevention**: Get all related data in one request
3. **Single Endpoint**: No need to maintain multiple endpoints
4. **Strong Typing**: Better type safety and IDE support
5. **Documentation**: Built-in schema documentation
6. **Versioning**: No need for versioning endpoints
