type Env = {
  FABLE_LEGACY_DB?: D1Database;
};

type SubmissionPayload = {
  projectName?: string;
  projectUrl?: string;
  author?: string;
  contact?: string;
  projectType?: string;
  fableUsage?: string;
  description?: string;
  proofUrl?: string;
};

const requiredFields: Array<keyof SubmissionPayload> = [
  "projectName",
  "projectUrl",
  "author",
  "projectType",
  "fableUsage",
  "description",
  "proofUrl"
];

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: SubmissionPayload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const missing = requiredFields.filter((field) => !String(payload[field] ?? "").trim());
  if (missing.length > 0) {
    return json({ error: "Missing required fields", fields: missing }, 400);
  }

  if (!isUrl(payload.projectUrl) || !isUrl(payload.proofUrl)) {
    return json({ error: "Project URL and proof URL must be valid URLs" }, 400);
  }

  const id = crypto.randomUUID();
  const values = {
    id,
    projectName: payload.projectName!.trim(),
    projectUrl: payload.projectUrl!.trim(),
    author: payload.author!.trim(),
    contact: payload.contact?.trim() ?? "",
    projectType: payload.projectType!.trim(),
    fableUsage: payload.fableUsage!.trim(),
    description: payload.description!.trim(),
    proofUrl: payload.proofUrl!.trim()
  };

  if (!env.FABLE_LEGACY_DB) {
    return json({ id, status: "accepted-without-db" }, 202);
  }

  await ensureSubmissionsTable(env.FABLE_LEGACY_DB);

  await env.FABLE_LEGACY_DB.prepare(
    `INSERT INTO submissions (
      id, project_name, project_url, author, contact, project_type, fable_usage, description, proof_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      values.id,
      values.projectName,
      values.projectUrl,
      values.author,
      values.contact,
      values.projectType,
      values.fableUsage,
      values.description,
      values.proofUrl
    )
    .run();

  return json({ id, status: "pending" }, 201);
};

export const onRequest: PagesFunction = async () => json({ error: "Method not allowed" }, 405);

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
}
