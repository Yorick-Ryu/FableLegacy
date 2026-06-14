type Env = {
  FABLE_LEGACY_DB?: D1Database;
  FABLE_ADMIN_TOKEN?: string;
};

type ReviewRow = {
  id: string;
  project_name: string;
  project_url: string;
  author: string;
  contact: null;
  project_type: string;
  fable_usage: string;
  description: string;
  proof_url: string;
  status: "pending" | "approved" | "rejected";
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

const reviewStatuses = new Set(["pending", "approved", "rejected"]);

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = requireAdmin(request, env);
  if (auth) return auth;

  if (!env.FABLE_LEGACY_DB) {
    return json({ error: "Archive database is not configured" }, 503);
  }

  const status = new URL(request.url).searchParams.get("status") || "pending";
  if (!reviewStatuses.has(status)) {
    return json({ error: "Invalid status" }, 400);
  }

  const rows = await env.FABLE_LEGACY_DB.prepare(
    `SELECT
       archive_projects.id,
       archive_projects.name AS project_name,
       COALESCE(archive_projects.project_url, archive_projects.source_url) AS project_url,
       archive_projects.author,
       NULL AS contact,
       archive_projects.project_type,
       archive_projects.usage AS fable_usage,
       archive_projects.summary AS description,
       archive_projects.source_url AS proof_url,
       archive_projects.status,
       archive_projects.created_at,
       zh.name AS project_name_zh,
       zh.author AS author_zh,
       zh.usage AS fable_usage_zh,
       zh.summary AS description_zh
     FROM archive_projects
     LEFT JOIN archive_project_translations zh
       ON zh.project_id = archive_projects.id
      AND zh.locale = 'zh'
     WHERE archive_projects.status = ?
     ORDER BY archive_projects.created_at DESC, archive_projects.sort_order DESC`
  )
    .bind(status)
    .all<ReviewRow>();

  return json({ submissions: rows.results ?? [] });
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
    return json({ error: "Archive entry id and action are required" }, 400);
  }

  const entry = await env.FABLE_LEGACY_DB.prepare(`SELECT id, status FROM archive_projects WHERE id = ?`)
    .bind(payload.id)
    .first<{ id: string; status: string }>();

  if (!entry) {
    return json({ error: "Archive entry not found" }, 404);
  }

  if (entry.status !== "pending") {
    return json({ error: "Archive entry has already been reviewed" }, 409);
  }

  const nextStatus = payload.action === "approve" ? "approved" : "rejected";
  const publishedDate = new Date().toISOString().slice(0, 10);

  await env.FABLE_LEGACY_DB.prepare(
    `UPDATE archive_projects
     SET status = ?,
         published_date = CASE WHEN ? = 'approved' THEN ? ELSE published_date END,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(nextStatus, nextStatus, publishedDate, entry.id)
    .run();

  return json({ id: entry.id, status: nextStatus, projectId: entry.id });
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
