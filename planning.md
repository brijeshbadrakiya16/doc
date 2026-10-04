# Architectural Planning & System Design

## System Architecture

The Document Management System (DMS) follows a decoupled multi-service architecture:

```
[ Angular Frontend SPA ]  <--->  [ REST API / Node.js Express ]  <--->  [ MongoDB / GridFS ]
  (Port 4200)                      (Port 5000)                           (Collection + Bucket)
```

## Key Architectural Decisions

### 1. File Storage Mechanism (MongoDB GridFS)
- **Rationale**: GridFS breaks documents into standard 255 KB chunks (`fs.chunks`) and indexes metadata in `fs.files`.
- **Streaming Implementation**: File uploads use `busboy` to parse incoming multipart streams. Bytes are piped directly to `GridFSBucket.openUploadStreamWithId()` while simultaneously feeding a `crypto.createHash('sha256')` hash instance.
- **RAM Protection**: At no point is a full file loaded into an `in-memory` buffer (`Buffer.concat` or `memoryStorage`). Memory consumption remains constant regardless of file size.

### 2. Atomic User Storage Quota Enforcement
- **Quota Limit**: Maximum 20 active files per user.
- **Race-Condition Safety**: Simple `File.countDocuments()` followed by insert is subject to concurrent race conditions. We enforce atomicity by executing:
  ```javascript
  User.findOneAndUpdate(
    { _id: userId, activeFileCount: { $lt: 20 } },
    { $inc: { activeFileCount: 1 } },
    { new: true }
  );
  ```
  If modified count is 0, the upload stream is rejected before processing chunks. On failure or duplicate detection, an atomic decrement (`$inc: { activeFileCount: -1 }`) is executed during cleanup.

### 3. SHA-256 Duplicate File Detection
- **Fingerprinting**: SHA-256 hash calculated on the fly during streaming.
- **Database Schema Constraint**: `File` schema defines a compound unique index: `{ userId: 1, checksum: 1 }`.
- **Cleanup**: If a duplicate key error (`E11000`) is raised, GridFS chunks are unlinked immediately and the user active file counter is decremented back.

### 4. Authentication & Security Policy
- **Password Security**: Argon2id hashing via `argon2` npm package.
- **Token Handling**: Signed JWT stored in `HTTP-Only` cookies (`jwt`) with fallback support for `Authorization: Bearer <token>`.
- **Headers & CORS**: `helmet` headers applied globally. CORS restricted to `http://localhost:4200` with `credentials: true`.
- **Rate-Limiting**: Express rate limiters restrict auth endpoints to 20 requests per 15 minutes per IP.
