# PortfolioStudio — System Design, Architecture & Future Plan
 
> Written for: New engineers + product stakeholders  
> Based strictly on: Evidence Pack files [1]–[11]  
> Prepared by: Staff+ Full-Stack Architect review
 
---
 
## A. Executive Summary
 
**PortfolioStudio** is a SaaS web app that lets developers and students create, customize, and publish professional portfolio websites. Users sign up, get a pre-seeded portfolio, pick a visual template (free or premium), edit their data, and publish to a public URL.
 
### Core User Flows (proven by evidence)
 
**Registration → Auto-portfolio creation**  
`authRoutes.js` `/register` handler: on successful registration, a `Portfolio` document is immediately created in MongoDB with pre-populated data derived from the registration form (name, email, phone, GitHub, titles, summary). The default `templateId` is `"premium-v1"`. Source: `backedn/src/routes/authRoutes.js`.
 
**Auth session management**  
Cookie-based dual-token system: a short-lived access token + a long-lived refresh token (30 days, `authRoutes.js`). On app load, `AuthContext.jsx` calls `/auth/me`; if it gets a 401 it silently retries via `/auth/refresh`. The refresh token is stored hashed in the User document's `refreshTokens` array.
 
**Portfolio editing + publishing**  
Authenticated users can `PUT /api/portfolios/me` to save content, then `POST /api/portfolios/me/publish` with a slug and visibility setting (`public`, `unlisted`, `private`). Published portfolios become accessible at `/p/:slug` (slug-based) or `/u/:username` (username-based). Source: `portfolioRoutes.js`, `App.jsx`.
 
**Template rendering**  
Templates come from two separate private GitHub repos (`portfolio-studio-default`, `portfolio-studio-premium`) and one renderer repo (`portfolio-template-renderer`), all installed into `frontend` via SHA-pinned GitHub tarball URLs. The `templateRendererBridge.jsx` dispatches rendering to `DefaultPortfolioRenderer`, `PremiumPortfolioRenderer`, or `AiDynamicTemplateRenderer` depending on the template ID prefix and portfolio data.
 
---
 
## B. Architecture Overview
 
```mermaid
graph TD
  subgraph Browser
    A[React SPA - Vite] --> B[AuthContext]
    A --> C[React Router v7]
    C --> D[Protected Routes]
    C --> E[Public Portfolio Routes]
    A --> F[templateRendererBridge.jsx]
    F --> G[DefaultPortfolioRenderer]
    F --> H[PremiumPortfolioRenderer]
    F --> I[AiDynamicTemplateRenderer]
  end
 
  subgraph npm Packages - SHA Pinned
    J[portfolio-studio-default @ SHA]
    K[portfolio-studio-premium @ SHA]
    L[portfolio-template-renderer @ SHA]
  end
 
  F -->|imports| J
  F -->|imports| K
  L -->|TEMPLATE_CATALOG| F
 
  subgraph Express Backend - backedn/
    M[server.js] --> N[/api/auth]
    M --> O[/api/portfolios]
    M --> P[/api/templates]
    M --> Q[/api/ai - app.js only]
    N --> R[authMiddleware + JWT]
    O --> R
  end
 
  subgraph MongoDB
    S[User collection]
    T[Portfolio collection]
  end
 
  R --> S
  O --> T
  N --> S
 
  A -->|fetch with cookies| M
```
 
**Key architectural point:** Templates are not fetched from the server at runtime — they are bundled into the frontend at build time via npm install. The backend's `/api/templates` route serves only a static catalog from a seed file, not the actual template code.
 
---
 
## C. Frontend Design
 
### Route Map
 
Source: `frontend/src/App.jsx`
 
| Path | Component | Auth Required | Layout |
|---|---|---|---|
| `/` | `HomePage` | No | `MarketingLayout` |
| `/about` | `ProductAboutPage` | No | `MarketingLayout` |
| `/templates` | `TemplatesPage` | No | `MarketingLayout` |
| `/ai-studio` | `AiStudioPage` | **Yes** | `MarketingLayout` |
| `/auth` | `Auth` | No | `MarketingLayout` |
| `/dashboard` | `Dashboard` | **Yes** | `MarketingLayout` |
| `/profile` | `ProfilePage` | **Yes** | `MarketingLayout` |
| `/templates/portfolio-v1` | `TemplateV1PreviewPage` | No | None (full-screen) |
| `/u/:username` | `UserPortfolio` | No | Template layout |
| `/p/:slug` | `UserPortfolio` | No | Template layout |
| `/portfolio-private` | `PortfolioPrivatePage` | No | None |
| `/portfolio/:payload` | `UrlPortfolioPage` | No | None |
| `/my-preview` | `MyPortfolioPreviewPage` | **Yes** | None |
| `*` | Redirect to `/` | — | — |
 
All page components are **code-split** via `React.lazy()` and wrapped in a single top-level `<Suspense>` with a `LoadingState` fallback. Source: `App.jsx`.
 
**`RouteSeo` component** (defined in `App.jsx`): a render-null component that uses `useEffect` on `location.pathname` to update `document.title`, the `<meta name="description">` tag, and toggle a `app-scrollbar` CSS class on `<html>/<body>`. Template-render routes (`/templates/portfolio-v1`, `/u/*`, `/p/*`, `/portfolio/*`) strip the scrollbar class, presumably to let templates control their own scroll.
 
### Auth Approach
 
Source: `AuthContext.jsx`, `authApi.js`, `authMiddleware.js`
 
- **Storage:** HttpOnly cookies (no `localStorage`). The frontend never sees the raw tokens — the backend sets them via `setAuthCookies()`.
- **Bootstrap:** On mount, `AuthProvider` calls `GET /auth/me`. On 401, it silently calls `POST /auth/refresh`. If that also fails, user is set to `null`.
- **Context API:** Exposes `{ currentUser, isAuthenticated, loading, login, register, logout, updateCurrentUser }`.
- **`ProtectedRoute`** (referenced in `App.jsx`, file not provided): wraps routes that require `isAuthenticated`.
- **Token type:** JWT. Access token verified by `verifyAccessToken()`, refresh token verified by `verifyRefreshToken()` — both utility functions referenced in `authRoutes.js` and `authMiddleware.js` but source not provided.
### Data Fetching & Portfolio Data Model
 
Source: `portfolioApi.js`, `portfolioRoutes.js`, `Portfolio.js` model
 
**API functions (frontend):**
 
| Function | HTTP | Endpoint |
|---|---|---|
| `getMyPortfolioApi` | GET | `/portfolios/me` |
| `upsertMyPortfolioApi` | PUT | `/portfolios/me` |
| `checkSlugAvailabilityApi` | GET | `/portfolios/slug-availability/:slug` |
| `publishMyPortfolioApi` | POST | `/portfolios/me/publish` |
| `unpublishMyPortfolioApi` | POST | `/portfolios/me/unpublish` |
| `getPortfolioByUsernameApi` | GET | `/portfolios/:username` |
| `getPortfolioBySlugApi` | GET | `/portfolios/public/:slug` |
 
**Portfolio MongoDB schema** (source: `Portfolio.js`):
 
```
user          ObjectId (ref: User, unique)
username      String (unique, indexed)
templateId    String (default: "premium-v1")
data          Mixed (arbitrary JSON — the actual portfolio content)
status        "draft" | "published"
visibility    "public" | "unlisted" | "private"
slug          String (sparse unique index, nullable)
publishedAt   Date
```
 
The `data` field is schema-free (`Mixed`). Its structure is defined by `buildRegisterPortfolioData()` in `authRoutes.js`, which seeds `profile.name`, `profile.title` (array), `profile.summary`, `profile.contacts` (array), and `badgeName`.
 
### Template Selection & Rendering Pipeline
 
Source: `templateRendererBridge.jsx`, `templateCatalog.js`, `package.json`
 
**Step 1 — Install:** Three GitHub repos are installed as npm packages at build time, pinned to specific SHAs in `frontend/package.json`:
- `portfolio-studio-default` → free templates
- `portfolio-studio-premium` → paid templates  
- `portfolio-template-renderer` → the renderer + `TEMPLATE_CATALOG` export
**Step 2 — Catalog:** `templateCatalog.js` lazy-imports `portfolio-template-renderer` and reads `renderer.TEMPLATE_CATALOG`. It normalizes tier values: `"free"/"neutral"` → `"default"`, `"pro"/"paid"` → `"premium"`. Only `"default"` and `"premium"` tier templates survive the filter.
 
**Step 3 — Rendering dispatch** (`templateRendererBridge.jsx`):
 
```
templateId starts with "ai-" AND renderMode === "dynamic" AND aiTemplateSpec present?
  → AiDynamicTemplateRenderer
 
templateId starts with "default-"?
  → DefaultPortfolioRenderer (from portfolio-studio-default)
 
otherwise (premium-*)?
  → PortfolioDataProvider + PremiumPortfolioRenderer (from portfolio-studio-premium)
```
 
**Alias resolution:** `TEMPLATE_ID_ALIASES` maps `"premium-nebula"/"nebula"` → `"premium-v1"` and `"default-cyberpunk"` → `"default-v4"` for backward compatibility.
 
**`TemplatePreviewFrame`**: a wrapper that applies `TemplateV1Layout` only for `templateId === "premium-v1"`, passing through children unchanged for all others.
 
**SHA version conflict (see Section F):** `frontend/package.json` and `template-renderer/package.json` pin `portfolio-studio-premium` to **different SHAs** (`59fc501...` vs `1f001ff...`).
 
### Public Portfolio Route Behavior
 
Source: `App.jsx`, `portfolioRoutes.js`
 
- `/u/:username` → calls `GET /api/portfolios/:username`. Backend returns 403 if `visibility === "private"` or `status !== "published"`.
- `/p/:slug` → calls `GET /api/portfolios/public/:slug`. Same visibility/status check.
- `/portfolio/:payload` → `UrlPortfolioPage` — the `payload` parameter is not explained by any provided file. This is an open question.
- Both `/u/` and `/p/` pass `appReady` and `withTemplateLayout` props to `UserPortfolio`. `/p/` additionally passes `lookupBy="slug"`.
- Redirect to `/portfolio-private` presumably happens when the API returns 403, but the `UserPortfolio` component source is not in the evidence pack.
---
 
## D. Backend Design
 
### API Routes
 
Source: `server.js`, `app.js`, `authRoutes.js`, `portfolioRoutes.js`, `templateRoutes.js`
 
**Auth routes** — `/api/auth` (rate limit: 300 req/15min in `server.js`, 30 req/15min in `app.js` — **conflict, see Section F**)
 
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create user + auto-create portfolio + issue session |
| POST | `/auth/login` | No | Verify credentials + issue session |
| POST | `/auth/refresh` | No (cookie) | Rotate refresh token + issue new session |
| POST | `/auth/logout` | No (cookie) | Revoke refresh token + clear cookies |
| GET | `/auth/me` | **Yes** | Return current user |
| PUT | `/auth/me` | **Yes** | Update `displayName` |
 
**Portfolio routes** — `/api/portfolios` (rate limit: 120/100 req/15min)
 
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/portfolios/me` | **Yes** | Fetch own portfolio |
| PUT | `/portfolios/me` | **Yes** | Upsert portfolio data |
| GET | `/portfolios/slug-availability/:slug` | **Yes** | Check slug availability |
| POST | `/portfolios/me/publish` | **Yes** | Set status=published, assign slug |
| POST | `/portfolios/me/unpublish` | **Yes** | Set status=draft, visibility=private |
| GET | `/portfolios/public/:slug` | No | Fetch public portfolio by slug |
| GET | `/portfolios/:username` | No | Fetch public portfolio by username |
 
**Template routes** — `/api/templates` (no rate limit in `server.js`)
 
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/templates` | No | Return `templateCatalog` seed array |
 
**AI routes** — `/api/ai` (exists only in `app.js`, not in `server.js` — **conflict, see Section F**)
 
### Auth & Security Middleware
 
Source: `authMiddleware.js`, `securityHeaders.js`, `rateLimit.js`, `errors.js`
 
**`authMiddleware`:** Reads access token from either `Authorization: Bearer <token>` header or an `ACCESS_COOKIE_NAME` cookie. Calls `verifyAccessToken()`, then does a DB lookup (`User.findById`) on every authenticated request — no in-memory token cache.
 
**`securityHeaders`:** Sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (disables camera/mic/geo), `Cross-Origin-Resource-Policy: same-site`.
 
**`app.js` additionally** applies `helmet` with `contentSecurityPolicy: false` and `crossOriginResourcePolicy: false`. `server.js` does not use `helmet`. **Conflict — see Section F.**
 
**Rate limiter:** In-process, in-memory `Map`-based implementation (not Redis). Key = `baseUrl + path + client IP`. No persistence across restarts, not horizontally scalable as-is.
 
**Error format:** All errors return `{ code, message, details?, requestId }`. `requestId` is a `crypto.randomUUID()` attached to every request via middleware.
 
**`publishMyPortfolioApi` slug logic:** Normalizes slug to lowercase alphanumeric + hyphens, min 3 chars. Checks against a hardcoded `RESERVED_SLUGS` set (`admin`, `api`, `auth`, `dashboard`, `login`, `logout`, `profile`, `register`, `settings`, `templates`, `u`, `p`). Then checks DB for collision excluding the user's own portfolio.
 
---
 
## E. Folder Structure
 
Based on evidence pack only. Files not provided are marked `(not seen)`.
 
```
portfolioStudio/                     # monorepo root (inferred from deployment docs)
│
├── frontend/                        # React SPA (Vite)
│   ├── package.json                 # SHA-pinned template deps [2]
│   ├── package-lock.json            # must be committed with package.json [DEPLOYMENT_STEPS.md]
│   ├── scripts/
│   │   └── switch-template-source.mjs  # local vs git template switching [package.json scripts]
│   └── src/
│       ├── App.jsx                  # root router, lazy routes, RouteSeo [3]
│       ├── features/
│       │   ├── auth/
│       │   │   ├── AuthContext.jsx  # session bootstrap, auth actions [8]
│       │   │   └── authApi.js       # auth HTTP calls [8]
│       │   ├── api/
│       │   │   └── http.js          # apiRequest base (not seen)
│       │   └── portfolio/
│       │       ├── portfolioApi.js       # portfolio HTTP calls [7]
│       │       ├── templateApi.js        # GET /templates call [6]
│       │       ├── templateCatalog.js    # catalog loading + normalization [4]
│       │       ├── templateRendererBridge.jsx  # render dispatch [5]
│       │       └── aiDynamic/
│       │           └── AiDynamicTemplateRenderer  # (not seen)
│       ├── layout/
│       │   ├── MarketingLayout.jsx  # (not seen)
│       │   └── LoadingState.jsx     # (not seen)
│       ├── routing/
│       │   └── ProtectedRoute.jsx   # (not seen)
│       └── page/                    # all lazy-loaded page components (not seen)
│
├── backedn/                         # Express + MongoDB backend (typo in folder name)
│   ├── package.json                 # [11]
│   └── src/
│       ├── server.js                # entry point used in prod [11]
│       ├── app.js                   # factory function (possibly test/alt entry) [11]
│       ├── config/
│       │   └── env.js               # env vars (not seen)
│       ├── db/
│       │   └── connect.js           # MongoDB connect (not seen)
│       ├── models/
│       │   ├── User.js              # [11]
│       │   └── Portfolio.js         # [11]
│       ├── routes/
│       │   ├── authRoutes.js        # [11]
│       │   ├── portfolioRoutes.js   # [11]
│       │   ├── templateRoutes.js    # [11]
│       │   └── aiRoutes.js          # (not seen — only mounted in app.js)
│       ├── middleware/
│       │   ├── auth.js              # authMiddleware [11]
│       │   ├── errors.js            # sendError [11]
│       │   ├── rateLimit.js         # in-memory rate limiter [11]
│       │   └── securityHeaders.js   # [11]
│       ├── utils/
│       │   ├── token.js             # sign/verify JWT (not seen)
│       │   ├── authCookies.js       # cookie helpers (not seen)
│       │   ├── cookies.js           # parseCookies (not seen)
│       │   └── portfolioValidation.js  # validatePortfolioPayload (not seen)
│       └── seed/
│           ├── defaultPortfolioData.js  # base portfolio data structure (not seen)
│           └── templateCatalog.js       # static catalog served by GET /templates (not seen)
│
├── template-renderer/               # renderer npm package
│   ├── package.json                 # [9] — pins default + premium SHAs
│   └── src/
│       └── index.jsx                # exports TEMPLATE_CATALOG, getTemplateById, renderers
│
├── default-templates/               # free templates repo (separate Git)
│   └── (structure not seen)
│
└── premium-templates/               # paid templates repo (separate Git)
    ├── README.md                    # SHA pinning instructions [9]
    ├── DEPLOYMENT_STEPS.md          # full deployment guide [2]
    └── src/templates/
        └── nebula1/
            └── GooeyNav.jsx         # example nav component [10]
```
 
---
 
## F. Reality Check — Mismatches & Risks
 
### 1. Two entry points for the backend (`server.js` vs `app.js`)
 
`server.js` mounts: `/api/auth`, `/api/portfolios`, `/api/templates`  
`app.js` mounts: `/api/auth`, `/api/ai`, `/api/portfolios`, `/api/portfolio` (alias), `/api/templates`
 
Differences proven by evidence:
- **`/api/ai` is missing from `server.js`** — if `server.js` is the production entry point (as implied by `"start": "node src/server.js"`), the AI routes are dead in production.
- **Rate limit on `/api/auth` differs**: 300 req/15min (`server.js`) vs 30 req/15min (`app.js`) — a 10x discrepancy that could be a security gap or a copy-paste error.
- **`helmet` is only in `app.js`**, not `server.js`. Production server lacks Helmet hardening.
- **`/api/portfolio` backward-compat alias** exists only in `app.js`.
**Risk: High.** The codebase has two diverged server configurations. It is unclear which one runs in production.
 
### 2. SHA version mismatch between `frontend` and `template-renderer`
 
`frontend/package.json` pins `portfolio-studio-premium` to SHA `59fc501...`  
`template-renderer/package.json` pins `portfolio-studio-premium` to SHA `1f001ff...`
 
Source: `package.json` files in [2] and [9].
 
These are different versions of the same template package. If `portfolio-template-renderer` bundles the premium templates at a different SHA than what `frontend` uses directly, template behavior could be inconsistent depending on which code path is hit.
 
**Risk: Medium.** Likely causes subtle rendering differences or broken templates for some paths.
 
### 3. In-memory rate limiter is not production-safe
 
`rateLimit.js` uses a `Map` in process memory. This means:
- Rate limits reset on every server restart/deploy.
- If the backend ever runs more than one process/instance, each has its own counter — rate limits are bypassed.
**Risk: Medium** for a single-instance deploy, **High** if any horizontal scaling is attempted.
 
### 4. `authMiddleware` does a DB lookup on every request
 
`authMiddleware.js` calls `User.findById(decoded.sub)` on every authenticated API call. There is no caching layer (no Redis, no in-memory LRU). Under load this adds a MongoDB round-trip to every protected endpoint.
 
**Risk: Low** at current scale, **Medium** as user base grows.
 
### 5. `data` field on Portfolio is fully schema-free (`Mixed`)
 
There is no enforced structure on `portfolio.data` in MongoDB. `validatePortfolioPayload` (referenced in `portfolioRoutes.js`) provides some validation but its source is not provided. If validation is weak, malformed or oversized data can be stored.
 
**Risk: Medium.** The `1mb` JSON body limit in `server.js` is the only hard cap proven by evidence.
 
### 6. `/portfolio/:payload` route purpose is unclear
 
`App.jsx` registers `<Route path="/portfolio/:payload" element={<UrlPortfolioPage appReady />} />`. No other file explains what `:payload` is — it may be a base64-encoded portfolio, a legacy route, or a share link mechanism.
 
---
 
## G. Future Plan
 
### Now — Stabilize & De-risk (1–4 weeks)
 
**1. Consolidate `server.js` and `app.js`**  
Why: Two diverged entry points means `/api/ai`, `helmet`, the backward-compat route alias, and the correct rate limit are absent from production.  
Impact: Critical — AI Studio page (`/ai-studio`) is likely broken in production.  
Effort: Low (merge the two files).  
Risk: Low.
 
**2. Align SHA versions across `frontend` and `template-renderer`**  
Why: `portfolio-studio-premium` is pinned to two different SHAs, risking inconsistent template rendering.  
Impact: Medium — affects correctness of template catalog and rendered output.  
Effort: Low (update one `package.json` + `npm install` + push lockfile, per DEPLOYMENT_STEPS.md).  
Risk: Low.
 
**3. Document and test `/portfolio/:payload` route**  
Why: Its behavior is unknown. If it's a legacy route it should be removed; if active it needs documentation.  
Impact: Medium — affects how share links and URL-based portfolios work.  
Effort: Low (read `UrlPortfolioPage.jsx`).  
Risk: Low.
 
### Next — Improve Reliability (1–3 months)
 
**4. Replace in-memory rate limiter with Redis**  
Why: Current implementation does not survive restarts or multi-process deploys.  
Impact: High — without this, the auth rate limit is trivially bypassed.  
Effort: Medium (add `ioredis` / `rate-limit-redis`, update `createRateLimiter`).  
Risk: Low (well-understood pattern).
 
**5. Add caching to `authMiddleware` DB lookup**  
Why: Every authenticated request hits MongoDB. As request volume grows, this is the first bottleneck.  
Impact: Medium (latency + DB load reduction).  
Effort: Medium (add an in-memory LRU or Redis cache keyed by user ID with a short TTL).  
Risk: Low.
 
**6. Create a CI deployment checklist that enforces SHA parity**  
Why: The SHA mismatch between `frontend` and `template-renderer` was caught only by manual review. This will recur.  
Impact: Medium — prevents silent template version drift.  
Effort: Low (a simple script that reads both `package.json` files and errors on SHA mismatch).  
Risk: Low.
 
**7. Define a schema or JSON Schema for `portfolio.data`**  
Why: The `Mixed` field is unbounded. Without a shape contract, template components can silently receive bad data.  
Impact: Medium — improves reliability of template rendering and reduces debugging time.  
Effort: Medium (define the schema, update `validatePortfolioPayload`, write migration for existing docs).  
Risk: Medium (existing data may not conform).
 
### Later — Scale & Grow (3–12 months)
 
**8. Introduce a premium access gate**  
Why: `User.hasPremiumAccess` exists in the model but no enforcement of it is visible in the provided routes or `templateRendererBridge.jsx`. Premium templates appear accessible to all users.  
Impact: High — likely a revenue leak if premium templates are not gated.  
Effort: Medium (check flag in `ProtectedRoute` or `templateRendererBridge`, add upgrade flow).  
Risk: Medium (UX change for existing users).
 
**9. Extract template delivery to a CDN / dynamic import**  
Why: Templates are bundled at build time. Adding or updating a template requires a full frontend redeploy with a new SHA pin. A dynamic import / CDN approach would allow template updates without frontend deploys.  
Impact: High (developer velocity, time-to-market for new templates).  
Effort: High (requires rethinking the rendering pipeline).  
Risk: High (significant architecture change).
 
**10. Build a proper AI template creation flow**  
Why: `AiDynamicTemplateRenderer` and `/api/ai` routes exist but are not connected in `server.js` (production entry). The `/ai-studio` route is already in the nav.  
Impact: High — key product differentiator.  
Effort: High (depends on AI route implementation, `aiRoutes.js` not provided).  
Risk: Medium.
 
---
 
## H. Open Questions
 
Each question lists the exact file(s) needed to answer it.
 
| # | Question | File(s) needed |
|---|---|---|
| 1 | Which file is the actual production entry point — `server.js` or `app.js`? Are they the same app running in different environments? | `backedn/Procfile`, `backedn/Dockerfile`, or deployment platform config (e.g., Railway/Render `start` command) |
| 2 | What does `/portfolio/:payload` do? Is `:payload` a base64-encoded portfolio object, a token, or something else? | `frontend/src/page/UrlPortfolioPage.jsx` |
| 3 | Is `portfolio-studio-premium` actually gated behind `hasPremiumAccess`? If not, where should the gate live? | `frontend/src/routing/ProtectedRoute.jsx`, `frontend/src/features/portfolio/templateRendererBridge.jsx` (full), `backedn/src/routes/portfolioRoutes.js` (full) |
| 4 | What is the shape of `portfolio.data`? What fields do the templates require? | `backedn/src/utils/portfolioValidation.js`, `backedn/src/seed/defaultPortfolioData.js` |
| 5 | What does the AI Studio do? What does `aiRoutes.js` expose? | `backedn/src/routes/aiRoutes.js`, `frontend/src/page/AiStudioPage.jsx`, `frontend/src/features/portfolio/aiDynamic/AiDynamicTemplateRenderer.jsx` |
| 6 | How does `ProtectedRoute` work — does it redirect to `/auth` on unauthenticated access? Does it handle the `loading` state from `AuthContext`? | `frontend/src/routing/ProtectedRoute.jsx` |
| 7 | What is in the backend's static `templateCatalog.js` seed, and does it match what the npm package exports as `TEMPLATE_CATALOG`? | `backedn/src/seed/templateCatalog.js` |
| 8 | What env vars does the backend require (`env.js`)? Is there a `.env.example`? | `backedn/src/config/env.js`, `backedn/.env.example` |
| 9 | What JWT signing secrets are used, what are the access/refresh token TTLs, and is token rotation on refresh enforced? | `backedn/src/utils/token.js`, `backedn/src/utils/authCookies.js` |
| 10 | What does the `scripts/switch-template-source.mjs` script in `frontend` do, and when should a developer use `templates:local` vs `templates:git`? | `frontend/scripts/switch-template-source.mjs` |