# Fable Legacy

Fable Legacy is a living archive for public projects, demos, refactors, benchmarks, and social artifacts connected to the brief Claude Fable 5 release window.

## Live site

- Production: https://fable-legacy.rick216.cn
- Cloudflare Pages: https://fable-legacy.pages.dev
- GitHub: https://github.com/Yorick-Ryu/FableLegacy

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

This project is deployed through Cloudflare Pages with GitHub as the source repository:

- Pages project: `fable-legacy`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- D1 database: `fable-legacy-db`
- D1 database id: `09fd02cc-a247-41ac-8283-ad1e209a5944`
- Custom domain: `fable-legacy.rick216.cn`

To recreate the setup:

1. Create or connect a Cloudflare Pages project named `fable-legacy`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Create a D1 database if needed:

```bash
npx wrangler d1 create fable-legacy-db
```

4. Replace `database_id` in `wrangler.toml` with the returned D1 database id.
5. Apply the migration:

```bash
npx wrangler d1 migrations apply fable-legacy-db --remote
```

6. Deploy manually if you are not using GitHub-triggered Pages builds:

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
