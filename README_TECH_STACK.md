# 🛠️ Stacklet Tech Stack & Project Review

## Tech Stack

### Frontend
- **React 18** — Fast, modern UI library for building components.
- **TypeScript** — Type safety and better developer experience.
- **Vite** — Lightning-fast build tool for modern web apps.
- **Tailwind CSS** — Utility-first CSS framework for rapid, responsive UI.
- **shadcn/ui + Radix UI** — Accessible, composable UI primitives.
- **Framer Motion** — Animations and transitions.
- **React Hook Form + Zod** — Form management and validation.
- **TanStack React Query** — Data fetching and caching.
- **React Router DOM** — Routing and navigation.

### Backend
- **Supabase** — Hosted PostgreSQL database + authentication as a service.

### Database
- **PostgreSQL (via Supabase)** — Relational DB for storing books, profiles, etc.

### Hosting/Deployment
- **Vercel/Netlify/Any static host** — Frontend can be deployed anywhere supporting static hosting.
- **Supabase** — Handles backend hosting.

### Libraries/Other
- **ESLint, Prettier** — Code linting and formatting.
- **PostCSS** — CSS processing.

---

## Why These Technologies?
- **React + TypeScript**: Modern, maintainable, and scalable for component-based UIs.
- **Vite**: Super fast dev/build experience.
- **Tailwind + shadcn/ui**: Beautiful, consistent, and accessible UI with minimal custom CSS.
- **Supabase**: Instant backend with auth, database, and RESTful API—no server code needed.
- **React Query**: Simplifies data fetching and caching.
- **React Hook Form + Zod**: Robust, type-safe forms and validation.

---

## Authentication Details
- **Method:** Supabase Auth (email/password, Google OAuth)
- **How it works:**
  - Users sign up or log in via Supabase Auth.
  - JWT tokens are managed by Supabase and stored securely.
  - Protected routes/components check auth state via hooks and context.
  - Google OAuth is handled via Supabase's built-in provider.

---

## API Testing with Postman

You can test the API endpoints using Postman or any HTTP client. The backend exposes RESTful endpoints for all CRUD operations on books.

### Setup:
1. Ensure your local development server is running (`npm run dev`)
2. Import the following endpoints into Postman:

### Endpoints:
- `GET /api/books?email=user@example.com` - Get all books for a user
- `POST /api/books` - Add a new book
- `PATCH /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Headers:
```
Content-Type: application/json
X-API-Key: your-api-key-here
```
---

