CREATE TABLE IF NOT EXISTS submissions (
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
);

CREATE INDEX IF NOT EXISTS idx_submissions_status_created
ON submissions (status, created_at DESC);
