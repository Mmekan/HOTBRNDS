// HOT BRANDS™ — Supabase Client
// ─────────────────────────────────────────────────────────
// 1. Go to supabase.com → New project
// 2. Settings → API → copy Project URL and anon/public key
// 3. Paste them below — that is all you need to change here
// ─────────────────────────────────────────────────────────

const SUPABASE_URL      = 'https://nunowiiqbutzwagziwxw.supabase.co';       // e.g. https://abcdef.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bm93aWlxYnV0endhZ3ppd3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNjYwOTgsImV4cCI6MjA5ODk0MjA5OH0.lW1wyYaBENOEyr27qjUqsJ5Uu4h8BPYAbgO6eucnVvw';  // long string starting with eyJ...

const { createClient } = window.supabase;
window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
