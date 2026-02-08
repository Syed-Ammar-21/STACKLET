# 📁 Stacklet Project Structure

## Root Directory

### Configuration Files
- `.env` - Environment variables for Supabase configuration
- `vite.config.ts` - Vite build tool configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Lock file for dependencies
- `eslint.config.js` - ESLint configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - Configuration for shadcn/ui components
- `server.js` - Development server configuration

### Documentation
- `STACKLET_README.md` - Main project documentation
- `README_DATABASE_SETUP.md` - Database setup and configuration
- `README_TECH_STACK.md` - Technology stack details
- `README_PROJECT_STRUCTURE.md` - Project structure documentation
- `LICENSE` - Project license

### Data & Assets
- `books_import.csv` - Sample book data for import
- `public/` - Static assets
  - `logo.png`, `Booklogo.png` - Application logos
  - `robots.txt` - Web crawler instructions
  - `translogo.png` - Transparent logo variant

### Supabase
- `supabase/` - Database migrations and configuration
  - `migrations/` - Database schema migrations
    - `20240710_create_profiles.sql` - Profiles table
    - `20240710_create_books.sql` - Books table
    - `20240115_auto_timestamps.sql` - Timestamp triggers
    - `20240115_add_categories_tags.sql` - Categories and tags schema
  - `config.toml` - Supabase project configuration

## Source Code (`src/`)

### Core Files
- `main.tsx` - Application entry point
- `App.tsx` - Root component and routing configuration
- `App.css` - Global styles
- `vite-env.d.ts` - TypeScript type declarations for Vite
- `types/` - TypeScript type definitions
  - `index.ts` - Centralized type exports

### Components
- `components/` - Reusable UI components
  - `ui/` - shadcn/ui components (pre-built, accessible UI elements)
  - `AddBookForm.tsx` - Form for adding new books
  - `BookCard.tsx` - Card component for displaying book info
  - `BookDetailModal.tsx` - Modal for detailed book view
  - `BookForm.tsx` - Shared form component for add/edit operations
  - `Navbar.tsx` - Main navigation component
  - `SearchBar.tsx` - Book search functionality
  - `SortControls.tsx` - Sorting functionality for books
  - `ProtectedRoute.tsx` - Authentication wrapper component
  - `ErrorMessage.tsx` - Standardized error display
  - `ReactBitsLoader.tsx` - Loading animation component
  - `GenreFilter.tsx` - Book filtering by genre
  - `CategorySelect.tsx` - Category selection component

### Pages
- `pages/` - Route components
  - `Home.tsx` - Main dashboard/landing page
  - `Login.tsx` - User authentication
  - `Signup.tsx` - New user registration
  - `ResetPassword.tsx` - Password reset functionality
  - `VerifyEmail.tsx` - Email verification handling
  - `OAuthCallback.tsx` - OAuth authentication callback
  - `NotFound.tsx` - 404 error page

### Services
- `services/` - API and business logic
  - `authService.ts` - Authentication-related API calls
  - `bookService.ts` - Book-related API operations

### Integrations
- `integrations/` - Third-party service integrations
  - `supabase/` - Supabase client configuration
    - `client.ts` - Supabase client initialization
    - `types.ts` - Supabase-generated types

### Hooks
- `hooks/` - Custom React hooks
  - `useAuth.tsx` - Authentication state management
  - `use-toast.ts` - Toast notification system

## Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `lib/` — Utility functions.
- `types/` — TypeScript type definitions.

---

## Key Folders & Files

### `components/`
- `BookCard.tsx` — Displays a single book's info. Used in book lists.
- `BookDetailModal.tsx` — Modal for viewing book details.
- `BookForm.tsx` — Form for adding/editing a book.
- `AddBookForm.tsx` — Used for CSV/bulk import.
- `CategorySelect.tsx`, `GenreFilter.tsx`, `SortControls.tsx`, `SearchBar.tsx` — Filtering, sorting, and searching books.
- `Navbar.tsx`, `Footer.tsx` — Main navigation and footer.
- `ProtectedRoute.tsx` — Restricts access to authenticated users.
- `ErrorMessage.tsx` — Displays error messages.
- `ReactBitsLoader.tsx` — Animated loader.
- `ui/` — Reusable UI primitives (buttons, dialogs, cards, etc. from shadcn/ui and Radix UI).

### `pages/`
- `Home.tsx` — Main library page (lists/searches books).
- `AddBook.tsx` — Add new book page.
- `EditBook.tsx` — Edit book details page.
- `BookDetailModal.tsx` — Modal for book info (used in Home, etc.).
- `Signup.tsx`, `Login.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `VerifyEmail.tsx`, `OAuthCallback.tsx` — All authentication and account-related pages.
- `NotFound.tsx` — 404 error page.

### `hooks/`
- `useAuth.ts` — Custom hook for authentication state.
- `use-toast.ts` — Custom hook for toast notifications.

### `services/`
- `authService.ts` — Handles authentication API logic.
- `bookService.ts` — Handles book CRUD API logic.

### `integrations/`
- `supabase/client.ts` — Exports the Supabase client instance.
- `supabase/types.ts` — Database types for Supabase.

### `lib/`
- `utils.ts` — Utility/helper functions used throughout the app.

### `types/`
- `index.ts` — Main TypeScript types (Book, User, etc.).

---

## Highlights
- **Authentication**: All auth logic is in `services/authService.ts`, `hooks/useAuth.ts`, and pages like `Login.tsx`, `Signup.tsx`.
- **Routes**: Defined in `App.tsx` and implemented in `pages/`.
- **Components**: UI in `components/` and `components/ui/`.
- **Utilities**: Shared helpers in `lib/`.

If you need more detail on any file, see the code!

---
