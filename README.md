# Clarity landing page

This is a static HTML landing page with a Vercel serverless signup endpoint backed by Supabase. No frontend build step is required.

## Deploy to Vercel

1. Create a Supabase project and run `supabase/migrations/20261001000000_create_waitlist_signups.sql` in its SQL Editor.
2. In Vercel project settings, add `SUPABASE_URL` (the project URL) and `SUPABASE_SERVICE_ROLE_KEY` (the service-role API key).
3. Import this repository into Vercel and deploy. Vercel serves `index.html` and builds `api/signup.js` as a serverless function.

Until both Supabase environment variables are configured, the page loads normally but signups return an unavailable message. The service-role key is used only by the serverless function; never add it to frontend code or a public environment variable. The table enables row-level security and grants no access to anonymous or authenticated clients.

The product preview and copy are an initial interpretation of the unified-communications context. The referenced pitch deck was not available in the workspace when this page was created.
