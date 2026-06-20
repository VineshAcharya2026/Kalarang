# KALARANG — Silks & Studio

Premium Indian silk saree e-commerce storefront with admin panel.

**Live site:** [https://kalarang2026.netlify.app](https://kalarang2026.netlify.app)

**Netlify dashboard:** [kalarang2026](https://app.netlify.com/projects/kalarang2026/overview)

## Stack

| Layer | Service |
|-------|---------|
| Hosting & deploy | [Netlify](https://app.netlify.com/projects/kalarang2026/overview) |
| Environment config | `netlify.toml` + Netlify env vars |
| Database, auth, uploads | Google Cloud (Firestore, Auth, Storage) via client SDK |

## Run locally

Copy env vars from `netlify.toml` into `.env`, then:

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

## Deploy

Netlify auto-deploys from the [GitHub repo](https://github.com/VineshAcharya2026/Kalarang) on push to `main`.

Manual deploy:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

**Admin login:** `/admin/login` — `admin@kalarang.com`

## Project structure

```
src/
  components/   # UI components (home, layout, products, admin)
  pages/        # Route pages
  hooks/        # Data hooks (Firestore)
  firebase/     # Client SDK init, uploads, auth helpers
netlify.toml    # Netlify build, env vars, redirects
```
