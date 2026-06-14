UPDATE submissions SET
  project_name_zh = 'Fable 5 与 Opus 4.8 对比帖',
  author_zh = '@DataChaz',
  fable_usage_zh = '这条社交帖以 Claude Fable 5 与 Opus 4.8 的视觉对比为主题。',
  description_zh = 'X 搜索线索：一条对比或 benchmark 风格的帖子。可见内容将 Claude Fable 5 与 Opus 4.8 放在一起比较；需人工复核其中是否包含值得归档的具体作品或证据。'
WHERE id = 'x-2064458812115886489';

UPDATE submissions SET
  project_name_zh = '使用 Claude Fable 5 制作的 Limbo 风格复刻',
  author_zh = '@ChrissGPT',
  fable_usage_zh = '这条社交帖称一个 Limbo 风格复刻游戏是在 ultra-high 设置下由 Claude Fable 5 生成的。',
  description_zh = 'X 搜索线索：一个归因于 Claude Fable 5 ultra-high 设置的 Limbo 风格游戏复刻。发布前需人工复核附带媒体。'
WHERE id = 'x-2065478857960849631';

UPDATE submissions SET
  project_name_zh = '日文 Fable 5 demo 反应帖',
  author_zh = '@paji_a',
  fable_usage_zh = '这条日文帖对 Claude Fable 5 的一次输出作出反应，并包含视频媒体。',
  description_zh = 'X 搜索线索：一条带视频媒体的日文 Fable 5 demo 反应帖。发布前需翻译原帖并复核媒体内容。'
WHERE id = 'x-2064475904454414681';

UPDATE submissions SET
  project_name_zh = '通过 Venice 访问 Claude Fable 5 的指南',
  author_zh = '@AskVenice',
  fable_usage_zh = '这条社交帖描述了通过 Venice 匿名访问 Claude Fable 5 的方式。',
  description_zh = 'X 搜索线索：关于通过 Venice 访问 Claude Fable 5 的访问方式或工具链声明。归档前需进行政策与相关性复核。'
WHERE id = 'x-2065558976805089688';
