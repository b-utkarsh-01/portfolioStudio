# Deployment Steps

This file explains, how to safely “push” changes to production when you edit **any one repo** (default templates / premium templates / template renderer / frontend / backend) or **multiple repos together**.

The most important concept in this project is **SHA pinning**:
- The `frontend` app does **not automatically** pick the latest templates.
- Instead, `frontend/package.json` contains a URL that is pinned to a specific Git commit **SHA**.
- So after you push templates, you must also update the SHA in the consuming app(s), otherwise production may still use the old version.

---

## 0) Quick glossary (easy words)

- **Repo**: a project folder with its own Git history (example: `premium-templates/`).
- **Commit**: a saved snapshot of your changes.
- **Push**: sending your commits to GitHub so production can use them.
- **SHA**: the unique ID of a commit (looks like random letters/numbers).
- **Pinning**: writing a specific SHA into `package.json` so the app uses exactly that commit.

---

## 1) The repos in this workspace

- `default-templates/` → default template package
- `premium-templates/` → premium template package
- `template-renderer/` → engine that renders templates
- `frontend/` → website (Vercel deploy)
- `backedn/` → backend API

---

## 2) How to get the SHA (the command)

You get the SHA **from the repo you just committed**.

Steps:
1) Open terminal
2) Go inside the repo you changed:
   - `cd premium-templates`
   - OR `cd default-templates`
   - OR `cd template-renderer`
3) Run:
   - `git rev-parse HEAD`

That printed value is your SHA.

Example:
- `59fc501ddca68a1a201c4e3c5b5bd0cc05176487`

Tip:
- Use the full SHA you get from the command (safe).

---

## 3) Where the SHA must be updated (which file + which keys)

### A) If you changed **premium templates** (`premium-templates/`)

You must update the SHA in:

1) `frontend/package.json`
   - `dependencies.portfolio-studio-premium`
   - `overrides.portfolio-studio-premium`
   - `overrides["portfolio-template-renderer"].portfolio-studio-premium`

2) `template-renderer/package.json`
   - `dependencies.portfolio-studio-premium`

The URL format used is:
- `https://codeload.github.com/b-utkarsh-01/portfolioStudio-premium/tar.gz/<SHA>`

So you replace `<SHA>` with your new SHA.

### B) If you changed **default templates** (`default-templates/`)

You must update the SHA in:

1) `frontend/package.json`
   - `dependencies.portfolio-studio-default`
   - `overrides.portfolio-studio-default`
   - `overrides["portfolio-template-renderer"].portfolio-studio-default`

2) `template-renderer/package.json` (if it has the default package)
   - `dependencies.portfolio-studio-default`

URL format:
- `https://codeload.github.com/b-utkarsh-01/portfolioStudio-default/tar.gz/<SHA>`

### C) If you changed **template renderer** (`template-renderer/`)

You must update the SHA in:

1) `frontend/package.json`
   - `dependencies.portfolio-template-renderer`
   - (optional, only if present) `overrides.portfolio-template-renderer`

URL format:
- `https://codeload.github.com/b-utkarsh-01/portfolioStudio-template-renderer/tar.gz/<SHA>`

### D) If you changed **frontend** only (`frontend/`)

Usually you do **not** need any SHA update (unless you are also updating templates/renderer pins).

### E) If you changed **backend** only (`backedn/`)

No SHA pinning is required in `package.json` for frontend templates. Backend deploy is separate.

---

## 4) The “Lockfile” rule (VERY important for no production errors)

Whenever you change ANY dependency URL/SHA inside `frontend/package.json`, you must also update and push the lockfile:

1) `cd frontend`
2) `npm install`
3) This updates `frontend/package-lock.json`
4) Commit + push BOTH files:
   - `frontend/package.json`
   - `frontend/package-lock.json`

If you push only `package.json` and forget `package-lock.json`, production can break or keep old versions.

---

## 5) Step‑by‑step: what to push first (order matters)

### Situation 1: You changed **only premium templates**

Do this order:
1) `premium-templates/` → commit + push
2) Update premium SHA in:
   - `frontend/package.json`
   - `template-renderer/package.json`
3) `frontend/` → `npm install` → build → commit + push (with lockfile)
4) (if `template-renderer/package.json` changed) `template-renderer/` → commit + push

### Situation 2: You changed **only default templates**

Same pattern:
1) `default-templates/` → commit + push
2) Update default SHA in:
   - `frontend/package.json`
   - `template-renderer/package.json` (if present)
3) `frontend/` → `npm install` → build → commit + push (with lockfile)
4) `template-renderer/` → commit + push (if you changed it)

### Situation 3: You changed **only template-renderer**

Do this order:
1) `template-renderer/` → commit + push
2) Update renderer SHA in `frontend/package.json`
3) `frontend/` → `npm install` → build → commit + push (with lockfile)

### Situation 4: You changed **only frontend**

Do this order:
1) `frontend/` → `npm run build` (recommended)
2) commit + push

### Situation 5: You changed **only backend**

Do this order:
1) `backedn/` → run tests (if you have) → commit + push
2) Check backend deployment logs (whatever platform you use)

### Situation 6: You changed **premium templates + frontend**

Do this order:
1) Push `premium-templates/`
2) Update premium SHA in `frontend/package.json` (+ overrides)
3) `frontend/` → `npm install` → build → commit + push

### Situation 7: You changed **premium templates + renderer + frontend**

Do this order:
1) Push `premium-templates/`
2) Push `template-renderer/`
3) Update BOTH SHAs in `frontend/package.json`:
   - premium templates SHA
   - renderer SHA
4) `frontend/` → `npm install` → build → commit + push

### Situation 8: You changed **backend + frontend**

If frontend depends on backend API changes, prefer:
1) Push `backedn/` first (keep API backward compatible if possible)
2) Push `frontend/` next

---

## 6) Mini command templates (copy/paste)

### Commit and push (inside any repo)

- `git status -sb`
- `git add -A`
- `git commit -m "Your message"`
- `git push origin main`

### Get SHA (inside the repo you just committed)

- `git rev-parse HEAD`

### Frontend install/build after SHA change

- `cd frontend`
- `npm install`
- `npm run build`
- `git add package.json package-lock.json`
- `git commit -m "Bump templates/renderer SHA"`
- `git push origin main`

