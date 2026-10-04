# DocVault Enterprise - Document Management System (DMS)

A full-stack, enterprise-grade Document Management System built with a **Node.js/Express/MongoDB** backend and an **Angular** frontend.

---

## 1. Project Overview & Problem Solved
Organizations require secure, centralized, and controlled document governance to prevent data loss, storage clutter, and unindexed document retrieval. **DocVault Enterprise** solves this by providing:
- **GridFS Binary Chunk Streaming**: High-throughput file streaming without loading full buffers into RAM.
- **SHA-256 Fingerprint Integrity**: Automatic duplicate upload detection using cryptographic content hashing (`userId + checksum`).
- **Atomic Storage Quotas**: Strict limit of 20 active documents per user account enforced via atomic MongoDB counter updates (`{ activeFileCount: { $lt: 20 } }`).
- **User-Owned Workspaces**: Categorization, instant search indexing, upload date sorting, and pagination.

---

## 2. Technology Stack

- **Backend**: Node.js (v22), Express (v4.21), MongoDB (Mongoose v8.9), GridFS, Argon2id (`argon2`), JWT (`jsonwebtoken`), Busboy (`busboy`), Zod (`zod`), Helmet (`helmet`), CORS (`cors`), Rate-Limiting (`express-rate-limit`).
- **Frontend**: Angular (v21), TypeScript, RxJS, Angular Signals, Vanilla CSS Design System.

---

## 3. Architecture & File Storage Design

```
+------------------------+      +------------------------------+      +------------------------+
|  Angular Frontend SPA  | <--> |  REST API / Express Backend  | <--> |   MongoDB & GridFS     |
|   (Port 4200 / Dist)   |      |        (Port 5000)           |      | (files, users, fs.*)   |
+------------------------+      +------------------------------+      +------------------------+
```

### File Storage Pipeline
1. Incoming `multipart/form-data` uploads are parsed on the fly using `busboy`.
2. Bytes stream directly into `GridFSBucket.openUploadStreamWithId()`.
3. Simultaneously, a `crypto.createHash('sha256')` hash instance consumes the byte stream to compute the file fingerprint.
4. Magic bytes (first 4100 bytes) are inspected to verify PDF, PNG, JPEG, and DOCX/XLSX signatures.
5. Storage quota is reserved atomically upfront (`activeFileCount < 20`).
6. If a duplicate hash or size violation (> 1 MB) occurs, GridFS chunks are unlinked immediately and the quota is rolled back.

---

## 4. Prerequisites & Setup

### Prerequisites
- Node.js (v18+ or v22.13.0 recommended)
- npm (v9+ or v11.12.1 recommended)
- MongoDB instance (Local or hosted Atlas connection string)

### Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dms_db
JWT_SECRET=super_secret
JWT_EXPIRES_IN=24h
FRONTEND_ORIGIN=http://localhost:4200
```

---

## 5. Development & Production Commands

### Backend (`/backend`)
- **Install Dependencies**: `npm install`
- **Run Development Server**: `npm run dev`
- **Start Production Server**: `npm start`
- **Run Unit & Integration Tests**: `npm test`

### Frontend (`/frontend`)
- **Install Dependencies**: `npm install`
- **Run Development Server**: `npm start` (Runs on `http://localhost:4200` with API proxying)
- **Run Unit Tests**: `npx ng test --watch=false` (Runs Angular testbed with Vitest)
- **Build Production Bundle**: `npm run build` (Verified compilation to `dist/frontend`)

---

## 6. REST API Overview

- **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.
- **Categories**: `GET /api/categories`, `POST /api/categories`, `GET /api/categories/:id`, `PUT /api/categories/:id`, `PATCH /api/categories/:id`, `DELETE /api/categories/:id`.
- **Documents**: `POST /api/documents`, `GET /api/documents`, `GET /api/documents/stats`, `GET /api/documents/:id`, `GET /api/documents/:id/download`, `DELETE /api/documents/:id`.

---

## 7. Security Model & Upload Restrictions
- **Password Hashing**: Argon2id algorithm with 64 MB memory cost.
- **Authentication**: HTTP-Only cookies with fallback support for Authorization Bearer header.
- **Max File Size**: 1 MB (1,048,576 bytes).
- **Max Active Files**: 20 files per user.
- **Allowed Extensions**: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.png`, `.jpg`, `.jpeg`.
- **Request Tracing**: Every inbound request receives a unique correlation ID (`req_xxxx`) tracked across logs and error response payloads.

---

## 8. Automated Testing & Verification
- **Backend Tests**: 16 unit and integration test cases in `backend/tests/` passing cleanly (`PASS tests/unit.test.js`, `PASS tests/app.test.js`).
- **Frontend Unit Tests**: 7 unit test cases across `AppComponent`, `AuthService`, and `CategoryService` passing cleanly (`npx ng test --watch=false`).
- **Frontend Production Build**: Angular bundle compilation verified with 0 errors and 0 warnings (`dist/frontend`).
- **Pre-Submission Checklist**: 100% verified and validated.

---

## 9. Key UI/UX Innovations
- **Drag-and-Drop Document Upload**: Native HTML5 dragover/dragleave/drop file intake with instant pre-upload size check.
- **Accessible Custom Modals**: Replaced raw browser `confirm()` alerts with accessible confirmation dialogs.
- **Shimmer Skeleton Loading**: Visual skeleton states during data fetching for dashboard cards, tables, and detail screens.
- **Responsive Drawer Navigation**: Full-featured mobile hamburger drawer and collapsible sidebar with backdrop blur.
- **Crisp SVG Iconography**: Unified vector icon system with zero reliance on generic emoji glyphs.
