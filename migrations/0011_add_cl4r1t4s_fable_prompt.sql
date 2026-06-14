INSERT OR REPLACE INTO archive_projects (
  id,
  name,
  author,
  project_type,
  usage,
  summary,
  source_url,
  project_url,
  media_url,
  published_date,
  evidence,
  image_hint,
  sort_order,
  status
) VALUES (
  'cl4r1t4s-fable-5-system-prompt',
  'Claude Fable 5 system prompt preservation',
  'fibbo via elder-plinius/CL4R1T4S',
  'Research',
  'A community-preserved Markdown document records what it presents as the Claude Fable 5 system prompt, including product context, refusal behavior, formatting norms, wellbeing guidance, memory notes, artifact storage instructions, and MCP app suggestions.',
  'A prompt-archive artifact that helps preserve the behavioral and product framing surrounding Fable 5 during its brief public window. The source is treated as community evidence rather than an official Anthropic prompt release.',
  'https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md',
  'https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md',
  NULL,
  '2026-06-09',
  'community',
  'Markdown system prompt archive with behavior policy sections',
  16,
  'approved'
);

INSERT OR REPLACE INTO archive_project_translations (
  project_id,
  locale,
  name,
  author,
  usage,
  summary,
  image_hint
) VALUES (
  'cl4r1t4s-fable-5-system-prompt',
  'zh',
  'Claude Fable 5 系统提示词存档',
  'fibbo，经 elder-plinius/CL4R1T4S 保存',
  '一份社区保存的 Markdown 文档记录了其所呈现的 Claude Fable 5 系统提示词，内容包括产品背景、拒绝策略、格式风格、用户健康、记忆说明、Artifacts 持久存储以及 MCP app 建议等部分。',
  '这是提示词档案类遗产材料，有助于保存 Fable 5 短暂公开期间围绕模型行为与产品设定的文本痕迹。该来源按社区证据处理，而非 Anthropic 官方发布的提示词。',
  '带有行为策略章节的 Markdown 系统提示词存档'
);

INSERT OR REPLACE INTO archive_project_tags (project_id, tag, sort_order) VALUES
('cl4r1t4s-fable-5-system-prompt', 'system-prompt', 1),
('cl4r1t4s-fable-5-system-prompt', 'prompt-archive', 2),
('cl4r1t4s-fable-5-system-prompt', 'cl4r1t4s', 3),
('cl4r1t4s-fable-5-system-prompt', 'research', 4),
('cl4r1t4s-fable-5-system-prompt', 'community', 5);

INSERT OR REPLACE INTO archive_sources (id, label, url, note, sort_order) VALUES
('cl4r1t4s-fable-5-prompt', 'CL4R1T4S Claude Fable 5 system prompt', 'https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md', 'Community GitHub document preserving a claimed Claude Fable 5 system prompt; created as FABLE-5.md on 2026-06-09 and later renamed.', 13);

INSERT OR REPLACE INTO archive_source_translations (source_id, locale, label, note) VALUES
('cl4r1t4s-fable-5-prompt', 'zh', 'CL4R1T4S Claude Fable 5 系统提示词', '社区 GitHub 文档，保存一份声称为 Claude Fable 5 系统提示词的材料；2026-06-09 以 FABLE-5.md 创建，随后重命名。');
