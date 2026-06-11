# KALARANG — Silks & Studio

Premium Indian silk saree e-commerce storefront with admin panel.

**Live site (Netlify):** [https://kalarang2026.netlify.app](https://kalarang2026.netlify.app)

**Netlify dashboard:** [kalarang2026](https://app.netlify.com/projects/kalarang2026/overview)

## Stack

| Layer | Service |
|-------|---------|
| Frontend hosting | [Netlify](https://app.netlify.com/projects/kalarang2026/overview) |
| Database | Firebase Firestore (`kalarang-48b04`) |
| Auth | Firebase Authentication |
| File uploads | Firebase Storage |

## Run locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Netlify

Netlify is configured via `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA redirects:** all routes → `index.html` (React Router)

Connect the [GitHub repo](https://github.com/VineshAcharya2026/Kalarang) in the Netlify dashboard, or deploy manually:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## Firebase backend (not hosting)

Firebase powers the database, admin auth, and image storage. Client config lives in `firebase-applet-config.json`.

```bash
# Seed admin user + sample products
npm run seed

# Deploy Firestore & Storage security rules only
npm run deploy:firebase-rules
```

**Admin login:** `/admin/login` — `vineshjm@gmail.com`

## Project structure

```
src/
  components/   # UI components (home, layout, products, admin)
  pages/        # Route pages
  hooks/        # Firestore data hooks
  firebase/     # Firebase client config & storage upload
netlify.toml    # Netlify build & redirect config
firestore.rules # Firestore security rules
storage.rules   # Storage security rules
```
