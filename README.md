# ngl

Anonymous messaging API. A user can send messages (optionally with media attachments) to another user, with support for anonymous messages, OTP verification, Google OAuth, and JWT access/refresh sessions.

The HTTP root (`GET /`) answers `"welcome to LMK api"`. The app is deployed on Vercel and the frontend lives at `let-me-know-flax.vercel.app`.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Web framework | Express 5 |
| Language | JavaScript (`@types/express` for IDE type hints) |
| Database | MongoDB + Mongoose 9 |
| Cache / sessions | Redis (ioredis + @upstash/redis; Upstash in production) |
| File uploads | multer (disk storage) + file-type validation |
| File storage | Cloudinary (`secure_url` stored on the message) |
| Authentication | bcrypt + jsonwebtoken (access + refresh tokens, httpOnly cookies) |
| Social login | Google OAuth (google-auth-library) |
| Email | nodemailer (SMTP) + node-mailjet (Mailjet) + OTP emails |
| Request validation | zod 4 |
| Rate limiting | express-rate-limit |
| CORS / cookies | cors + cookie-parser |
| Deployment | Vercel (`@vercel/node`, `vercel.json` routes to `src/server.js`) |
| Port | `5000` |

---

## Folder structure

```
ngl/
├── .env                  # local secrets (gitignored — never commit)
├── .gitignore
├── package.json
├── package-lock.json
├── vercel.json           # Vercel deployment config
├── README.md
└── src/
    ├── app.js            # createApp() factory: middleware, root route, /api/v1 router, 404, global error handler
    ├── route.js          # mounts /auth, /message, /user, /request under /api/v1
    ├── server.js         # http server, mongoose connect, graceful shutdown (SIGINT/SIGTERM), listens on 5000
    ├── lib/              # cross-cutting infrastructure
    │   ├── auth/guard.js
    │   ├── cache/{init,withCache}.js
    │   ├── config/env.js        # zod-validated environment variables
    │   ├── correlation/correlationId.js
    │   ├── db/mongoose.js
    │   ├── email/{init,nodemailer,emailTemplates}.js
    │   ├── error/error.handler.js
    │   ├── idempotency/idempotency.js
    │   ├── limiter/loginFailLimiter.js
    │   ├── media/{file.validation,multer}.js
    │   ├── utils/{generateOtp,google-auth}.js
    │   └── validation/validation.js
    ├── pkg/              # low-level providers
    │   ├── cache/redis.js
    │   ├── cloud/cloudinary.js      # CloudinaryProvider (uploadFile, deleteFile)
    │   ├── error/error.js           # AppError
    │   ├── logger/logger.js         # singleton JSON logger
    │   └── utils/time.js
    └── app/              # feature modules (each: controller, dto, errors, model, repository, service, route)
        ├── auth/         # register/login, OTP, Google OAuth, tokens (access/refresh), hash
        ├── message/      # create/get/update/list messages, anonymous mode, media attachments, reveal request
        ├── request/      # request/reveal flow
        └── user/         # user CRUD and profile
```

### Convention used in `src/app/*`
Every feature module follows the same split:
- `route.js` — Express routes
- `controller.js` — request/response handling
- `service.js` — business logic
- `repository.js` — direct database/model access
- `model.js` — Mongoose schema/model
- `dto/*.js` — zod request validation schemas
- `errors.js` — `AppError` instances for that module

---

## Features

- **Anonymous messaging** — send a message to a user; optionally hide the sender (`isAnonymous`)
- **Media attachments** — upload images/PDFs/Word docs/MP4/MP3 with multer, validated by mime type, stored on Cloudinary (`message.media: [String]`)
- **Authentication** — JWT access + refresh tokens in httpOnly cookies; password hashing with bcrypt
- **Google OAuth** — sign in / sign up with Google
- **OTP** — email-based one-time passwords (nodemailer SMTP / Mailjet)
- **Rate limiting** — login-failure limiter to slow brute-force attempts
- **Observability** — correlation ID middleware, structured JSON logger, global `AppError` handler
- **Graceful shutdown** — closes the HTTP server and disconnects Mongoose on `SIGINT`/`SIGTERM`

---

## API overview

All routes are mounted under `/api/v1/`.

| Route | Description |
|-------|-------------|
| `GET /` | Welcome message (`"welcome to LMK api"`) |
| `POST /api/v1/auth` | auth routes (register, login, OTP, Google, refresh, …) |
| `POST /api/v1/message` | create a message (authenticated; accepts `media` files) |
| `GET /api/v1/message` | list messages for the current user |
| `POST /api/v1/message/anonymous` | create an anonymous message (no auth) |
| `GET/PUT /api/v1/message/:msgId` | get or update a specific message (owner only) |
| `POST /api/v1/user` | user routes |
| `POST /api/v1/request` | request/reveal routes |

See `src/route.js` and each `src/app/*/*.route.js` for the exact paths and controllers.

---

## Environment variables

Copy `.env.example` (if present) or create a local `.env`. **`.env` is gitignored** — never commit real credentials.

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | server port | `5000` |
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://...` |
| `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` | SMTP (nodemailer) credentials | `smtp.gmail.com` |
| `JWT_Access_SECRET` | access token signing secret | `<random>` |
| `JWT_Refresh_SECRET` | refresh token signing secret | `<random>` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `<...>.apps.googleusercontent.com` |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` / `REDIS_URL` | Redis connection | `localhost` / `6379` / … |
| `MAILJET_API_KEY` / `MAILJET_SECRET_KEY` | Mailjet credentials | `…` |
| `MAILJET_FROM_EMAIL` / `MAILJET_FROM_NAME` | default sender | `…` |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` / `CLOUDINARY_CLOUD_NAME` | Cloudinary credentials | `…` |
| `FRONTEND_URL` | allowed CORS origin | `https://let-me-know-flax.vercel.app` |
| `NODE_ENV` | `development` | `production` |

Generate strong random secrets for `JWT_Access_SECRET` and `JWT_Refresh_SECRET` (e.g. `openssl rand -base64 32`).

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create a local .env (copy from .env.example if available)
#    Fill in your own values — never commit real secrets.
cp .env.example .env   # optional, if .env.example exists

# 3. Run in development (watch mode)
npm run dev

# 4. The API is available at http://localhost:5000
```

### Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start with `node --watch .` (auto-restart on file changes) |
| `npm test` | Stub — no test runner is configured yet |

---

## Notes

- The app uses ESM (`"type": "module"` in `package.json`). Import/export syntax is used throughout.
- `src/server.js` exports the Express `app` (default export) so it can be imported by Vercel (`vercel.json` points `@vercel/node` at `src/server.js`).
- Uploaded files are streamed to Cloudinary; only the `secure_url` string is stored in MongoDB, not the binary.
- `.gitignore` excludes `.env`, `node_modules/`, `uploads/`, and `docs/`.
