INSERT OR REPLACE INTO archive_timeline_events (id, event_date, title, body, sort_order) VALUES
('fable-5-launch', '2026-06-09', 'Claude Fable 5 becomes publicly available', 'Anthropic introduced Fable 5 as a widely released Mythos-class Claude model for demanding reasoning and long-horizon agentic work.', 1),
('fable-5-suspended', '2026-06-12', 'Access suspended under a US government directive', 'Anthropic said it had to abruptly disable Fable 5 and Mythos 5 access for customers to comply with an export-control directive.', 2),
('archive-starts', '2026-06-13', 'The archive starts', 'The first public demos, benchmarks, posts, and community builds are gathered here as a living Fable Legacy index.', 3);

INSERT OR REPLACE INTO archive_timeline_translations (event_id, locale, title, body) VALUES
('fable-5-launch', 'zh', 'Claude Fable 5 公开发布', 'Anthropic 将 Fable 5 作为面向高难推理与长程任务的 Mythos 级 Claude 模型开放使用。'),
('fable-5-suspended', 'zh', '访问被暂停', 'Anthropic 表示，为遵守美国政府出口管制指令，必须突然停止客户对 Fable 5 与 Mythos 5 的访问。'),
('archive-starts', 'zh', '档案开始建立', '首批公开演示、评测、帖子与社区作品被整理到这里，成为持续更新的 Fable Legacy 索引。');

INSERT OR REPLACE INTO archive_sources (id, label, url, note, sort_order) VALUES
('anthropic-launch', 'Anthropic launch post', 'https://www.anthropic.com/news/claude-fable-5-mythos-5', 'Primary source for official model background and built-in demo examples.', 1),
('anthropic-suspension', 'Anthropic suspension statement', 'https://www.anthropic.com/news/fable-mythos-access', 'Primary source for the access suspension that turned the project into a legacy archive.', 2),
('claude-api-docs', 'Claude API docs', 'https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5', 'Primary documentation for model naming, intended use, and API availability.', 3),
('claude-social-thread', 'Official Claude social thread', 'https://x.com/claudeai/status/2065456678909227064', 'Official community showcase thread with individual media links gathered as public archive leads.', 4),
('explainx-roundup', 'ExplainX community roundup', 'https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026', 'Secondary roundup of first-wave community projects.', 5),
('pasquale-reactions', 'Pasquale Pillitteri community reaction post', 'https://pasqualepillitteri.it/en/news/4828/claude-fable-5-anthropic-thread-community-reactions', 'Secondary capture of the official thread and community response.', 6),
('aws-launch', 'AWS launch post', 'https://aws.amazon.com/blogs/aws/anthropic-claude-fable-5-on-aws-mythos-class-capabilities-with-built-in-safeguards-now-available/', 'Partner announcement with availability context.', 7),
('endor-benchmark', 'Endor Labs security benchmark', 'https://www.endorlabs.com/learn/claude-fable-5-mythos-grade-hype', 'Independent benchmark with coding and security-task results.', 8),
('coderabbit-review', 'CodeRabbit model review', 'https://www.coderabbit.ai/blog/fable-5-model-review', 'Review mentioning real-time app generation and build behavior.', 9),
('reddit-overhaul', 'Reddit frontend overhaul post', 'https://www.reddit.com/r/ClaudeAI/comments/1u2keuw/fable_5_was_shockingly_tokenefficient_for_a_full/', 'Community submission describing a full frontend overhaul.', 10),
('youtube-higgsfield', 'YouTube Higgsfield motion site', 'https://www.youtube.com/watch?v=N5JeyaqIa7c', 'Creator video claiming a motion website built with Claude Fable 5 and Higgsfield MCP.', 11);

INSERT OR REPLACE INTO archive_source_translations (source_id, locale, label, note) VALUES
('anthropic-launch', 'zh', 'Anthropic 发布文章', 'Fable 5 官方背景与内置演示的一手来源。'),
('anthropic-suspension', 'zh', 'Anthropic 停用声明', '解释访问暂停原因的一手来源，也是这个档案站成立的背景。'),
('claude-api-docs', 'zh', 'Claude API 文档', '模型命名、用途与可用性说明。'),
('claude-social-thread', 'zh', 'Claude 官方社交线程', '官方社区展示线程，收录公开可见的媒体线索。'),
('explainx-roundup', 'zh', 'ExplainX 社区汇总', '首批社区项目的二手汇总。'),
('pasquale-reactions', 'zh', 'Pasquale Pillitteri 社区反应文章', '对官方线程与社区反馈的二手记录。'),
('aws-launch', 'zh', 'AWS 发布文章', '合作方发布的可用性背景。'),
('endor-benchmark', 'zh', 'Endor Labs 安全评测', '包含编码与安全任务表现的独立评测。'),
('coderabbit-review', 'zh', 'CodeRabbit 模型评审', '提到实时应用生成与构建表现的评审文章。'),
('reddit-overhaul', 'zh', 'Reddit 前端重构帖', '社区用户描述完整前端重构的投稿。'),
('youtube-higgsfield', 'zh', 'YouTube Higgsfield 动效网站', '创作者视频，声称使用 Claude Fable 5 与 Higgsfield MCP 制作动效网站。');

INSERT OR REPLACE INTO archive_projects (id, name, author, project_type, usage, summary, source_url, project_url, published_date, evidence, image_hint, needs_confirmation, sort_order, status) VALUES
('solar-system-physics', 'Physics-first solar system simulator', 'Anthropic demo', 'Demo', 'Built by Fable 5 as an autonomous simulation, deriving orbital motion from first principles and using it to predict eclipses.', 'A browser-style scientific simulation used in Anthropic''s launch material to illustrate long-horizon reasoning and implementation.', 'https://www.anthropic.com/news/claude-fable-5-mythos-5', NULL, '2026-06-09', 'primary', 'Orbit traces and eclipse prediction', 0, 1, 'published'),
('factorio-agent', 'Autonomous Factorio factory', 'Anthropic demo', 'Game', 'Fable 5 played Factorio, strategized, and built an automated factory on its own.', 'A game-playing demonstration that positioned Fable 5 as a model capable of sustained planning in dynamic environments.', 'https://www.anthropic.com/news/claude-fable-5-mythos-5', NULL, '2026-06-09', 'primary', 'Factory belts and autonomous build planning', 0, 2, 'published'),
('browser-cad-copilot', 'Browser CAD editor and 3D printable model', 'Anthropic demo', 'Tool', 'Fable 5 created a browser CAD editor, its AI copilot, and a complete 3D-printable model inside it.', 'A nested creation example: a tool made by Fable 5 was then used by Fable 5 to produce a physical-design artifact.', 'https://www.anthropic.com/news/claude-fable-5-mythos-5', NULL, '2026-06-09', 'primary', 'Parametric model in a browser CAD surface', 0, 3, 'published'),
('ruby-codebase-migration', '50M-line Ruby codebase migration', 'Reported in launch coverage', 'Refactor', 'Reported as a large migration completed in roughly one day with Fable 5 assistance.', 'A scale-oriented software engineering case referenced in coverage of Fable 5''s agentic coding capabilities.', 'https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks', NULL, '2026-06-10', 'secondary', 'Large repository migration ledger', 0, 4, 'published'),
('pokemon-firered-vision', 'Pokemon FireRed vision-only run', 'Reported in launch coverage', 'Game', 'Fable 5 reportedly played through Pokemon FireRed using vision input.', 'A vision-and-control game demonstration circulated in press coverage around Fable 5''s release.', 'https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks', NULL, '2026-06-10', 'secondary', 'Retro handheld game input stream', 0, 5, 'published'),
('survey-analysis-tool', 'Advanced survey analysis tool', 'Reported in launch coverage', 'Research', 'Created over a long autonomous work session for academic-style survey analysis.', 'A research tooling case that points toward Fable 5''s use in data exploration, analysis UX, and long-running implementation.', 'https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks', NULL, '2026-06-10', 'secondary', 'Survey dashboard and statistical panels', 0, 6, 'published'),
('procedural-shaders', 'Procedural shader studies', 'Community builders via official thread', 'Demo', 'Community projects built with Fable 5, collected in first-week showcases.', 'Generative visual experiments showing real-time shader composition and code-driven animation.', 'https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026', NULL, '2026-06-13', 'community', 'Procedural material swatches', 0, 7, 'published'),
('fluid-ink-simulation', 'Fluid ink simulations', 'Community builders via official thread', 'Demo', 'A first-wave creative coding artifact reportedly built with Fable 5.', 'Canvas/WebGL-style fluid visuals that fit the early Fable 5 pattern of expressive, interactive frontends.', 'https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026', NULL, '2026-06-13', 'community', 'Ink plumes and simulation controls', 0, 8, 'published'),
('goldfish-app', 'Goldfish app', 'Community builders via official thread', 'Website', 'Mentioned in the first 72-hour community roundup as a Fable 5 build.', 'A whimsical community app preserved as one of the first public artifacts from Fable 5''s brief availability window.', 'https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026', NULL, '2026-06-13', 'community', 'Small interactive creature app', 0, 9, 'published'),
('motion-website-higgsfield', 'Motion website with Higgsfield MCP', 'YouTube creator', 'Website', 'Video title and description claim Claude Fable 5 plus Higgsfield MCP built a motion website with generated media assets.', 'A creator workflow example where Fable 5 orchestrated code and media generation into a motion-heavy website.', 'https://www.youtube.com/watch?v=N5JeyaqIa7c', 'https://www.youtube.com/watch?v=N5JeyaqIa7c', '2026-06-11', 'community', 'Motion landing page and video assets', 0, 10, 'published'),
('real-time-app-review', 'Real-time app build reviewed by CodeRabbit', 'CodeRabbit review', 'Tool', 'Review describes Fable 5 building a real-time application with procedural visuals, phase changes, and a successful production build.', 'A review artifact that is useful for the archive because it includes strengths and remaining engineering gaps.', 'https://www.coderabbit.ai/blog/fable-5-model-review', NULL, '2026-06-09', 'secondary', 'Realtime state loop and canvas effects', 0, 11, 'published'),
('agent-security-league-benchmark', 'Agent Security League benchmark', 'Endor Labs', 'Benchmark', 'Fable 5 was benchmarked on 200 real-world coding tasks, including functional and security solves.', 'A counterweight entry for the archive: not a showcase build, but evidence of how Fable 5 behaved on practical engineering tasks.', 'https://www.endorlabs.com/learn/claude-fable-5-mythos-grade-hype', 'https://www.endorlabs.com/learn/claude-fable-5-mythos-grade-hype', '2026-06-10', 'secondary', 'Benchmark grid and issue traces', 0, 12, 'published'),
('personal-os-overhaul', 'Personal OS frontend overhaul', 'Reddit community post', 'Refactor', 'A user described using Fable 5 for a token-efficient overhaul of a personal webapp OS.', 'A community refactor entry involving daily overview, mail, calendar, tasks, dev projects, news, and knowledge-base surfaces.', 'https://www.reddit.com/r/ClaudeAI/comments/1u2keuw/fable_5_was_shockingly_tokenefficient_for_a_full/', NULL, '2026-06-11', 'community', 'Dense personal dashboard', 0, 13, 'published'),
('soccer-neo-gothic-plane', 'Soccer game, neo-gothic city, and plane model set', 'Instagram community post', 'Demo', 'A social post describes a set of projects built with Claude Fable 5, including a soccer game, neo-gothic city, and plane model.', 'A social media bundle entry preserved because it names multiple visual projects.', 'https://www.instagram.com/p/DZfmFqJIK8Y/', NULL, '2026-06-13', 'community', 'Three-item social media showcase', 0, 14, 'published');

INSERT OR REPLACE INTO archive_project_translations (project_id, locale, name, author, usage, summary, image_hint) VALUES
('solar-system-physics', 'zh', '物理优先的太阳系模拟器', 'Anthropic 演示', 'Fable 5 自主构建模拟，从第一性原理推导轨道运动，并用它预测日食。', 'Anthropic 发布材料中的科学模拟案例，用来展示长程推理与实现能力。', '轨道轨迹与日食预测'),
('factorio-agent', 'zh', '自主 Factorio 工厂', 'Anthropic 演示', 'Fable 5 自主游玩 Factorio，制定策略并搭建自动化工厂。', '一个游戏任务演示，展示 Fable 5 在动态环境中持续规划的能力。', '传送带与自动化建造计划'),
('browser-cad-copilot', 'zh', '浏览器 CAD 编辑器与 3D 打印模型', 'Anthropic 演示', 'Fable 5 创建了浏览器 CAD 编辑器、其中的 AI 助手，并在里面完成一个可 3D 打印模型。', '一个嵌套式创作案例：Fable 5 先做工具，再用工具产出实体设计。', '浏览器 CAD 界面中的参数化模型'),
('ruby-codebase-migration', 'zh', '五千万行 Ruby 代码库迁移', '发布报道引用', '报道称该大规模迁移在 Fable 5 辅助下约一天完成。', '一个偏工程规模的案例，被用于说明 Fable 5 的代理式编码能力。', '大型仓库迁移记录'),
('pokemon-firered-vision', 'zh', 'Pokemon FireRed 视觉通关', '发布报道引用', '报道称 Fable 5 仅依靠视觉输入游玩 Pokemon FireRed。', '围绕 Fable 5 发布传播的视觉与控制类游戏演示。', '复古游戏画面输入流'),
('survey-analysis-tool', 'zh', '高级问卷分析工具', '发布报道引用', '在一次长时间自主工作中，为学术式问卷分析创建工具。', '一个研究工具案例，指向 Fable 5 在数据探索、分析界面与长程实现上的用途。', '问卷数据面板与统计模块'),
('procedural-shaders', 'zh', '程序化着色器研究', '官方线程中的社区创作者', '首批展示中被收录的 Fable 5 社区项目。', '展示实时着色器组合与代码驱动动画的生成式视觉实验。', '程序化材质样本'),
('fluid-ink-simulation', 'zh', '流体墨迹模拟', '官方线程中的社区创作者', '首批创意编程作品之一，据称由 Fable 5 制作。', 'Canvas/WebGL 风格的流体视觉，代表早期 Fable 5 作品中富表现力的交互前端。', '墨迹扩散与模拟控制'),
('goldfish-app', 'zh', 'Goldfish 应用', '官方线程中的社区创作者', '在首个 72 小时社区汇总中被提到的 Fable 5 作品。', '一个轻巧的社区应用，作为 Fable 5 短暂开放窗口里的早期公开遗产保存。', '小型互动应用'),
('motion-website-higgsfield', 'zh', '结合 Higgsfield MCP 的动效网站', 'YouTube 创作者', '视频标题和描述称使用 Claude Fable 5 与 Higgsfield MCP 制作带生成媒体素材的动效网站。', '一个创作者流程案例，Fable 5 将代码与媒体生成编排成动效丰富的网站。', '动效落地页与视频素材'),
('real-time-app-review', 'zh', 'CodeRabbit 评审的实时应用', 'CodeRabbit 评审', '评审描述 Fable 5 构建了含程序化视觉、阶段变化与成功生产构建的实时应用。', '一个有保存价值的评审条目，因为它同时记录了优势与仍需改进的工程细节。', '实时状态循环与画布效果'),
('agent-security-league-benchmark', 'zh', 'Agent Security League 评测', 'Endor Labs', 'Fable 5 在 200 个真实编码任务中接受评测，包括功能与安全修复。', '档案中的平衡条目：不是展示作品，而是 Fable 5 在实际工程任务中的表现证据。', '评测网格与问题轨迹'),
('personal-os-overhaul', 'zh', '个人 OS 前端重构', 'Reddit 社区帖', '用户描述使用 Fable 5 高效完成个人 webapp OS 的前端整体改造。', '一个社区重构条目，涉及每日概览、邮件、日历、任务、开发项目、新闻与知识库界面。', '高密度个人仪表盘'),
('soccer-neo-gothic-plane', 'zh', '足球游戏、哥特城市与飞机模型合集', 'Instagram 社区帖', '社交帖子描述了一组使用 Claude Fable 5 制作的项目，包括足球游戏、哥特城市和飞机模型。', '一个等待直接媒体复核的合集线索；它命名了多个视觉项目，适合作为后续收录目标。', '三件套社交展示');

INSERT OR REPLACE INTO archive_project_tags (project_id, tag, sort_order) VALUES
('solar-system-physics', 'simulation', 1), ('solar-system-physics', 'physics', 2), ('solar-system-physics', 'official-demo', 3),
('factorio-agent', 'game', 1), ('factorio-agent', 'agent', 2), ('factorio-agent', 'planning', 3),
('browser-cad-copilot', 'cad', 1), ('browser-cad-copilot', '3d-printing', 2), ('browser-cad-copilot', 'copilot', 3),
('ruby-codebase-migration', 'migration', 1), ('ruby-codebase-migration', 'ruby', 2), ('ruby-codebase-migration', 'enterprise', 3),
('pokemon-firered-vision', 'game', 1), ('pokemon-firered-vision', 'vision', 2), ('pokemon-firered-vision', 'agent', 3),
('survey-analysis-tool', 'research', 1), ('survey-analysis-tool', 'analytics', 2), ('survey-analysis-tool', 'long-horizon', 3),
('procedural-shaders', 'shader', 1), ('procedural-shaders', 'creative-coding', 2), ('procedural-shaders', 'community', 3),
('fluid-ink-simulation', 'fluid', 1), ('fluid-ink-simulation', 'canvas', 2), ('fluid-ink-simulation', 'creative-coding', 3),
('goldfish-app', 'app', 1), ('goldfish-app', 'community', 2), ('goldfish-app', 'interactive', 3),
('motion-website-higgsfield', 'website', 1), ('motion-website-higgsfield', 'motion', 2), ('motion-website-higgsfield', 'media-generation', 3),
('real-time-app-review', 'real-time', 1), ('real-time-app-review', 'review', 2), ('real-time-app-review', 'production-build', 3),
('agent-security-league-benchmark', 'benchmark', 1), ('agent-security-league-benchmark', 'security', 2), ('agent-security-league-benchmark', 'coding', 3),
('personal-os-overhaul', 'frontend', 1), ('personal-os-overhaul', 'refactor', 2), ('personal-os-overhaul', 'personal-tools', 3),
('soccer-neo-gothic-plane', 'game', 1), ('soccer-neo-gothic-plane', '3d', 2), ('soccer-neo-gothic-plane', 'social-post', 3);
