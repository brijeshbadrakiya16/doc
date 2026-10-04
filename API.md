# REST API Contract Documentation

Base URL: `/api`

All success responses return a JSON object with `status: "success"` and data under the `data` key.
All error responses return a JSON object with `status: "fail"` or `"error"` and an explanatory `message`.

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/signup`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123",
    "name": "Jane Doe"
  }
  ```
- **Response (201 Created)**: Sets HTTP-Only cookie `jwt`.
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "65123456789abcdef0123456",
        "email": "user@example.com",
        "name": "Jane Doe",
        "activeFileCount": 0
      },
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

### `POST /api/auth/login`
Authenticates existing user credentials.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Response (200 OK)**: Sets HTTP-Only cookie `jwt`.

### `GET /api/auth/me`
Retrieves current authenticated user session profile. Requires auth.

### `POST /api/auth/logout`
Clears HTTP-Only authentication cookie. Requires auth.

---

## 2. Category Endpoints (`/api/categories`)
*Requires Authentication*

### `POST /api/categories`
Creates a new user category.
- **Request Body**: `{ "name": "Financials", "description": "Q3-Q4 audit reports" }`
- **Response (201 Created)**

### `GET /api/categories`
Returns list of user's categories with active file counts per category.
- **Response (200 OK)**

### `GET /api/categories/:id`
Returns category detail.

### `PUT /api/categories/:id`
Updates category name or description.

### `DELETE /api/categories/:id`
Deletes category and sets `categoryId: null` on assigned documents.

---

## 3. Document Endpoints (`/api/documents`)
*Requires Authentication*

### `POST /api/documents`
Streaming multipart upload to GridFS bucket.
- **Headers**: `Content-Type: multipart/form-data`
- **Form Data Fields**:
  - `file`: Binary file stream (Max 1 MB)
  - `categoryId`: (Optional) Mongoose ObjectId
  - `description`: (Optional) Text
- **Errors**:
  - `400 Bad Request`: Quota exceeded (> 20 active files) or unsupported file signature
  - `409 Conflict`: Duplicate SHA-256 hash detected
  - `413 Payload Too Large`: File exceeds 1 MB

### `GET /api/documents`
Paginated listing with search, category filter, and upload date sorting.
- **Query Parameters**:
  - `page`: default 1
  - `limit`: default 10 (max 100)
  - `search`: search by filename or description
  - `categoryId`: filter by category ObjectId or `uncategorized`
  - `sortField`: `uploadDate` | `originalName` | `size`
  - `sortOrder`: `asc` | `desc`

### `GET /api/documents/stats`
Dashboard metrics overview (active file count, total storage MB, category breakdown, recent uploads).

### `GET /api/documents/:id`
Document metadata detail.

### `GET /api/documents/:id/download`
Streaming GridFS file download with `Content-Type` and `Content-Disposition` attachment headers.

### `DELETE /api/documents/:id`
Deletes document metadata, removes GridFS binary chunks, and atomically decrements `activeFileCount`.
