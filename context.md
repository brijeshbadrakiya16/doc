# Project Context & AI Pre-Submission Guide

> **Important**: This document details the exact, final submission-ready state of the project so that any AI assistant or engineer can inspect, run, or extend the project without lost context.

---

## 1. Project Purpose & Scope
DocVault Enterprise is a production-ready Document Management System (DMS) featuring:
- **GridFS Binary Streaming**: Non-buffering streaming uploads and downloads via MongoDB GridFS and `busboy`.
- **SHA-256 Fingerprint Integrity**: Cryptographic content hashing (`userId + checksum` compound unique index) for instant duplicate detection.
- **Atomic Storage Quota Control**: Strict 20 active file limit per user account enforced via atomic Mongoose counter updates (`{ activeFileCount: { $lt: 20 } }`).
- **Security & Authorization**: Argon2id password hashing, HTTP-Only cookie JWT auth, Helmet headers, CORS restrictions, rate limiters, filename path traversal stripping, and category ownership isolation.
- **Frontend SPA**: Executive 4-color palette system (Slate 900, Royal Blue, Warm Orange, Slate 50 Off-White background), responsive landing page, login/signup, dashboard metrics, document repository manager, metadata viewer, and category manager.

---

## 2. Technology Choices & Version Matrix
- **Node.js**: v22.13.0
- **npm**: 11.12.1
- **Angular CLI**: v21.2.24
- **Backend Packages**: `express` (v4.21), `mongoose` (v8.9), `argon2` (v0.40), `jsonwebtoken` (v9.0), `busboy` (v1.6), `zod` (v3.24), `helmet` (v8.0), `cors` (v2.8), `express-rate-limit` (v7.5).
- **Frontend Framework**: Angular v21 with Standalone Components, Signal-based State, and RxJS.

---

## 3. Database Schema Design (Mongoose)

### `User` Collection (`users`)
- `_id`: ObjectId
- `email`: String (unique, lowercase, trim)
- `passwordHash`: String (Argon2id)
- `name`: String
- `activeFileCount`: Number (default 0, min 0, max 20)
- `createdAt`, `updatedAt`: Timestamps

### `Category` Collection (`categories`)
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User')
- `name`: String (trim, max 50)
- `description`: String (max 200)
- `createdAt`, `updatedAt`: Timestamps
- *Index*: Compound unique `{ userId: 1, name: 1 }`

### `File` Collection (`files`)
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User')
- `originalName`: String (sanitized using `path.basename`)
- `storedFileId`: ObjectId (GridFS `fs.files` reference)
- `size`: Number (max 1048576)
- `mimeType`: String
- `extension`: String
- `checksum`: String (SHA-256 hex)
- `categoryId`: ObjectId (ref: 'Category', default null)
- `description`: String (max 500)
- `uploadDate`: Date (default Date.now)
- `createdAt`, `updatedAt`: Timestamps
- *Indexes*:
  - Compound unique `{ userId: 1, checksum: 1 }` (Duplicate prevention)
  - Query index `{ userId: 1, uploadDate: -1 }`
  - Query index `{ userId: 1, categoryId: 1 }`
  - Query index `{ userId: 1, originalName: 1 }`

---

## 4. Implemented REST API Routes

### Auth (`/api/auth`)
- `POST /signup`: User registration, confirmPassword validation, default categories workspace seeding (`Contracts`, `Invoices`, `Reports`, `HR`, `Other`), sets HTTP-Only `jwt` cookie.
- `POST /login`: Credential verification via Argon2id, sets HTTP-Only `jwt` cookie.
- `GET /me`: Returns current user session profile.
- `POST /logout`: Clears authentication cookie.

### Categories (`/api/categories`)
- `POST /`: Create category for authenticated user.
- `GET /`: List categories for user with active file counts per category.
- `GET /:id`: Get single category by ID with ownership check.
- `PUT /:id` & `PATCH /:id`: Update category name/description.
- `DELETE /:id`: Delete category and set `categoryId: null` on associated files.

### Documents (`/api/documents`)
- `POST /`: Multipart streaming upload to GridFS via busboy, SHA-256 fingerprinting, 1MB limit, 20-file atomic quota enforcement, category ownership check.
- `GET /`: Paginated list of documents (`page`, `limit`, `search`, `categoryId`, `sortOrder`).
- `GET /stats`: Dashboard stats (`activeFilesCount`, `totalDocuments`, `documentsThisMonth`, `categoryCount`, `totalSizeMB`, `categoryBreakdown`, `recentUploads`).
- `GET /:id`: Get document metadata by ID.
- `GET /:id/download`: Download stream directly from GridFS.
- `DELETE /:id`: Remove document metadata, unlink GridFS chunks, atomically decrement user `activeFileCount`.

---

## 5. Completed Work & File Directory

### Root Documentation:
- [README.md](file:///c:/Users/brijesh/Desktop/doc/README.md)
- [planning.md](file:///c:/Users/brijesh/Desktop/doc/planning.md)
- [tasks.md](file:///c:/Users/brijesh/Desktop/doc/tasks.md)
- [API.md](file:///c:/Users/brijesh/Desktop/doc/API.md)
- [AI_USAGE.md](file:///c:/Users/brijesh/Desktop/doc/AI_USAGE.md)
- [context.md](file:///c:/Users/brijesh/Desktop/doc/context.md)
- `.gitignore`

### Backend (`/backend`):
- `package.json`
- `.gitignore`
- `.env.example`
- `.env`
- `src/config/env.js`
- `src/config/db.js`
- `src/constants/fileConstants.js`
- `src/errors/AppError.js`
- `src/errors/errorHandler.js`
- `src/models/User.js`
- `src/models/Category.js`
- `src/models/File.js`
- `src/utils/hash.js`
- `src/utils/jwt.js`
- `src/utils/objectId.js`
- `src/utils/magicBytes.js`
- `src/utils/validators.js`
- `src/middleware/authMiddleware.js`
- `src/middleware/requestLogger.js` (Non-blocking request completion logging with unique `req_xxxx` IDs, user context, status, duration, and contextual messages)
- `src/middleware/validateRequest.js`
- `src/middleware/validateObjectId.js`
- `src/middleware/rateLimiter.js`
- `src/middleware/security.js`
- `src/services/authService.js`
- `src/services/categoryService.js`
- `src/services/documentService.js`
- `src/controllers/authController.js`
- `src/controllers/categoryController.js`
- `src/controllers/documentController.js`
- `src/routes/authRoutes.js`
- `src/routes/categoryRoutes.js`
- `src/routes/documentRoutes.js`
- `src/routes/index.js`
- `src/app.js`
- `src/server.js`
- `tests/app.test.js`
- `tests/unit.test.js`

### Frontend (`/frontend`):
- `angular.json` (configured with `proxy.conf.json` and adjusted component style budgets)
- `proxy.conf.json`
- `src/main.ts`
- `src/styles.css` (Enterprise design tokens, responsive utilities, shimmer skeleton loader, alert & button systems)
- `src/app/core/models/user.model.ts`
- `src/app/core/models/category.model.ts`
- `src/app/core/models/document.model.ts`
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/auth.service.spec.ts` (Unit test suite with HttpTestingController)
- `src/app/core/services/category.service.ts`
- `src/app/core/services/category.service.spec.ts` (Unit test suite with HttpTestingController)
- `src/app/core/services/document.service.ts`
- `src/app/core/guards/auth.guard.ts`
- `src/app/core/interceptors/auth.interceptor.ts`
- `src/app/features/home/home.component.ts` (Marketing landing page with mobile drawer & crisp SVGs)
- `src/app/features/auth/login.component.ts` (Password visibility toggle, spinner, responsive cards)
- `src/app/features/auth/signup.component.ts` (Password toggles, non-collapsing full-width button, validation feedback)
- `src/app/features/dashboard/dashboard.component.ts` (Skeleton shimmer, metrics SVGs, category breakdown)
- `src/app/features/documents/documents.component.ts` (Drag-and-drop file upload zone, custom delete confirmation modal, skeleton rows, format badges)
- `src/app/features/documents/document-detail.component.ts` (Technical metadata, SHA-256 copy feedback, custom delete modal)
- `src/app/features/categories/categories.component.ts` (Category CRUD modal with validation, custom delete confirmation modal)
- `src/app/shared/components/private-layout.component.ts` (Responsive mobile topbar, drawer sidebar with backdrop, quota widget)
- `src/app/app.routes.ts`
- `src/app/app.config.ts`
- `src/app/app.component.ts`
- `src/app/app.component.spec.ts` (AppComponent creation test suite)

---

## 6. Verification & Final Test Outcomes

1. **Backend Automated Tests**:
   - Command: `cd backend && npm test`
   - Outcome: **PASS** (`tests/unit.test.js`, `tests/app.test.js` - 16 passed, 16 total, 0 errors, live `req_xxxx` logging verified).

2. **Frontend Unit Tests**:
   - Command: `cd frontend && npx ng test --watch=false`
   - Outcome: **PASS** (3 test suites: `app.component.spec.ts`, `auth.service.spec.ts`, `category.service.spec.ts` - 7 passed, 7 total).

3. **Frontend Production Build**:
   - Command: `cd frontend && npm run build`
   - Outcome: **Application bundle generation complete** (0 errors, 0 warnings).

4. **Pre-Submission Checklist Verification**:
   - All 32 checklist requirements verified 100% passing.

---

## 7. Known Issues Resolved & Engineering Decisions

### 1. Signup Button Squeezing Bug Resolution:
- **Root Cause**: In flexbox layouts, items default to `flex-shrink: 1`. Without `white-space: nowrap` and an explicit `min-height`, button text wrapped into zero-width spaces when sibling brand headers took priority, collapsing buttons into a ~30x30px square on narrow viewports.
- **Fix**: Added `white-space: nowrap; min-height: 2.75rem; line-height: 1.25;` to `.btn`, made `.w-full` apply `width: 100% !important; display: flex !important;`, and added mobile navigation drawer toggles for screens `< 768px`.

### 2. Browser `confirm()` Replacement:
- Replaced all raw browser `confirm()` popups across Documents, Document Details, and Categories with custom accessible modal dialogs that display filename/category details, action consequences, and non-blocking cancel/confirm buttons.

### 3. Drag-and-Drop File Upload:
- Implemented HTML5 drag-and-drop zone handling `dragover`, `dragleave`, and `drop` events with visual drop-target state, click-to-browse fallback, and instantaneous pre-upload validation for the 1 MB file size boundary.

### 4. Backend Non-Blocking Request Logging:
- Integrated `requestLogger.js` running on the `finish` event of `res`. Generates unique `req_xxxx` identifiers, captures high-precision duration (`Date.now() - startTime`), identifies authenticated user or Guest, colorizes status codes, and outputs single-line concise log messages with professional, light humor. Exposes `requestId` in error responses.
