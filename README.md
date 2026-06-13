# Fable Legacy

Fable Legacy is a living archive for public projects, demos, refactors, benchmarks, and social artifacts connected to the brief Claude Fable 5 release window.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Cloudflare Pages deployment

1. Create a Cloudflare Pages project named `fable-legacy`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Create a D1 database:

```bash
npx wrangler d1 create fable-legacy-db
```

4. Replace `database_id` in `wrangler.toml` with the returned D1 database id.
5. Apply the migration:

```bash
npx wrangler d1 migrations apply fable-legacy-db --remote
```

6. Deploy:

```bash
npm run pages:deploy
```

The submit form posts to `/api/submit`. In Cloudflare Pages, `functions/api/submit.ts` validates the payload and writes pending submissions to D1 when the `FABLE_LEGACY_DB` binding is configured.

## Seed research notes

The first archive data lives in `src/data/projects.ts`. Entries intentionally include an evidence level:

- `primary`: official Anthropic or direct documentation source.
- `secondary`: press, partner, review, or benchmark source.
- `community`: public community post or creator source.
- `needs-review`: useful lead that still needs direct manual verification.

Because several X/Instagram/YouTube artifacts expose limited metadata through public search, the site preserves those leads without pretending they are fully verified.
