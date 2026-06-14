UPDATE archive_projects
SET image_hint = 'Community ' || lower(project_type) || ' artifact',
    updated_at = CURRENT_TIMESTAMP
WHERE status = 'published'
  AND image_hint = project_type || ' submitted to the archive';

UPDATE archive_project_translations
SET image_hint =
  CASE (
    SELECT project_type
    FROM archive_projects
    WHERE archive_projects.id = archive_project_translations.project_id
  )
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
WHERE locale = 'zh'
  AND image_hint = (
    SELECT project_type || ' 待审核提交'
    FROM archive_projects
    WHERE archive_projects.id = archive_project_translations.project_id
  );
