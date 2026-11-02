# Motorlist

AGMC's internal vehicle stock portal. Signed-in employees browse the stock list, filter and sort it, and open a full vehicle page with gallery, specs, finance calculator and branch contact buttons. All vehicle and page content comes from Sanity.

**Stack:** Next.js 16 (App Router, Cache Components), TypeScript (strict), Tailwind CSS 4, Sanity 6 (Studio embedded at `/studio`), NextAuth 4 (Credentials provider), FontAwesome.

## Setup

Requires Node 20.9 or newer.

```bash
npm install
cp .env.example .env.local      # then fill in the values below
npm run seed                    # loads 12 sample vehicles, makes, sellers and the two pages
npm run dev                     # http://localhost:3000
```

Sign in with any `@agmc.com` address and the password set in `AUTH_CREDENTIALS_PASSWORD`.

### Environment variables

| Variable                        | Required              | Purpose                                              |
| ------------------------------- | --------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes                   | Sanity project ID                                    |
| `NEXT_PUBLIC_SANITY_DATASET`    | yes                   | Sanity dataset, usually `production`                 |
| `SANITY_API_READ_TOKEN`         | if dataset is private | Viewer token for reading content                     |
| `SANITY_REVALIDATE_SECRET`      | for webhooks          | Secret shared with the Sanity webhook                |
| `NEXTAUTH_SECRET`               | yes                   | Signs session cookies. `openssl rand -base64 32`     |
| `NEXTAUTH_URL`                  | yes                   | Public URL of the app, e.g. `http://localhost:3000`  |
| `AUTH_ALLOWED_EMAIL_DOMAIN`     | no                    | Email domain allowed to sign in. Default `agmc.com`  |
| `AUTH_CREDENTIALS_PASSWORD`     | yes                   | Shared sign-in password. Login fails closed if unset |

### Sanity

- **Seeding** runs `sanity exec scripts/seed.ts --with-user-token`, so it uses your own Sanity CLI login (`npx sanity login`). It's idempotent: re-running replaces the sample documents rather than duplicating them.
- **Embedded Studio** at `/studio` needs the app's origin in the project's CORS list, with credentials allowed:
  ```bash
  npx sanity cors add http://localhost:3000 --credentials
  ```
  Repeat for each deployed URL.
- **Revalidation:** Sanity reads are cached and tagged by document type (`vehicle`, `make`, `seller`, `page`). To publish changes instantly, add a webhook in sanity.io/manage → API → Webhooks:
  - URL: `https://<your-host>/api/revalidate`
  - Trigger on create, update and delete; projection `{_type}`
  - Secret: the value of `SANITY_REVALIDATE_SECRET`

  Without the webhook, content still refreshes within the hour.

- **Types:** after changing a schema or a GROQ query, run `npm run typegen` to regenerate `sanity/types.ts`.

## Scripts

| Command                       | What it does                                              |
| ----------------------------- | --------------------------------------------------------- |
| `npm run dev`                 | Dev server                                                |
| `npm run build` / `npm start` | Production build and server                               |
| `npm run lint`                | ESLint (with Prettier compatibility)                      |
| `npm run typecheck`           | `tsc --noEmit`                                            |
| `npm run format`              | Prettier, including Tailwind class sorting                |
| `npm run check`               | Self-check for URL filter parsing and the finance formula |
| `npm run typegen`             | Extract the Sanity schema and generate query result types |
| `npm run seed`                | Load sample content into Sanity                           |

## How it works

- **Routes:** `/login` is public. `proxy.ts` (Next 16's replacement for middleware) sends every other route to `/login?callbackUrl=…` when there's no session, and `/` redirects to `/vehicle-stock`.
- **Listing state lives in the URL** (`?make=porsche,bmw&body=SUV&priceMax=300000&sort=price-asc&page=2`), so every view is shareable and server-rendered. Filter changes update the URL immediately and the results re-render on the server. One static GROQ query covers every filter combination, with `null` params switching clauses off.
- **Facet counts** (makes, models, body types, cities, budgets, price and year ranges) come from GROQ aggregations in `FACETS_QUERY`.
- **Saved vehicles** use `useFavourites()` (`lib/favourites.ts`). They're stored in localStorage per signed-in email. To move them to a database, replace that hook's read and write functions; components only use the hook.

### Switching to Microsoft Entra ID SSO

Login is isolated in `lib/auth/options.ts`. Replace the Credentials provider with `AzureADProvider({ clientId, clientSecret, tenantId })` from `next-auth/providers/azure-ad`, and change the login form's `signIn("credentials", …)` call to `signIn("azure-ad")`. The proxy, session handling and header don't depend on the provider.

## Folder structure

```
app/                     routes: login, (portal)/vehicle-stock, (portal)/vehicle-stock/[slug],
                         (portal)/employee-benefits, (portal)/terms-and-conditions, studio, api
components/layout        header, nav, footer, session provider
components/listing       search band, results header, card, browse rows, pagination
components/filters       filter state provider, filter drawer, body type icons
components/detail        gallery and lightbox, specs, finance calculator, similar vehicles
components/ui            shared pieces: menu, favourite button, contact buttons, rich text
lib/sanity               client and cached fetch, GROQ queries, image helpers
lib/auth                 NextAuth options, email domain rule
lib/utils                URL ⇄ filter state, formatting, finance maths
lib/options.ts           enumerated values shared by the schema and the UI
sanity/schemaTypes       vehicle, make, seller, page
scripts/                 seed.ts, check.ts
```

## Known limitations

- The Credentials provider uses one shared password and identifies people by email only. It's a stopgap until Entra ID SSO; there's no rate limiting on sign-in attempts.
- Seeded dealer phone and WhatsApp numbers are placeholders. Replace them in Studio under Seller.
- Saved vehicles don't sync across browsers until they move to a database.
