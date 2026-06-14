type Env = {
  FABLE_LEGACY_DB?: D1Database;
  FABLE_ADMIN_TOKEN?: string;
};

type BatchSubmissionPayload = {
  id?: string;
  projectName?: string;
  projectUrl?: string;
  sourceUrl?: string;
  author?: string;
  contact?: string;
  projectType?: string;
  fableUsage?: string;
  description?: string;
  proofUrl?: string;
  translations?: {
    zh?: {
      projectName?: string;
      author?: string;
      fableUsage?: string;
      description?: string;
    };
  };
};

type BatchPayload = {
  submissions?: BatchSubmissionPayload[];
};

type NormalizedSubmission = {
  id: string;
  projectName: string;
  projectUrl: string;
  author: string;
  contact: string;
  projectType: string;
  fableUsage: string;
  description: string;
  proofUrl: string;
  projectNameZh: string;
  authorZh: string;
  fableUsageZh: string;
  descriptionZh: string;
};

const requiredFields: Array<keyof BatchSubmissionPayload> = [
  "projectName",
  "author",
  "projectType",
  "fableUsage",
  "description"
];

const maxBatchSize = 100;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = requireAdmin(request, env);
  if (auth) return auth;

  if (!env.FABLE_LEGACY_DB) {
    return json({ error: "Archive database is not configured" }, 503);
  }

  let rawPayload: BatchPayload | BatchSubmissionPayload[];
  try {
    rawPayload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const submissions = Array.isArray(rawPayload) ? rawPayload : rawPayload.submissions;
  if (!Array.isArray(submissions)) {
    return json({ error: "Expected a submissions array" }, 400);
  }

  if (submissions.length === 0) {
    return json({ error: "Submissions array must not be empty" }, 400);
  }

  if (submissions.length > maxBatchSize) {
    return json({ error: `Batch size must be ${maxBatchSize} or fewer`, limit: maxBatchSize }, 413);
  }

  const normalized: NormalizedSubmission[] = [];
  const errors: Array<{ index: number; id?: string; errors: string[] }> = [];
  const seenIds = new Set<string>();

  submissions.forEach((submission, index) => {
    const itemErrors: string[] = [];
    const missing = requiredFields.filter((field) => !String(submission[field] ?? "").trim());
    if (missing.length > 0) {
      itemErrors.push(`Missing required fields: ${missing.join(", ")}`);
    }

    const proofUrl = String(submission.proofUrl || submission.sourceUrl || "").trim();
    const projectUrl = String(submission.projectUrl || proofUrl).trim();
    const id = String(submission.id || crypto.randomUUID()).trim();

    if (!id) {
      itemErrors.push("Missing id");
    } else if (seenIds.has(id)) {
      itemErrors.push("Duplicate id in batch");
    } else {
      seenIds.add(id);
    }

    if (!isUrl(projectUrl)) {
      itemErrors.push("Project URL must be a valid http(s) URL");
    }

    if (!isUrl(proofUrl)) {
      itemErrors.push("Proof URL or sourceUrl must be a valid http(s) URL");
    }

    if (itemErrors.length > 0) {
      errors.push({ index, id: id || undefined, errors: itemErrors });
      return;
    }

    normalized.push({
      id,
      projectName: String(submission.projectName).trim(),
      projectUrl,
      author: String(submission.author).trim(),
      contact: submission.contact?.trim() ?? "",
      projectType: String(submission.projectType).trim(),
      fableUsage: String(submission.fableUsage).trim(),
      description: String(submission.description).trim(),
      proofUrl,
      projectNameZh: submission.translations?.zh?.projectName?.trim() ?? "",
      authorZh: submission.translations?.zh?.author?.trim() ?? "",
      fableUsageZh: submission.translations?.zh?.fableUsage?.trim() ?? "",
      descriptionZh: submission.translations?.zh?.description?.trim() ?? ""
    });
  });

  if (errors.length > 0) {
    return json({ error: "Validation failed", errors }, 400);
  }

  await ensureSubmissionsTable(env.FABLE_LEGACY_DB);

  const existingRows = await env.FABLE_LEGACY_DB.prepare(
    `SELECT id FROM submissions WHERE id IN (${normalized.map(() => "?").join(", ")})`
  )
    .bind(...normalized.map((submission) => submission.id))
    .all<{ id: string }>();
  const existingIds = new Set((existingRows.results ?? []).map((row) => row.id));
  const newSubmissions = normalized.filter((submission) => !existingIds.has(submission.id));

  if (newSubmissions.length > 0) {
    await env.FABLE_LEGACY_DB.batch(
      newSubmissions.map((submission) =>
        env.FABLE_LEGACY_DB!.prepare(
          `INSERT INTO submissions (
            id, project_name, project_url, author, contact, project_type, fable_usage,
            description, proof_url, status, project_name_zh, author_zh, fable_usage_zh,
            description_zh
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`
        ).bind(
          submission.id,
          submission.projectName,
          submission.projectUrl,
          submission.author,
          submission.contact,
          submission.projectType,
          submission.fableUsage,
          submission.description,
          submission.proofUrl,
          submission.projectNameZh,
          submission.authorZh,
          submission.fableUsageZh,
          submission.descriptionZh
        )
      )
    );
  }

  return json(
    {
      status: "ok",
      created: newSubmissions.length,
      skipped: normalized.length - newSubmissions.length,
      submissions: normalized.map((submission) => ({
        id: submission.id,
        projectName: submission.projectName,
        status: existingIds.has(submission.id) ? "skipped" : "created"
      }))
    },
    newSubmissions.length > 0 ? 201 : 200
  );
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

function isUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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
