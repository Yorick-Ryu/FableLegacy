CREATE TABLE IF NOT EXISTS archive_projects (
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
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS archive_project_translations (
  project_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  usage TEXT NOT NULL,
  summary TEXT NOT NULL,
  image_hint TEXT NOT NULL,
  PRIMARY KEY (project_id, locale),
  FOREIGN KEY (project_id) REFERENCES archive_projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS archive_project_tags (
  project_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, tag),
  FOREIGN KEY (project_id) REFERENCES archive_projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS archive_timeline_events (
  id TEXT PRIMARY KEY,
  event_date TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS archive_timeline_translations (
  event_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY (event_id, locale),
  FOREIGN KEY (event_id) REFERENCES archive_timeline_events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS archive_sources (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  note TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS archive_source_translations (
  source_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  label TEXT NOT NULL,
  note TEXT NOT NULL,
  PRIMARY KEY (source_id, locale),
  FOREIGN KEY (source_id) REFERENCES archive_sources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_archive_projects_status_sort
ON archive_projects (status, sort_order);

CREATE INDEX IF NOT EXISTS idx_archive_projects_type
ON archive_projects (project_type);

CREATE INDEX IF NOT EXISTS idx_archive_project_tags_project_sort
ON archive_project_tags (project_id, sort_order);
