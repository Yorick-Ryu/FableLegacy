CREATE TABLE archive_projects_unified (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  project_type TEXT NOT NULL,
  usage TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL,
  project_url TEXT,
  published_date TEXT NOT NULL,
  evidence TEXT NOT NULL,
  image_hint TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  media_url TEXT,
  submitter_contact TEXT
);

INSERT INTO archive_projects_unified (
  id,
  name,
  author,
  project_type,
  usage,
  summary,
  source_url,
  project_url,
  published_date,
  evidence,
  image_hint,
  sort_order,
  status,
  created_at,
  updated_at,
  media_url,
  submitter_contact
)
SELECT
  id,
  name,
  author,
  project_type,
  usage,
  summary,
  source_url,
  project_url,
  published_date,
  evidence,
  image_hint,
  sort_order,
  CASE status
    WHEN 'published' THEN 'approved'
    WHEN 'needs_review' THEN 'pending'
    WHEN 'approved' THEN 'approved'
    WHEN 'rejected' THEN 'rejected'
    ELSE 'pending'
  END,
  created_at,
  updated_at,
  media_url,
  NULL
FROM archive_projects;

INSERT INTO archive_projects_unified (
  id,
  name,
  author,
  project_type,
  usage,
  summary,
  source_url,
  project_url,
  published_date,
  evidence,
  image_hint,
  sort_order,
  status,
  created_at,
  updated_at,
  media_url,
  submitter_contact
)
WITH
  base AS (
    SELECT COALESCE(MAX(sort_order), 0) AS base_sort
    FROM archive_projects_unified
  ),
  queued_submissions AS (
    SELECT
      submissions.*,
      ROW_NUMBER() OVER (ORDER BY submissions.created_at ASC, submissions.id ASC) AS queue_order
    FROM submissions
    WHERE submissions.status IN ('pending', 'rejected')
      AND NOT EXISTS (
        SELECT 1
        FROM archive_projects_unified
        WHERE archive_projects_unified.id = submissions.id
      )
  )
SELECT
  id,
  project_name,
  author,
  project_type,
  fable_usage,
  description,
  proof_url,
  project_url,
  substr(created_at, 1, 10),
  'community',
  'Community ' || lower(project_type) || ' artifact',
  (SELECT base_sort FROM base) + queue_order,
  status,
  created_at,
  CURRENT_TIMESTAMP,
  NULL,
  NULLIF(trim(contact), '')
FROM queued_submissions;

DROP TABLE archive_projects;

ALTER TABLE archive_projects_unified RENAME TO archive_projects;

INSERT OR IGNORE INTO archive_project_translations (
  project_id,
  locale,
  name,
  author,
  usage,
  summary,
  image_hint
)
SELECT
  id,
  'zh',
  COALESCE(NULLIF(trim(project_name_zh), ''), project_name),
  COALESCE(NULLIF(trim(author_zh), ''), author),
  COALESCE(NULLIF(trim(fable_usage_zh), ''), fable_usage),
  COALESCE(NULLIF(trim(description_zh), ''), description),
  CASE project_type
    WHEN 'Demo' THEN '社区演示条目'
    WHEN 'Game' THEN '社区游戏条目'
    WHEN 'Tool' THEN '社区工具条目'
    WHEN 'Website' THEN '社区网站条目'
    WHEN 'Research' THEN '社区研究条目'
    WHEN 'Benchmark' THEN '社区评测条目'
    WHEN 'Refactor' THEN '社区重构条目'
    WHEN 'Optimization' THEN '社区优化条目'
    ELSE '社区档案条目'
  END
FROM submissions
WHERE status IN ('pending', 'rejected')
  AND (
    NULLIF(trim(project_name_zh), '') IS NOT NULL
    OR NULLIF(trim(author_zh), '') IS NOT NULL
    OR NULLIF(trim(fable_usage_zh), '') IS NOT NULL
    OR NULLIF(trim(description_zh), '') IS NOT NULL
  );

INSERT OR IGNORE INTO archive_project_tags (project_id, tag, sort_order)
SELECT id, lower(project_type), 1
FROM submissions
WHERE status IN ('pending', 'rejected');

INSERT OR IGNORE INTO archive_project_tags (project_id, tag, sort_order)
SELECT id, 'community-submission', 2
FROM submissions
WHERE status IN ('pending', 'rejected');

DROP TABLE submissions;

CREATE INDEX IF NOT EXISTS idx_archive_projects_status_sort
ON archive_projects (status, sort_order);

CREATE INDEX IF NOT EXISTS idx_archive_projects_type
ON archive_projects (project_type);
