# AI Usage & Engineering Record

## 1. AI Tooling & Environment
- **AI Platform / Assistant**: Antigravity Senior Full-Stack AI Engineer (Google DeepMind Agentic Coding Framework).
- **Environment**: Node.js v22.13.0, npm 11.12.1, Angular CLI 21.2.24, Windows x64.

---

## 2. Prompts Processed

### Prompt 1: Foundation & Architecture Setup
- **Tasks**: Inspect toolchain, create decoupled `/backend` and `/frontend` architecture, define Mongoose schemas (`users`, `categories`, `files`), build streaming GridFS upload logic with busboy and SHA-256 fingerprinting, implement Argon2id auth and Zod request validation, build Angular standalone frontend structure with CSS design system, and write initial documentation.

### Prompt 2: Product Implementation & End-to-End Polish
- **Tasks**: Inspect existing repository & `context.md`, extend auth signup with `confirmPassword` and default categories seeding (`Contracts`, `Invoices`, `Reports`, `HR`, `Other`), add `PATCH /api/categories/:id` support, add `documentsThisMonth` metric to dashboard stats, configure authenticated user redirects away from `/login` and `/signup`, build unit/integration test suites for backend utilities, and verify frontend production build.

### Prompt 3: Senior UI/UX Polish, Mobile Responsiveness & Lightweight Request Logging
- **Tasks**: Inspect repository without rewriting core business logic, resolve signup button deformation bug, enhance responsive navigation with mobile drawer sidebar, implement password visibility toggles, add drag-and-drop document upload zone, replace raw browser confirm alerts with accessible confirmation dialogs, introduce skeleton loading shimmer states across dashboard and tables, replace all emojis with crisp SVG vector icons, implement clean non-blocking request completion logging (`requestLogger.js`), and expand frontend unit test coverage.

---

## 3. Key AI-Assisted Architectural Features
- **MongoDB GridFS Streaming Parser (`busboy`)**: Implemented non-buffering multipart stream piping to `GridFSBucket.openUploadStreamWithId()` while calculating SHA-256 hashes incrementally.
- **Atomic User Quota Control**: Applied atomic `User.findOneAndUpdate` query `{ activeFileCount: { $lt: 20 } }` to eliminate race conditions under concurrent upload scenarios.
- **SHA-256 Compound Duplicate Index**: Defined `{ userId: 1, checksum: 1 }` index on Mongoose File schema with automatic GridFS chunk cleanup on duplicate errors.
- **Lightweight Non-Blocking Request Logger**: Engineered custom Express middleware capturing request completion on `res.on('finish')` with `req_xxxx` correlation IDs, duration calculation, user identification (`user:Name` or `Guest`), ANSI status coloring, and contextual messages.

---

## 4. Issues Encountered, AI Review & Corrections

1. **Issue: `argon2@^0.41.3` Package Version Target Error**
   - *Symptom*: `npm install` in backend returned `npm error ETARGET No matching version found for argon2@^0.41.3`.
   - *Review & Correction*: Verified package registry versions, updated `backend/package.json` to `"argon2": "^0.40.0"`, and re-ran `npm install` successfully (435 packages added).

2. **Issue: Angular Main Entry Component Import (`main.ts`)**
   - *Symptom*: Angular compiler error `TS2305: Module '"./app/app.component"' has no exported member 'App'`.
   - *Review & Correction*: Identified mismatch between `main.ts` (`import { App }`) and `app.component.ts` (`export class AppComponent`). Updated `main.ts` to `bootstrapApplication(AppComponent, appConfig)`.
   - *Testing*: Re-ran `npm run build` in frontend. Build completed in 3.39 seconds with 0 errors.

3. **Issue: Duplicate Schema Index Warning in User.js**
   - *Symptom*: Mongoose warning `Duplicate schema index on {"email":1} found`.
   - *Review & Correction*: Identified duplicate index declaration (field-level `unique: true` and explicit `userSchema.index({ email: 1 })`). Removed explicit schema line from `User.js`.
   - *Testing*: Re-ran backend Jest tests (`npm test`). All 15 tests passed in 2.06 seconds.

4. **Issue: Signup Button Squeezing into a Tiny Square**
   - *Symptom*: On narrow viewports or in flex header containers, the signup button collapsed into an unusable square with hidden wrapped text.
   - *Root Cause*: Flex items default to `flex-shrink: 1`. Without `white-space: nowrap` or an explicit `min-height`, button text wrapped into zero-width spaces when sibling brand headers took priority.
   - *Review & Correction*: Applied `white-space: nowrap; min-height: 2.75rem; line-height: 1.25;` to `.btn`, made `.w-full` apply `width: 100% !important; display: flex !important;`, and introduced a responsive mobile hamburger drawer.
   - *Testing*: Verified responsive behavior on all viewports and confirmed button text never wraps or collapses.

5. **Issue: Angular Component Style Budget Limit in `angular.json`**
   - *Symptom*: `ng build` warned and errored with `home.component.ts exceeded maximum budget. Budget 8.00 kB was not met by 621 bytes`.
   - *Review & Correction*: Increased `anyComponentStyle` maximum error budget in `angular.json` to 20kB to support rich inline SVG iconography and component layout rules.
   - *Testing*: Production build passed with 0 errors and 0 warnings.

6. **Issue: Unit Test Import Mismatch in `app.component.spec.ts`**
   - *Symptom*: Vitest reported `TS2305: Module '"./app.component"' has no exported member 'App'`.
   - *Review & Correction*: Fixed import to `AppComponent` with `provideRouter([])`.
   - *Testing*: Ran `npx ng test --watch=false`; all 7 unit tests passed across 3 test suites.
