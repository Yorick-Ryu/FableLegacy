UPDATE archive_projects
SET status = 'pending',
    updated_at = CURRENT_TIMESTAMP
WHERE status = 'approved'
  AND (
    lower(summary) LIKE '%research intake:%'
    OR lower(summary) LIKE '%needs % review%'
    OR summary LIKE '%待审核线索%'
    OR image_hint LIKE '%待审核提交%'
    OR EXISTS (
      SELECT 1
      FROM archive_project_translations
      WHERE archive_project_translations.project_id = archive_projects.id
        AND (
          lower(archive_project_translations.summary) LIKE '%research intake:%'
          OR lower(archive_project_translations.summary) LIKE '%needs % review%'
          OR archive_project_translations.summary LIKE '%待审核线索%'
          OR archive_project_translations.image_hint LIKE '%待审核提交%'
        )
    )
  );
