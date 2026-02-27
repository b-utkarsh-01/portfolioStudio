# Portfolio Studio

Portfolio Studio is a full-stack app where users can login, fill resume data, choose a template, and publish their own portfolio website.

## Current Product Flow

- `Home`: placeholder section (kept intentionally empty for now)
- `About`: explains product concept
- `See Templates`: lists templates
- `Login`: register/login and continue to dashboard
- `Dashboard`: edit portfolio data and save
- Public portfolio URL: `/u/:username`

## Tech Stack

### Frontend
- React + Vite
- React Router
- Tailwind CSS

### Backend
- Express.js
- MongoDB + Mongoose
- JWT auth
- bcrypt password hashing

## Project Structure

```text
src/
  features/
    auth/
    api/
    portfolio/
  page/
    HomePage.jsx
    ProductAboutPage.jsx
    TemplatesPage.jsx
    Auth.jsx
    Dashboard.jsx
    UserPortfolio.jsx
../backend/
  src/
    config/
    db/
    middleware/
    models/
    routes/
    seed/
    server.js
```

## Environment Setup

### Frontend (`.env`)

Copy `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (`../backend/.env`)

Copy `../backend/.env.example`:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_studio
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## Run Locally

### 1) Backend

```bash
cd ../backend
npm install
npm run dev
```

### 2) Frontend

```bash
npm install
npm run dev
```

## Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/portfolios/me` (Bearer token)
- `PUT /api/portfolios/me` (Bearer token)
- `GET /api/portfolios/:username` (public)

## Notes

- Current template is `portfolio-v1` (the existing portfolio UI).
- More templates can be added later via `templateId` support in portfolio payload.
