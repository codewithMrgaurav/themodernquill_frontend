## Sprint Plan – Frontend & Backend (High Level)

### Sprint 1 – Scaffolding & Foundations

- **Frontend**
  - Create Next.js + Tailwind app (`frontend`).
  - Configure TypeScript, ESLint, Prettier, Tailwind theme basics.
  - Set up global layout shell with `<header>`, `<main>`, `<footer>` and a basic navbar.
- **Backend**
  - Create Node.js project (`backend`) with Express, CORS, Mongoose, dotenv.
  - Add simple health check route (`/health`) and basic folder structure (`src/routes`, `src/controllers`, `src/models`).

### Sprint 2 – Global Layout, Navbar, Footer (Frontend)

- Implement glassmorphism sticky navbar (desktop/tablet/mobile variants).
- Implement footer with category sitemap and SEO text area.
- Introduce a `Seo` helper component for title/meta injection.

### Sprint 3 – Core Public Pages (Frontend)

- Home page layout (hero, trending, category grids, sidebar, ad slots).
- Category page layout (hero, filters, grid, infinite scroll placeholders, ad slots).
- Initial blog post page (structure only: H1, meta, body placeholder, related posts, FAQ section).

### Sprint 4 – Backend Domain Models & Basic APIs

- Define MongoDB schemas for `posts`, `categories`, `users/authors`, `ads`.
- Implement CRUD APIs for posts and categories (no auth yet).
- Hook Home/Category pages to these APIs (read‑only).

### Sprint 5 – Authentication & Roles

- Add email/password + Google OAuth on backend and frontend.
- Implement role‑based access (reader, author, editor, admin).
- Protect admin routes on frontend and backend.

### Sprint 6 – CMS Dashboard & Basic Analytics

- Build admin dashboard shell on frontend (cards for metrics, nav to sub‑pages).
- Implement lightweight analytics endpoints (page views count, basic stats).

### Sprint 7 – Drag & Drop Editor (MVP)

- Implement core editor UI with block list (heading, text, image, quote, ad).
- Support create/save/update posts as block arrays.
- Add SEO side panel basics (title, description, slug, keyword field).

### Sprint 8 – SEO Engine & Settings Panel

- Implement SEO scoring rules and API.
- Build settings UI for meta defaults, canonical logic, sitemap toggles.

### Sprint 9 – Ad Management & Slot Configuration

- Backend: APIs for ad slots and per‑category configuration.
- Frontend: ad management UI with previews and draggable slots.

### Sprint 10 – Media & Image Optimization Panel

- Backend: media upload, WebP conversion, compression, lazy‑load flags.
- Frontend: media panel UI with alt text suggestions and status indicators.

### Sprint 11+ – Polish, Testing, Performance & SEO Hardening

- Improve Core Web Vitals, implement test suites, refine micro‑interactions, and improve SEO details.


