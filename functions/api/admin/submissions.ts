type Env = {
  FABLE_LEGACY_DB?: D1Database;
  FABLE_ADMIN_TOKEN?: string;
};

type SubmissionRow = {
  id: string;
  project_name: string;
  project_url: string;
  author: string;
  contact: string | null;
  project_type: string;
  fable_usage: string;
  description: string;
  proof_url: string;
  status: string;
  created_at: string;
  project_name_zh: string | null;
  author_zh: string | null;
  fable_usage_zh: string | null;
  description_zh: string | null;
};

type ReviewPayload = {
  id?: string;
  action?: "approve" | "reject";
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = requireAdmin(request, env);
  if (auth) return auth;

  if (!env.FABLE_LEGACY_DB) {
    return json({ error: "Archive database is not configured" }, 503);
  }

  await ensureSubmissionsTable(env.FABLE_LEGACY_DB);

  const status = new URL(request.url).searchParams.get("status") || "pending";
  const submissions = await env.FABLE_LEGACY_DB.prepare(
    `SELECT id, project_name, project_url, author, contact, project_type, fable_usage,
      description, proof_url, status, created_at, project_name_zh, author_zh,
      fable_usage_zh, description_zh
     FROM submissions
     WHERE status = ?
     ORDER BY created_at DESC`
  )
    .bind(status)
    .all<SubmissionRow>();

  return json({ submissions: submissions.results ?? [] });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = requireAdmin(request, env);
  if (auth) return auth;

  if (!env.FABLE_LEGACY_DB) {
    return json({ error: "Archive database is not configured" }, 503);
  }

  let payload: ReviewPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!payload.id || !payload.action) {
    return json({ error: "Submission id and action are required" }, 400);
  }

  await ensureSubmissionsTable(env.FABLE_LEGACY_DB);

  const submission = await env.FABLE_LEGACY_DB.prepare(
    `SELECT id, project_name, project_url, author, contact, project_type, fable_usage,
      description, proof_url, status, created_at, project_name_zh, author_zh,
      fable_usage_zh, description_zh
     FROM submissions
     WHERE id = ?`
  )
    .bind(payload.id)
    .first<SubmissionRow>();

  if (!submission) {
    return json({ error: "Submission not found" }, 404);
  }

  if (submission.status !== "pending") {
    return json({ error: "Submission has already been reviewed" }, 409);
  }

  if (payload.action === "reject") {
    await env.FABLE_LEGACY_DB.prepare(`UPDATE submissions SET status = 'rejected' WHERE id = ?`).bind(submission.id).run();
    return json({ id: submission.id, status: "rejected" });
  }

  const projectId = `${slugify(submission.project_name)}-${submission.id.slice(0, 8)}`;
  const publishedDate = new Date().toISOString().slice(0, 10);
  const sortRow = await env.FABLE_LEGACY_DB.prepare(`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order FROM archive_projects`).first<{
    next_sort_order: number;
  }>();
  const sortOrder = sortRow?.next_sort_order ?? 1;
  const tag = slugify(submission.project_type);
  const imageHint = publicImageHint(submission.project_type, "en");
  const imageHintZh = publicImageHint(submission.project_type, "zh");
  const hasZhTranslation = Boolean(
    submission.project_name_zh?.trim() ||
      submission.author_zh?.trim() ||
      submission.fable_usage_zh?.trim() ||
      submission.description_zh?.trim()
  );

  const statements = [
    env.FABLE_LEGACY_DB.prepare(
      `INSERT INTO archive_projects (
        id, name, author, project_type, usage, summary, source_url, project_url,
        published_date, evidence, image_hint, sort_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'community', ?, ?, 'published')`
    ).bind(
      projectId,
      submission.project_name,
      submission.author,
      submission.project_type,
      submission.fable_usage,
      submission.description,
      submission.proof_url,
      submission.project_url,
      publishedDate,
      imageHint,
      sortOrder
    ),
    env.FABLE_LEGACY_DB.prepare(
      `INSERT INTO archive_project_tags (project_id, tag, sort_order)
       VALUES (?, ?, 1), (?, 'community-submission', 2)`
    ).bind(projectId, tag, projectId)
  ];

  if (hasZhTranslation) {
    statements.push(
      env.FABLE_LEGACY_DB.prepare(
        `INSERT INTO archive_project_translations (
          project_id, locale, name, author, usage, summary, image_hint
        ) VALUES (?, 'zh', ?, ?, ?, ?, ?)`
      ).bind(
        projectId,
        submission.project_name_zh?.trim() || submission.project_name,
        submission.author_zh?.trim() || submission.author,
        submission.fable_usage_zh?.trim() || submission.fable_usage,
        submission.description_zh?.trim() || submission.description,
        imageHintZh
      )
    );
  }

  statements.push(env.FABLE_LEGACY_DB.prepare(`UPDATE submissions SET status = 'approved' WHERE id = ?`).bind(submission.id));

  await env.FABLE_LEGACY_DB.batch(statements);

  return json({ id: submission.id, status: "approved", projectId });
};

export const onRequest: PagesFunction = async () => json({ error: "Method not allowed" }, 405);

function requireAdmin(request: Request, env: Env) {
  if (!env.FABLE_ADMIN_TOKEN) {
    return json({ error: "Admin token is not configured" }, 503);
  }

  const authorization = request.headers.get("Authorization") ?? "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  const token = bearer || request.headers.get("x-admin-token") || "";

  if (token !== env.FABLE_ADMIN_TOKEN) {
    return json({ error: "Unauthorized" }, 401);
  }

  return null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "submission";
}

function publicImageHint(projectType: string, locale: "en" | "zh") {
  const normalizedType = projectType.trim();

  if (locale === "zh") {
    const typeLabels: Record<string, string> = {
      Demo: "演示",
      Game: "游戏",
      Tool: "工具",
      Website: "网站",
      Research: "研究",
      Benchmark: "评测",
      Refactor: "重构",
      Optimization: "优化"
    };
    return `社区${typeLabels[normalizedType] ?? normalizedType}条目`;
  }

  return `Community ${normalizedType.toLowerCase()} artifact`;
}

async function ensureSubmissionsTable(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        project_name TEXT NOT NULL,
        project_url TEXT NOT NULL,
        author TEXT NOT NULL,
        contact TEXT,
        project_type TEXT NOT NULL,
        fable_usage TEXT NOT NULL,
        description TEXT NOT NULL,
        proof_url TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS idx_submissions_status_created
      ON submissions (status, created_at DESC)`
    )
    .run();

  await ensureSubmissionTranslationColumns(db);
}

async function ensureSubmissionTranslationColumns(db: D1Database) {
  const columns = await db.prepare(`PRAGMA table_info(submissions)`).all<{ name: string }>();
  const names = new Set((columns.results ?? []).map((column) => column.name));
  const additions = [
    ["project_name_zh", "TEXT"],
    ["author_zh", "TEXT"],
    ["fable_usage_zh", "TEXT"],
    ["description_zh", "TEXT"]
  ] as const;

  for (const [name, type] of additions) {
    if (!names.has(name)) {
      await db.prepare(`ALTER TABLE submissions ADD COLUMN ${name} ${type}`).run();
    }
  }
}
