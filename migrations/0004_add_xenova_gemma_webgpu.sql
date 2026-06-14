INSERT OR REPLACE INTO archive_projects (
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
  status
) VALUES (
  'xenova-gemma-webgpu-kernels',
  'Gemma inference WebGPU kernel optimization',
  'Xenova',
  'Optimization',
  'Fable 5 was asked to write custom WebGPU kernels for Gemma inference and reportedly improved throughput from 84 tok/s to 255 tok/s after hidden development safeguards were rolled back.',
  'A community optimization report from Xenova preserving a concrete performance claim around Fable 5-generated WebGPU kernels for local model inference.',
  'https://x.com/xenovacom/status/2065656427117437213',
  NULL,
  '2026-06-13',
  'community',
  'WebGPU inference kernels and token throughput chart',
  15,
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
  'xenova-gemma-webgpu-kernels',
  'zh',
  'Gemma 推理 WebGPU kernel 优化',
  'Xenova',
  'Fable 5 被要求为 Gemma 推理编写自定义 WebGPU kernels；Xenova 称吞吐从 84 tok/s 提升到 255 tok/s，发生在隐藏开发 safeguards 被回滚之后。',
  '一条来自 Xenova 的社区优化记录，保存了 Fable 5 生成 WebGPU 推理 kernels 的具体性能说法。',
  'WebGPU 推理 kernels 与 token 吞吐图表'
);

INSERT OR REPLACE INTO archive_project_tags (project_id, tag, sort_order) VALUES
('xenova-gemma-webgpu-kernels', 'webgpu', 1),
('xenova-gemma-webgpu-kernels', 'gemma', 2),
('xenova-gemma-webgpu-kernels', 'optimization', 3),
('xenova-gemma-webgpu-kernels', 'inference', 4),
('xenova-gemma-webgpu-kernels', 'community', 5);

INSERT OR REPLACE INTO archive_sources (id, label, url, note, sort_order) VALUES
('xenova-gemma-webgpu-post', 'Xenova WebGPU optimization post', 'https://x.com/xenovacom/status/2065656427117437213', 'Community source for the Gemma WebGPU kernel optimization claim attributed to Fable 5.', 12);

INSERT OR REPLACE INTO archive_source_translations (source_id, locale, label, note) VALUES
('xenova-gemma-webgpu-post', 'zh', 'Xenova WebGPU 优化帖', '关于 Fable 5 生成 Gemma WebGPU kernel 优化的社区来源。');
