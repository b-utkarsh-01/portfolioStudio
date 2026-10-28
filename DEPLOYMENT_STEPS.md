# Deployment Steps (Updated Architecture)

This document explains how to safely push and deploy changes when you edit **any repo** (`default-templates`, `premium-templates`, `frontend`, `backend`).

The most important concept in this project is **Git SHA Pinning**:
- Frontend (`portfolioStudio/package.json`) GitHub tarball URLs se packages fetch karta hai.
- Ye URLs specific commit **SHA** pe pin hoti hain taaki production build stable aur predictable rahe.
- Jab bhi aap `default` ya `premium` repo mein change push karte ho, aapko frontend ke `package.json` mein uska SHA update karna padta hai.

---

## 1) Repositories in this project

| Repo Folder | Purpose | Deploy Platform |
|---|---|---|
| `portfolioStudio-default/` | Free/Default portfolio templates | Git Repo (consumed as npm package) |
| `portfolioStudio-premium/` | Premium portfolio templates | Git Repo (consumed as npm package) |
| `portfolioStudio/` | Main React Frontend App | Vercel / Nginx Docker |
| `portfolioStudio-backend/` | Node.js / Express API | Docker / Render / VPS |

---

## 2) How to get the SHA of a commit

Repo ke folder mein jaake commit karo aur SHA lo:

```bash
# Repo ke andar jao
cd portfolioStudio-premium   # ya portfolioStudio-default

# Commit karo
git add .
git commit -m "Update styles and animations"
git push origin main

# SHA print karo
git rev-parse HEAD
```

Output example: `ec790e5...` (ya full 40-character SHA)

---

## 3) Deployment Workflows

### 🅰️ Agar ONLY `portfolioStudio-premium` mein change hua:

1. **Commit & Push Premium Repo:**
   ```bash
   cd portfolioStudio-premium
   git add .
   git commit -m "Updated premium templates"
   git push origin main
   git rev-parse HEAD    # <--- SHA copy karo
   ```

2. **Frontend `package.json` update karo:**
   File: `portfolioStudio/package.json`
   Replace `<NEW_PREMIUM_SHA>`:
   ```json
   "dependencies": {
     "portfolio-studio-premium": "https://codeload.github.com/b-utkarsh-01/portfolioStudio-premium/tar.gz/<NEW_PREMIUM_SHA>"
   },
   "overrides": {
     "portfolio-studio-premium": "https://codeload.github.com/b-utkarsh-01/portfolioStudio-premium/tar.gz/<NEW_PREMIUM_SHA>"
   }
   ```

3. **Lockfile sync karo aur Frontend build check karo:**
   ```bash
   cd portfolioStudio
   npm install
   npm run build
   ```

4. **Frontend Push karo:**
   ```bash
   git add package.json package-lock.json
   git commit -m "Bump premium template SHA to <NEW_PREMIUM_SHA>"
   git push origin main
   ```
   *(Vercel / CI-CD automatically new build trigger kar dega!)*

---

### 🅱️ Agar ONLY `portfolioStudio-default` mein change hua:

1. **Commit & Push Default Repo:**
   ```bash
   cd portfolioStudio-default
   git add .
   git commit -m "Updated default templates"
   git push origin main
   git rev-parse HEAD    # <--- SHA copy karo
   ```

2. **Frontend `package.json` update karo:**
   File: `portfolioStudio/package.json`
   Replace `<NEW_DEFAULT_SHA>`:
   ```json
   "dependencies": {
     "portfolio-studio-default": "https://codeload.github.com/b-utkarsh-01/portfolioStudio-default/tar.gz/<NEW_DEFAULT_SHA>"
   },
   "overrides": {
     "portfolio-studio-default": "https://codeload.github.com/b-utkarsh-01/portfolioStudio-default/tar.gz/<NEW_DEFAULT_SHA>"
   }
   ```

3. **Lockfile sync karo & Push frontend:**
   ```bash
   cd portfolioStudio
   npm install
   npm run build
   git add package.json package-lock.json
   git commit -m "Bump default template SHA to <NEW_DEFAULT_SHA>"
   git push origin main
   ```

---

### 🅲 Agar ONLY `portfolioStudio` (Frontend UI / Pages) mein change hua:

Koyi SHA update nahi karna!
```bash
cd portfolioStudio
git add .
git commit -m "Update dashboard UI"
git push origin main
```

---

### 🅳 Agar ONLY `portfolioStudio-backend` mein change hua:

Frontend ko koyi fark nahi padta:
```bash
cd portfolioStudio-backend
git add .
git commit -m "Update API endpoint"
git push origin main
```
Backend hosting service (Docker / Render / VPS) pe re-deploy ho jayega.

---

## 4) Crucial Rules for Zero Downtime

1. **Lockfile Rule**: Hamesha `package.json` change karne ke baad `npm install` run karke `package-lock.json` ko commit karo. Agar lockfile commit nahi ki, toh Vercel / Docker build fail ho sakti hai ya cached version utha sakti hai.
2. **Backend First Rule**: Agar backend API mein breaking change hai, toh pehle backend deploy karo, phir frontend.
