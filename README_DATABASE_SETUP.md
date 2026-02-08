# 📚 Stacklet Supabase Database Setup Guide

This guide will help you set up your own Supabase database for Stacklet. Follow these steps if you want to use your own backend instead of the default developer database.

---

## 1. Create a Supabase Project
1. Go to [https://app.supabase.com/](https://app.supabase.com/) and sign up or log in.
2. Click **New Project** and fill in the details (name, password, region).
3. Wait for your project to be provisioned.

## 2. Create Required Tables

For detailed table schemas and SQL commands, please refer to the supabase folder in project strcture files. The migration files contain all the necessary SQL commands to set up the database schema, including:

- `profiles` table for user information
- `books` table for storing book details
- Other related tables and relationships.


## 3. Enable Row Level Security (RLS) and Policies

To apply these migrations, you can use the Supabase CLI or run the SQL commands directly in your Supabase SQL editor.
 
```sql
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own books
CREATE POLICY "Allow users to insert their own books"
  ON books
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own books
CREATE POLICY "Allow users to select their own books"
  ON books
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own books
CREATE POLICY "Allow users to update their own books"
  ON books
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own books
CREATE POLICY "Allow users to delete their own books"
  ON books
  FOR DELETE
  USING (auth.uid() = user_id);
```

## 4. Get Your Supabase Project URL & Anon Key
- Go to your Supabase project dashboard.
- Click **Project Settings > API**.
- Copy the **Project URL** and **anon public key**.

## 5. Configure the `.env` File
Create or update your `.env` file at the root of your project:

```
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Connect the Frontend
- The app will automatically use your `.env` values if set.
- If you keep the default values, your data will be stored in the developer's Supabase project.

## 6. (Optional) Use Developer's Database
- If you do not change the `.env` values, your data will be stored in the original developer's database and visible to the developer.

---

You're now ready to use Stacklet with your own Supabase backend!


## Google Sign-In Setup

To enable Google Sign-In for your own Supabase project:

1. **Go to Supabase Dashboard**
   - Navigate to your project > Authentication > Providers > Google.
2. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (if needed).
   - Go to APIs & Services > Credentials > Create Credentials > OAuth Client ID.
   - Choose "Web Application".
   - Set **Authorized redirect URIs** to:
     - `http://localhost:8080` (this is my local dev URL)
     - `https://mbaeejjxujzzfvrhurcy.supabase.co/auth/v1/callback` (this is my deployed authorized redirect URL)
     - **Important:** Also add `/oauth-callback` if your app uses that route, e.g.,
       - `http://localhost:8080/oauth-callback` (local)
       - `https://mbaeejjxujzzfvrhurcy.supabase.co/oauth-callback` (my deployed callback URL)
   - These URLs are specific to my project. Reviewers should use them as concrete examples, or get their own by going to their Supabase dashboard, copying their project URL, and appending `/auth/v1/callback` for production or using their local dev URL for development.
   - Copy your **Client ID** and **Client Secret**.
3. **Configure in Supabase**
   - Paste your Client ID and Client Secret into Supabase's Google provider fields.
   - Save changes.
4. **Test in App**
   - Click "Sign in with Google" in your app.
   - You should be redirected to Google, then back to your app on success.

**Note:** If you use the developer's Supabase project, Google login may be limited to the developer's credentials.

---

## API Usage & Postman

You can use Postman (or any API client) to interact with your Supabase backend, mirroring the operations implemented in this project:

### Example API Endpoint Links for Postman

**How to Test Endpoints in Postman (Local Server):**

When running `npm run server`, your local Node.js backend exposes these endpoints at `http://localhost:3001` (these are MY local endpoints; replace with your own if needed):

**Headers for all requests:**
- `Content-Type: application/json`
- `X-API-Key: your-api-key-here`  
  (Set your own API key in your `.env` file as `API_KEY=your-api-key-here`, then use it in the Postman Headers tab. Do not share your API key publicly.)

**Endpoints:**

1. `GET http://localhost:3001/api/books?email=ammarzulfiqar976@gmail.com`
   - Get all books for the user with the specified email. (In this example, `ammarzulfiqar976@gmail.com` is a sample registered user for demonstration.) Returns all book details for that user.

2. `GET http://localhost:3001/api/books?email=ammarzulfiqar887@gmail.com&genre=classic&title=1984`
   - Get a specific book for a user by email, genre, and title.

3. `POST http://localhost:3001/api/books`
   - Add a new book for a user. Example JSON body:
```json
{
  "email": "ammarzulfiqar976@gmail.com",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "rating": 5,
  "genre": "Classic",
  "summary": "A story of wealth, love, and the American Dream.",
  "coverUrl": ""
}
```

4. `PATCH http://localhost:3001/api/books/<book_id>`
   - Update a book for a user. Example JSON body:
```json
{
  "email": "ammarzulfiqar976@gmail.com",
  "rating": 5
}
```

5. `DELETE http://localhost:3001/api/books/<book_id>`
   - Delete a book for a user. Example JSON body:
```json
{
  "email": "ammarzulfiqar976@gmail.com"
}
```

**How to test:**
- Set the required headers (`Content-Type`, `X-API-Key`).
- Use the example bodies above in Postman for POST, PATCH, and DELETE.
- Adjust the email, book_id, and other fields as needed for your own data.
- These endpoints are working with Supabase and changes will be reflected in your homepage UI.
