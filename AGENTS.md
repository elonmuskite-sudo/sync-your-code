<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Architecture rules
- Supabase remains the production default for chat and auth. The opt-in Appwrite path uses a server-verified identity gateway and message polling; do not assume an Appwrite JWT is a Supabase JWT.
- Appwrite-authenticated Supabase data requests must go through server endpoints that verify the Appwrite JWT, resolve the immutable Appwrite-to-Supabase identity link, and execute database work as `authenticated` inside a transaction so existing RLS policies remain in force. Never proxy user data with the service-role key.
- The Appwrite gateway migration is incomplete: profile, directory, chat, contact, message-polling, chat-file, admin, payment, and identity-verification flows have gateway paths, but other Supabase-backed surfaces remain. Keep `VITE_AUTH_PROVIDER=supabase` until every enabled surface is migrated and verified.
- Production runs on the user's own Supabase project via Vercel env vars; docs/supabase-schema.sql is the schema to apply there, since that project is not managed from Lovable.
- Encode reactions and reply metadata with the versioned chat protocol in existing message fields; this preserves compatibility without requiring unprovisioned database columns.
- Centralize chat controls in ChatButton and chat presentation effects in global semantic-token CSS; this keeps interaction and theme behavior consistent.
- Secrets for Supabase Edge Functions and Vercel are pushed by scripts/secrets-run.js (local or .github/workflows/secrets-sync.yml); one script keeps key checks and destinations consistent.
- tsconfig excludes the unused TanStack/shadcn scaffold files (src/components/ui, src/routes, router/server/start, vite.config.ts); the live app is the JSX + vite.config.js build and those files reference packages that are not installed.
