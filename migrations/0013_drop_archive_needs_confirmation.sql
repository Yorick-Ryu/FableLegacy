CREATE TABLE archive_projects_next (
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
  media_url TEXT
);

INSERT INTO archive_projects_next (
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
  media_url
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
  status,
  created_at,
  updated_at,
  media_url
FROM archive_projects;

DROP TABLE archive_projects;

ALTER TABLE archive_projects_next RENAME TO archive_projects;

CREATE INDEX IF NOT EXISTS idx_archive_projects_status_sort
ON archive_projects (status, sort_order);

CREATE INDEX IF NOT EXISTS idx_archive_projects_type
ON archive_projects (project_type);
