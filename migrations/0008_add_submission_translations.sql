ALTER TABLE submissions ADD COLUMN project_name_zh TEXT;
ALTER TABLE submissions ADD COLUMN author_zh TEXT;
ALTER TABLE submissions ADD COLUMN fable_usage_zh TEXT;
ALTER TABLE submissions ADD COLUMN description_zh TEXT;

UPDATE submissions SET
  project_name_zh = 'Claude Fable 产品页',
  author_zh = 'Anthropic',
  fable_usage_zh = '官方产品页记录了 Claude Fable 5 的定位、可用性、定价与 benchmark 引用。',
  description_zh = '待审核线索：Anthropic 官方模型页面，可补充现有发布文章与文档来源。'
WHERE id = 'intake-claude-fable-product-page';

UPDATE submissions SET
  project_name_zh = 'Pebble',
  author_zh = 'brian gao / ultrarunnerr',
  fable_usage_zh = '作者称其指导 Claude Fable 5 从零构建原生 macOS Swift + Metal 方块生存游戏。',
  description_zh = '待审核线索：Reddit 与 GitHub 记录了一个约 4.5 万行的 Swift/Metal 体素生存游戏，包含视频、源码和技术细节。发布前需复核媒体与具体说法。'
WHERE id = 'intake-pebble-swift-metal';

UPDATE submissions SET
  project_name_zh = 'World of Claudecraft',
  author_zh = 'ZYZZ JOBS / levy-street',
  fable_usage_zh = 'Claude Fable 5 被用于构建一个开源浏览器 MMORPG 风格游戏。',
  description_zh = '待审核线索：X 帖包含游戏视频、试玩站点、GitHub 源码，以及作者关于 Fable 5 ultracode 使用的回复。需要复核试玩站点。'
WHERE id = 'intake-world-of-claudecraft';

UPDATE submissions SET
  project_name_zh = 'Higgsfield Games',
  author_zh = 'Higgsfield AI',
  fable_usage_zh = 'Higgsfield 称其通过 Claude Fable 5 与 Higgsfield MCP 提供 prompt-to-game 工作流。',
  description_zh = '待审核线索：合作方/产品线程声称支持由 Fable 5 驱动的 2D 与 3D 多人游戏生成。评论区存在“是否真可玩”的质疑，需谨慎核验。'
WHERE id = 'intake-higgsfield-games';

UPDATE submissions SET
  project_name_zh = 'Fable5 Minecraft HTML 测试',
  author_zh = 'Angel / Angais',
  fable_usage_zh = 'Claude Fable 5 max effort 生成了 HTML + Three.js 的类 Minecraft 测试。',
  description_zh = '待审核线索：X 证据与 GitHub 源码描述了一个包含 3D 渲染、游戏逻辑和生成音频的浏览器方块世界测试。'
WHERE id = 'intake-fable5-minecraft-html-test';

UPDATE submissions SET
  project_name_zh = 'DirectX12 实时 CG demo',
  author_zh = 'neguse',
  fable_usage_zh = 'Claude Fable 5 使用 C++、DirectX12、C++ 标准库和少量 Windows API 生成实时 CG demo。',
  description_zh = '待审核线索：日文 X 帖包含截图证据与 GitHub 仓库，是少见的非 Web 图形案例。'
WHERE id = 'intake-dx12-realtime-cg-demo';

UPDATE submissions SET
  project_name_zh = 'Fable5 World Demo',
  author_zh = 'Braffolk',
  fable_usage_zh = 'Claude Fable 5 构建了一个 Three.js 3D 世界，用于测试模型能力。',
  description_zh = '待审核线索：GitHub 仓库明确将 3D world demo 归因于 Claude Fable 5，并提供 CloudFront 在线 demo。'
WHERE id = 'intake-fable5-world-demo';

UPDATE submissions SET
  project_name_zh = '机械引擎平台',
  author_zh = 'The Bugged Dev',
  fable_usage_zh = 'Claude Fable 5 生成了一个使用自定义几何体的 Three.js 机械引擎平台。',
  description_zh = '待审核线索：X 帖声称单 prompt、无预制资产生成 Three.js 机械模型，并附有视频。发布前需检查媒体。'
WHERE id = 'intake-mechanical-engine-platform';

UPDATE submissions SET
  project_name_zh = 'Kerbal 风格火箭游戏',
  author_zh = 'Chris / ChrissGPT',
  fable_usage_zh = 'Claude Fable 5 被用于构建受 Kerbal Space Program 启发的火箭建造与分级分离游戏。',
  description_zh = '待审核线索：X 帖声称三次提示生成、约 6.7 万行代码，并附有玩法视频。需复核代码规模与媒体证据。'
WHERE id = 'intake-kerbal-inspired-rocket-game';

UPDATE submissions SET
  project_name_zh = '梦想星舰游戏 demo',
  author_zh = 'Chris / ChrissGPT',
  fable_usage_zh = 'Claude Fable 5 生成了可探索星舰 demo，包含驾驶舱、船员舱、交互、灯光与浏览器性能修复。',
  description_zh = '待审核线索：X 帖称 Fable 5 会给自己的作品截图并迭代，直到浏览器 demo 达到 60fps；帖子包含视频。'
WHERE id = 'intake-dream-starship-game-demo';

UPDATE submissions SET
  project_name_zh = 'G1 Manipulation 可达性分析',
  author_zh = 'Dimensional',
  fable_usage_zh = 'Claude Fable 5 将 reachability analysis 集成到 G1 人形机器人 manipulation framework。',
  description_zh = '待审核线索：X 帖报告 5D 手臂能力图、自碰撞检查、规划上下文创建从 100ms 降到 62us，以及双臂控制。需技术复核。'
WHERE id = 'intake-g1-manipulation-reachability';

UPDATE submissions SET
  project_name_zh = 'CodePilot v0.56.0 修复',
  author_zh = '歸藏 / guizang.ai',
  fable_usage_zh = 'Claude Fable 5 被用于在 CodePilot 代码库中发现问题并完成部分修复。',
  description_zh = '待审核线索：中文开发者发布帖称 v0.56.0 的部分修复由 Claude Fable 5 完成，并提供 release 链接。'
WHERE id = 'intake-codepilot-v056-fable-fixes';

UPDATE submissions SET
  project_name_zh = 'PlatAtlas FieldOps',
  author_zh = 'ClaudeFarms',
  fable_usage_zh = 'Claude Fable 5 在 Build Day 过程中被用于创建 PlatAtlas FieldOps web app。',
  description_zh = '待审核线索：GitHub 仓库称该应用是在 Claude Fable 5 Build Day 现场构建，并提供 Pages 部署链接。'
WHERE id = 'intake-platatlas-fieldops';

UPDATE submissions SET
  project_name_zh = 'Fable 5 Hunter',
  author_zh = 'dev-bricks',
  fable_usage_zh = '该 watcher 监控 Claude Code 中 Claude Fable 5 是否恢复可用，并发送通知。',
  description_zh = '待审核线索：Fable 5 下线后的生态工具，支持 Telegram、Discord、ntfy 和桌面通知。'
WHERE id = 'intake-fable-5-hunter';

UPDATE submissions SET
  project_name_zh = 'Donate Your Code',
  author_zh = 'GeeveGeorge',
  fable_usage_zh = '用于将 Claude Fable 5 transcript turns 脱敏后捐赠到经过审核的 CC0 数据集。',
  description_zh = '待审核线索：与档案保存高度相关的项目，目标是安全保存稀缺的 Claude Fable 5 交互记录。'
WHERE id = 'intake-donate-your-code';

UPDATE submissions SET
  project_name_zh = 'Fable vs Opus planning benchmark',
  author_zh = 'PedroLaRosa',
  fable_usage_zh = '使用 OpenSpec 对 Claude Fable 5 与 Opus 4.8 在同一功能规划任务上进行受控对比。',
  description_zh = '待审核线索：小型社区 benchmark，对 explore-to-propose 规划流程中的时间、成本、质量和 thoroughness 进行比较。'
WHERE id = 'intake-fable-vs-opus-planning';

UPDATE submissions SET
  project_name_zh = 'Fable 5 内部代码库评审案例',
  author_zh = 'ML6',
  fable_usage_zh = 'ML6 在内部代码库 release review 和问题发现任务中比较了 Fable 5 与 Opus 4.8。',
  description_zh = '待审核线索：二手 benchmark，包含具体成本、token、耗时与 release-blocking issue 发现结果，适合作为企业评测条目。'
WHERE id = 'intake-ml6-internal-codebase-review';
