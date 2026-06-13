# Fable Legacy

Fable Legacy is a living archive for public projects, demos, refactors, benchmarks, and social artifacts connected to the brief Claude Fable 5 release window.

## Live site

- Production: https://fable-legacy.rick216.cn
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

## Deployment

The site is deployed on Cloudflare Pages. A standard Pages setup is enough:

- Build command: `npm run build`
- Output directory: `dist`
- Pages Functions handle API routes under `/api`
- D1 is used for archive and submission data

Apply D1 migrations when setting up or updating the remote database:

```bash
npx wrangler d1 migrations apply <database-name> --remote
```

Deploy manually if you are not using GitHub-triggered Pages builds:

```bash
npm run pages:deploy
```

## Review submissions

Pending submissions can be reviewed from `/#admin`. The admin API requires a bearer token configured in the Cloudflare Pages environment.

## Seed research notes

The first archive data lives in `src/data/projects.ts`. Entries intentionally include an evidence level:

- `primary`: official Anthropic or direct documentation source.
- `secondary`: press, partner, review, or benchmark source.
- `community`: public community post or creator source.
Pending community submissions stay in the admin review queue until approved.
