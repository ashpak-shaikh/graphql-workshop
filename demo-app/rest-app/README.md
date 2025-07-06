# REST vs GraphQL Comparison

This repository contains two implementations of the same book management API:

1. `graphql-app/` - GraphQL implementation using Apollo Server
2. `rest-app/` - REST implementation using Express

## REST API Implementation

The REST API provides the following endpoints:

### GET /api/books
- Returns all books with all fields
- Always returns complete objects with all fields
- Example response:
```json
[
  {
    "id": "1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "published": 1925,
    "genre": "Novel",
    "pages": 218
  },
  // ... more books
]
```

### GET /api/books/:id
- Returns a single book
- Always returns complete object with all fields
- Example response:
```json
{
  "id": "1",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "published": 1925,
  "genre": "Novel",
  "pages": 218
}
```

### POST /api/books
- Creates a new book
- Requires all fields in the request body
- Example request:
```json
{
  "title": "New Book",
  "author": "Author Name",
  "published": 2023,
  "genre": "Fiction",
  "pages": 300
}
```

### PUT /api/books/:id
- Updates an existing book
- Requires all fields in the request body
- Example request:
```json
{
  "title": "Updated Book",
  "author": "Author Name",
  "published": 2023,
  "genre": "Fiction",
  "pages": 300
}
```

### DELETE /api/books/:id
- Deletes a book by ID
- Returns 204 No Content on success

## Key Differences from GraphQL Implementation

1. **Multiple Endpoints**
   - REST requires separate endpoints for different operations
   - GraphQL has a single endpoint for all operations

2. **Over-fetching/Under-fetching**
   - REST endpoints return complete objects with all fields
   - GraphQL allows requesting only needed fields

3. **Data Fetching**
   - REST requires multiple requests for related data
   - GraphQL can fetch related data in a single request

4. **Error Handling**
   - REST uses HTTP status codes
   - GraphQL provides detailed error messages in a standard format

5. **Documentation**
   - REST requires separate documentation
   - GraphQL provides built-in schema documentation

## Running the Applications

1. Install dependencies for both apps:
```bash
# For GraphQL app
cd ../graphql-app
npm install

# For REST app
cd ../rest-app
npm install
```

2. Start both servers:
```bash
# Start GraphQL server (port 4000)
cd ../graphql-app
npm start

# Start REST server (port 3000)
cd ../rest-app
npm start
```
