
# Library Books REST API Design

## Overview

This API manages books in a library. It supports listing books, retrieving a single book, creating books, updating books, deleting books, and searching for books by author.
Base URL: `/api/books`

### 1. List All Books

- Method: GET
- Path: `/api/books`
- Description: Retrieves a list of all books in the library.
- Success status code: `200 OK`
- Example request body: None required.

### 2. Get a Single Book

- Method: GET
- Path: `/api/books/:id`
- Description: Retrieves the details of a book using its unique ID.
- Success status code: `200 OK`
- Example request body: None required.

Example path: `/api/books/1`

### 3. Create a Book

- Method: POST
- Path: `/api/books`
- Description: Adds a new book to the library.
- Success status code: `201 Created`
- Example request body:

json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "isbn": "9780385474542",
  "publishedYear": 1958
}
```

### 4. Update a Book

- Method: PUT
- Path: `/api/books/:id`
- Description: Replaces the details of an existing book.
- Success status code: `200 OK`
- Example request body:

json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "isbn": "9780385474542",
  "publishedYear": 1958
}


### 5. Delete a Book

- Method: DELETE
- Path: `/api/books/:id`
- Description: Deletes a book using its unique ID.
- Success status code: `204 No Content`
- Example request body: None required.

### 6. List Books by Author

- Method: GET
- Path: `/api/books?author=Chinua%20Achebe`
- Description: Retrieves books written by the specified author.
- Success status code: `200 OK`
- Example request body:* None required.

## Error Responses

### 400 Bad Request

Description: The request contains invalid data or fails validation.
Example: Creating a book without a required title or with an invalid published year.

### 404 Not Found

- Description: The requested resource does not exist.
- Example: Requesting `/api/books/9999` when no book has that ID.