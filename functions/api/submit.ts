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

  const id = `${slugify(payload.projectName ?? "submission")}-${crypto.randomUUID().slice(0, 8)}`;
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

  const publishedDate = new Date().toISOString().slice(0, 10);
  const sortRow = await env.FABLE_LEGACY_DB.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order FROM archive_projects`
  ).first<{
    next_sort_order: number;
  }>();
  const sortOrder = sortRow?.next_sort_order ?? 1;
  const tag = slugify(values.projectType);
  const imageHint = publicImageHint(values.projectType);
  const submitterContact = values.contact || null;

  await env.FABLE_LEGACY_DB.batch([
    env.FABLE_LEGACY_DB.prepare(
      `INSERT INTO archive_projects (
        id, name, author, project_type, usage, summary, source_url, project_url,
        published_date, evidence, image_hint, sort_order, status, submitter_contact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'community', ?, ?, 'pending', ?)`
    ).bind(
      values.id,
      values.projectName,
      values.author,
      values.projectType,
      values.fableUsage,
      values.description,
      values.proofUrl,
      values.projectUrl,
      publishedDate,
      imageHint,
      sortOrder,
      submitterContact
    ),
    env.FABLE_LEGACY_DB.prepare(
      `INSERT INTO archive_project_tags (project_id, tag, sort_order)
       VALUES (?, ?, 1), (?, 'community-submission', 2)`
    ).bind(values.id, tag, values.id)
  ]);

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

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "submission";
}

function publicImageHint(projectType: string) {
  return `Community ${projectType.trim().toLowerCase()} artifact`;
}
