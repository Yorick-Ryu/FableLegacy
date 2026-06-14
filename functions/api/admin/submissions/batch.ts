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
    const id = String(submission.id || `${slugify(String(submission.projectName || "archive"))}-${crypto.randomUUID().slice(0, 8)}`).trim();

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

  const existingRows = await env.FABLE_LEGACY_DB.prepare(
    `SELECT id FROM archive_projects WHERE id IN (${normalized.map(() => "?").join(", ")})`
  )
    .bind(...normalized.map((submission) => submission.id))
    .all<{ id: string }>();
  const existingIds = new Set((existingRows.results ?? []).map((row) => row.id));
  const newEntries = normalized.filter((submission) => !existingIds.has(submission.id));

  if (newEntries.length > 0) {
    const publishedDate = new Date().toISOString().slice(0, 10);
    const sortRow = await env.FABLE_LEGACY_DB.prepare(
      `SELECT COALESCE(MAX(sort_order), 0) AS max_sort_order FROM archive_projects`
    ).first<{
      max_sort_order: number;
    }>();
    const baseSortOrder = sortRow?.max_sort_order ?? 0;
    const statements: D1PreparedStatement[] = [];

    newEntries.forEach((submission, index) => {
      const sortOrder = baseSortOrder + index + 1;
      const submitterContact = submission.contact || null;
      statements.push(
        env.FABLE_LEGACY_DB!.prepare(
          `INSERT INTO archive_projects (
            id, name, author, project_type, usage, summary, source_url, project_url,
            published_date, evidence, image_hint, sort_order, status, submitter_contact
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'community', ?, ?, 'pending', ?)`
        ).bind(
          submission.id,
          submission.projectName,
          submission.author,
          submission.projectType,
          submission.fableUsage,
          submission.description,
          submission.proofUrl,
          submission.projectUrl,
          publishedDate,
          publicImageHint(submission.projectType, "en"),
          sortOrder,
          submitterContact
        ),
        env.FABLE_LEGACY_DB!.prepare(
          `INSERT INTO archive_project_tags (project_id, tag, sort_order)
           VALUES (?, ?, 1), (?, 'community-submission', 2)`
        ).bind(submission.id, slugify(submission.projectType), submission.id)
      );

      if (hasZhTranslation(submission)) {
        statements.push(
          env.FABLE_LEGACY_DB!.prepare(
            `INSERT INTO archive_project_translations (
              project_id, locale, name, author, usage, summary, image_hint
            ) VALUES (?, 'zh', ?, ?, ?, ?, ?)`
          ).bind(
            submission.id,
            submission.projectNameZh || submission.projectName,
            submission.authorZh || submission.author,
            submission.fableUsageZh || submission.fableUsage,
            submission.descriptionZh || submission.description,
            publicImageHint(submission.projectType, "zh")
          )
        );
      }
    });

    await env.FABLE_LEGACY_DB.batch(statements);
  }

  return json(
    {
      status: "ok",
      created: newEntries.length,
      skipped: normalized.length - newEntries.length,
      entries: normalized.map((submission) => ({
        id: submission.id,
        projectName: submission.projectName,
        status: existingIds.has(submission.id) ? "skipped" : "created"
      }))
    },
    newEntries.length > 0 ? 201 : 200
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

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "archive";
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

function hasZhTranslation(submission: NormalizedSubmission) {
  return Boolean(
    submission.projectNameZh ||
      submission.authorZh ||
      submission.fableUsageZh ||
      submission.descriptionZh
  );
}
