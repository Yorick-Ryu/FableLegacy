import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Archive,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  Filter,
  Inbox,
  Link2,
  Search,
  Send,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import heroImage from "./assets/archive-hero.png";
import { projects, sources, timeline, typeLabels, type LegacyProject } from "./data/projects";
import "./styles.css";

type SubmitState = "idle" | "submitting" | "sent" | "error";
type Lang = "en" | "zh";

const copy = {
  en: {
    nav: { archive: "Archive", submit: "Submit", sources: "Sources" },
    aria: {
      primary: "Primary",
      archiveStatus: "Archive status",
      timeline: "Fable 5 timeline",
      filters: "Project type filters"
    },
    hero: {
      opened: "Archive opened",
      date: "June 13, 2026",
      lede: "A living index of projects, demos, refactors, reviews, and public artifacts from the brief Claude Fable 5 era.",
      browse: "Browse the archive",
      submit: "Submit a project",
      entries: "seed entries",
      primary: "primary sources",
      review: "need review"
    },
    archive: {
      eyebrow: "The Index",
      title: "Browse the surviving traces",
      body: "Entries are labeled by evidence level. Official demos, press references, social posts, and community claims are useful, but they are not equally proven.",
      search: "Search projects, authors, tags...",
      empty: "No entries match this filter yet."
    },
    submit: {
      eyebrow: "Community Intake",
      title: "Submit a Fable 5 artifact",
      body: "Add a project, a refactor, a preserved demo, or a source link. Submissions are queued for review before they become part of the public archive.",
      note: "Please include a public source whenever possible so the archive can preserve the trail, not just the claim.",
      fields: {
        projectName: "Project name",
        projectUrl: "Project URL",
        author: "Author or team",
        contact: "Contact, optional",
        projectType: "Project type",
        selectType: "Select type",
        usage: "Fable 5 usage",
        description: "Project description",
        proof: "Proof/source link"
      },
      placeholders: {
        projectName: "Solar system simulator",
        author: "Builder name, team, or handle",
        contact: "Email, X handle, personal site...",
        usage: "Made with, refactored by, optimized by, or reviewed with Fable 5...",
        description: "What should the archive preserve about this project?",
        proof: "Tweet, repo, video, blog post, screenshot page..."
      },
      button: {
        idle: "Submit artifact",
        submitting: "Submitting...",
        sent: "Saved for review"
      },
      sent: "Received. The artifact has been saved for review.",
      error: "Something went wrong. Please try again."
    },
    sources: {
      eyebrow: "Research Log",
      title: "Sources used for the seed archive"
    },
    detail: {
      manual: "Needs manual confirmation",
      author: "Author",
      type: "Type",
      date: "Date",
      usage: "Fable 5 usage",
      source: "Source",
      project: "Project"
    },
    footer: "Back to top",
    lang: "中文"
  },
  zh: {
    nav: { archive: "档案", submit: "提交", sources: "来源" },
    aria: {
      primary: "主导航",
      archiveStatus: "档案状态",
      timeline: "Fable 5 时间线",
      filters: "项目类型筛选"
    },
    hero: {
      opened: "档案开启",
      date: "2026 年 6 月 13 日",
      lede: "一个持续更新的索引，收录 Claude Fable 5 短暂时代里留下的项目、演示、重构、评测与公开痕迹。",
      browse: "浏览档案",
      submit: "提交项目",
      entries: "种子条目",
      primary: "一手来源",
      review: "待核验"
    },
    archive: {
      eyebrow: "索引",
      title: "浏览留下来的痕迹",
      body: "每个条目都会标注证据等级。官方演示、媒体引用、社交发布与社区线索都值得保存，但它们的可信度并不相同。",
      search: "搜索项目、作者、标签...",
      empty: "没有符合当前筛选的条目。"
    },
    submit: {
      eyebrow: "社区收录",
      title: "提交一个 Fable 5 遗产项目",
      body: "可以提交项目、重构案例、保存下来的演示，或任何可核验的来源链接。条目会先进入审核队列，再加入公开档案。",
      note: "请尽量附上公开来源，让档案保存的不只是说法，还有可追溯的线索。",
      fields: {
        projectName: "项目名称",
        projectUrl: "项目链接",
        author: "作者/团队",
        contact: "联系方式，可选",
        projectType: "项目类型",
        selectType: "选择类型",
        usage: "Fable 5 使用方式",
        description: "项目说明",
        proof: "证明/来源链接"
      },
      placeholders: {
        projectName: "太阳系模拟器",
        author: "作者、团队或账号",
        contact: "邮箱、X 账号、个人网站...",
        usage: "由 Fable 5 制作、重构、优化或评审...",
        description: "这个项目有什么值得被档案保存？",
        proof: "推文、仓库、视频、博客、截图页面..."
      },
      button: {
        idle: "提交条目",
        submitting: "提交中...",
        sent: "已保存待审核"
      },
      sent: "已收到。这个条目已保存，等待审核。",
      error: "提交失败，请稍后再试。"
    },
    sources: {
      eyebrow: "研究记录",
      title: "种子档案使用的来源"
    },
    detail: {
      manual: "需要人工确认",
      author: "作者",
      type: "类型",
      date: "日期",
      usage: "Fable 5 使用方式",
      source: "来源",
      project: "项目"
    },
    footer: "回到顶部",
    lang: "EN"
  }
} as const;

const evidenceLabel: Record<Lang, Record<LegacyProject["evidence"], string>> = {
  en: {
    primary: "Primary",
    secondary: "Secondary",
    community: "Community",
    "needs-review": "Needs review"
  },
  zh: {
    primary: "一手来源",
    secondary: "二手来源",
    community: "社区线索",
    "needs-review": "待核验"
  }
};

const typeLabel: Record<Lang, Record<(typeof typeLabels)[number], string>> = {
  en: {
    All: "All",
    Demo: "Demo",
    Game: "Game",
    Tool: "Tool",
    Website: "Website",
    Research: "Research",
    Benchmark: "Benchmark",
    Refactor: "Refactor"
  },
  zh: {
    All: "全部",
    Demo: "演示",
    Game: "游戏",
    Tool: "工具",
    Website: "网站",
    Research: "研究",
    Benchmark: "评测",
    Refactor: "重构"
  }
};

const timelineZh = [
  {
    title: "Claude Fable 5 公开发布",
    body: "Anthropic 将 Fable 5 作为面向高难推理与长程任务的 Mythos 级 Claude 模型开放使用。"
  },
  {
    title: "访问被暂停",
    body: "Anthropic 表示，为遵守美国政府出口管制指令，必须突然停止客户对 Fable 5 与 Mythos 5 的访问。"
  },
  {
    title: "档案开始建立",
    body: "首批公开演示、评测、帖子与社区作品被整理到这里，成为持续更新的 Fable Legacy 索引。"
  }
];

const sourceZh = [
  ["Anthropic 发布文章", "Fable 5 官方背景与内置演示的一手来源。"],
  ["Anthropic 停用声明", "解释访问暂停原因的一手来源，也是这个档案站成立的背景。"],
  ["Claude API 文档", "模型命名、用途与可用性说明。"],
  ["Claude 官方社交线程", "官方社区展示线程；部分媒体内容仍需要人工复核。"],
  ["ExplainX 社区汇总", "首批社区项目的二手汇总。"],
  ["Pasquale Pillitteri 社区反应文章", "对官方线程与社区反馈的二手记录。"],
  ["AWS 发布文章", "合作方发布的可用性背景。"],
  ["Endor Labs 安全评测", "包含编码与安全任务表现的独立评测。"],
  ["CodeRabbit 模型评审", "提到实时应用生成与构建表现的评审文章。"],
  ["Reddit 前端重构帖", "社区用户描述完整前端重构的投稿。"],
  ["YouTube Higgsfield 动效网站", "创作者视频，声称使用 Claude Fable 5 与 Higgsfield MCP 制作动效网站。"]
];

const projectZh: Record<string, Partial<Pick<LegacyProject, "name" | "author" | "usage" | "summary" | "imageHint">>> = {
  "solar-system-physics": {
    name: "物理优先的太阳系模拟器",
    author: "Anthropic 演示",
    usage: "Fable 5 自主构建模拟，从第一性原理推导轨道运动，并用它预测日食。",
    summary: "Anthropic 发布材料中的科学模拟案例，用来展示长程推理与实现能力。",
    imageHint: "轨道轨迹与日食预测"
  },
  "factorio-agent": {
    name: "自主 Factorio 工厂",
    author: "Anthropic 演示",
    usage: "Fable 5 自主游玩 Factorio，制定策略并搭建自动化工厂。",
    summary: "一个游戏任务演示，展示 Fable 5 在动态环境中持续规划的能力。",
    imageHint: "传送带与自动化建造计划"
  },
  "browser-cad-copilot": {
    name: "浏览器 CAD 编辑器与 3D 打印模型",
    author: "Anthropic 演示",
    usage: "Fable 5 创建了浏览器 CAD 编辑器、其中的 AI 助手，并在里面完成一个可 3D 打印模型。",
    summary: "一个嵌套式创作案例：Fable 5 先做工具，再用工具产出实体设计。",
    imageHint: "浏览器 CAD 界面中的参数化模型"
  },
  "ruby-codebase-migration": {
    name: "五千万行 Ruby 代码库迁移",
    author: "发布报道引用",
    usage: "报道称该大规模迁移在 Fable 5 辅助下约一天完成。",
    summary: "一个偏工程规模的案例，被用于说明 Fable 5 的代理式编码能力。",
    imageHint: "大型仓库迁移记录"
  },
  "pokemon-firered-vision": {
    name: "Pokemon FireRed 视觉通关",
    author: "发布报道引用",
    usage: "报道称 Fable 5 仅依靠视觉输入游玩 Pokemon FireRed。",
    summary: "围绕 Fable 5 发布传播的视觉与控制类游戏演示。",
    imageHint: "复古游戏画面输入流"
  },
  "survey-analysis-tool": {
    name: "高级问卷分析工具",
    author: "发布报道引用",
    usage: "在一次长时间自主工作中，为学术式问卷分析创建工具。",
    summary: "一个研究工具案例，指向 Fable 5 在数据探索、分析界面与长程实现上的用途。",
    imageHint: "问卷数据面板与统计模块"
  },
  "procedural-shaders": {
    name: "程序化着色器研究",
    author: "官方线程中的社区创作者",
    usage: "首批展示中被收录的 Fable 5 社区项目。",
    summary: "展示实时着色器组合与代码驱动动画的生成式视觉实验。",
    imageHint: "程序化材质样本"
  },
  "fluid-ink-simulation": {
    name: "流体墨迹模拟",
    author: "官方线程中的社区创作者",
    usage: "首批创意编程作品之一，据称由 Fable 5 制作。",
    summary: "Canvas/WebGL 风格的流体视觉，代表早期 Fable 5 作品中富表现力的交互前端。",
    imageHint: "墨迹扩散与模拟控制"
  },
  "goldfish-app": {
    name: "Goldfish 应用",
    author: "官方线程中的社区创作者",
    usage: "在首个 72 小时社区汇总中被提到的 Fable 5 作品。",
    summary: "一个轻巧的社区应用，作为 Fable 5 短暂开放窗口里的早期公开遗产保存。",
    imageHint: "小型互动应用"
  },
  "motion-website-higgsfield": {
    name: "结合 Higgsfield MCP 的动效网站",
    author: "YouTube 创作者",
    usage: "视频标题和描述称使用 Claude Fable 5 与 Higgsfield MCP 制作带生成媒体素材的动效网站。",
    summary: "一个创作者流程案例，Fable 5 将代码与媒体生成编排成动效丰富的网站。",
    imageHint: "动效落地页与视频素材"
  },
  "real-time-app-review": {
    name: "CodeRabbit 评审的实时应用",
    author: "CodeRabbit 评审",
    usage: "评审描述 Fable 5 构建了含程序化视觉、阶段变化与成功生产构建的实时应用。",
    summary: "一个有保存价值的评审条目，因为它同时记录了优势与仍需改进的工程细节。",
    imageHint: "实时状态循环与画布效果"
  },
  "agent-security-league-benchmark": {
    name: "Agent Security League 评测",
    author: "Endor Labs",
    usage: "Fable 5 在 200 个真实编码任务中接受评测，包括功能与安全修复。",
    summary: "档案中的平衡条目：不是展示作品，而是 Fable 5 在实际工程任务中的表现证据。",
    imageHint: "评测网格与问题轨迹"
  },
  "personal-os-overhaul": {
    name: "个人 OS 前端重构",
    author: "Reddit 社区帖",
    usage: "用户描述使用 Fable 5 高效完成个人 webapp OS 的前端整体改造。",
    summary: "一个社区重构条目，涉及每日概览、邮件、日历、任务、开发项目、新闻与知识库界面。",
    imageHint: "高密度个人仪表盘"
  },
  "soccer-neo-gothic-plane": {
    name: "足球游戏、哥特城市与飞机模型合集",
    author: "Instagram 社区帖",
    usage: "社交帖子描述了一组使用 Claude Fable 5 制作的项目，包括足球游戏、哥特城市和飞机模型。",
    summary: "一个等待直接媒体复核的合集线索；它命名了多个视觉项目，适合作为后续收录目标。",
    imageHint: "三件套社交展示"
  }
};

function initialLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function localizedProject(project: LegacyProject, lang: Lang) {
  return lang === "zh" ? { ...project, ...projectZh[project.id] } : project;
}

function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<(typeof typeLabels)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<LegacyProject | null>(projects[0]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "Fable Legacy｜Fable 遗产档案" : "Fable Legacy";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      lang === "zh"
        ? "Fable Legacy 收录 Claude Fable 5 时代留下的项目、演示、重构、评测与公开痕迹。"
        : "Fable Legacy collects projects, demos, migrations, and public artifacts made with or improved by Claude Fable 5."
    );
  }, [lang]);

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const localized = localizedProject(project, lang);
      const matchesType = selectedType === "All" || project.type === selectedType;
      const haystack = [
        localized.name,
        localized.author,
        project.type,
        localized.usage,
        localized.summary,
        project.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      return matchesType && (!normalized || haystack.includes(normalized));
    });
  }, [lang, query, selectedType]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setSubmitState("submitting");
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setSubmitState("sent");
    } catch {
      const localQueue = JSON.parse(localStorage.getItem("fable-legacy-submissions") ?? "[]");
      localQueue.push({ ...payload, createdAt: new Date().toISOString(), status: "local-draft" });
      localStorage.setItem("fable-legacy-submissions", JSON.stringify(localQueue));
      form.reset();
      setSubmitState("sent");
    }
  }

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <img className="hero-media" src={heroImage} alt="" />
        <div className="hero-shade" />
        <nav className="topbar" aria-label={t.aria.primary}>
          <a className="brand" href="#top" id="top">
            <Archive size={18} />
            Fable Legacy
          </a>
          <div className="navlinks">
            <a href="#archive">{t.nav.archive}</a>
            <a href="#submit">{t.nav.submit}</a>
            <a href="#sources">{t.nav.sources}</a>
            <button className="lang-toggle" type="button" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
              {t.lang}
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <p className="kicker">
            <span>{t.hero.opened}</span>
            <span>{t.hero.date}</span>
          </p>
          <h1 id="page-title">Fable Legacy</h1>
          <p className="lede">{t.hero.lede}</p>
          <div className="hero-actions">
            <a className="button primary" href="#archive">
              <Database size={18} />
              {t.hero.browse}
            </a>
            <a className="button ghost" href="#submit">
              <Inbox size={18} />
              {t.hero.submit}
            </a>
          </div>
        </div>

        <aside className="hero-panel" aria-label={t.aria.archiveStatus}>
          <div>
            <strong>{projects.length}</strong>
            <span>{t.hero.entries}</span>
          </div>
          <div>
            <strong>{projects.filter((project) => project.evidence === "primary").length}</strong>
            <span>{t.hero.primary}</span>
          </div>
          <div>
            <strong>{projects.filter((project) => project.needsConfirmation).length}</strong>
            <span>{t.hero.review}</span>
          </div>
        </aside>
      </section>

      <section className="timeline" aria-label={t.aria.timeline}>
        {timeline.map((item, index) => (
          <article key={item.date}>
            <time dateTime={item.date}>{item.date}</time>
            <h2>{lang === "zh" ? timelineZh[index].title : item.title}</h2>
            <p>{lang === "zh" ? timelineZh[index].body : item.body}</p>
          </article>
        ))}
      </section>

      <section className="archive-section" id="archive">
        <div className="section-heading">
          <p className="eyebrow">{t.archive.eyebrow}</p>
          <h2>{t.archive.title}</h2>
          <p>{t.archive.body}</p>
        </div>

        <div className="control-bar">
          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.archive.search}
            />
          </label>
          <div className="filters" aria-label={t.aria.filters}>
            <Filter size={18} />
            {typeLabels.map((type) => (
              <button
                key={type}
                className={selectedType === type ? "active" : ""}
                onClick={() => setSelectedType(type)}
                type="button"
              >
                {typeLabel[lang][type]}
              </button>
            ))}
          </div>
        </div>

        <div className="archive-grid">
          <div className="project-list">
            {filteredProjects.map((project) => (
              <button
                className={`project-card ${selectedProject?.id === project.id ? "selected" : ""}`}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                type="button"
              >
                <span className={`badge evidence-${project.evidence}`}>{evidenceLabel[lang][project.evidence]}</span>
                <h3>{localizedProject(project, lang).name}</h3>
                <p>{localizedProject(project, lang).summary}</p>
                <span className="card-meta">
                  {typeLabel[lang][project.type]} · {localizedProject(project, lang).author}
                </span>
              </button>
            ))}
            {filteredProjects.length === 0 && (
              <div className="empty-state">
                <Search size={22} />
                <p>{t.archive.empty}</p>
              </div>
            )}
          </div>

          <ProjectDetail project={selectedProject ?? filteredProjects[0] ?? projects[0]} lang={lang} />
        </div>
      </section>

      <section className="submit-section" id="submit">
        <div className="submit-copy">
          <p className="eyebrow">{t.submit.eyebrow}</p>
          <h2>{t.submit.title}</h2>
          <p>{t.submit.body}</p>
          <div className="infra-note">
            <ShieldAlert size={18} />
            <span>{t.submit.note}</span>
          </div>
        </div>

        <form className="submission-form" onSubmit={onSubmit}>
          <label>
            {t.submit.fields.projectName}
            <input name="projectName" required minLength={2} placeholder={t.submit.placeholders.projectName} />
          </label>
          <label>
            {t.submit.fields.projectUrl}
            <input name="projectUrl" required type="url" placeholder="https://..." />
          </label>
          <label>
            {t.submit.fields.author}
            <input name="author" required placeholder={t.submit.placeholders.author} />
          </label>
          <label>
            {t.submit.fields.contact}
            <input name="contact" placeholder={t.submit.placeholders.contact} />
          </label>
          <label>
            {t.submit.fields.projectType}
            <select name="projectType" required defaultValue="">
              <option value="" disabled>
                {t.submit.fields.selectType}
              </option>
              {typeLabels
                .filter((type) => type !== "All")
                .map((type) => (
                  <option key={type} value={type}>
                    {typeLabel[lang][type]}
                  </option>
                ))}
            </select>
          </label>
          <label>
            {t.submit.fields.usage}
            <textarea name="fableUsage" required rows={3} placeholder={t.submit.placeholders.usage} />
          </label>
          <label>
            {t.submit.fields.description}
            <textarea name="description" required rows={4} placeholder={t.submit.placeholders.description} />
          </label>
          <label>
            {t.submit.fields.proof}
            <input name="proofUrl" required type="url" placeholder={t.submit.placeholders.proof} />
          </label>
          <button className="button primary submit-button" type="submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? <Clock3 size={18} /> : submitState === "sent" ? <CheckCircle2 size={18} /> : <Send size={18} />}
            {submitState === "submitting" ? t.submit.button.submitting : submitState === "sent" ? t.submit.button.sent : t.submit.button.idle}
          </button>
          {submitState === "sent" && <p className="form-status">{t.submit.sent}</p>}
          {submitState === "error" && <p className="form-status error">{t.submit.error}</p>}
        </form>
      </section>

      <section className="sources-section" id="sources">
        <div className="section-heading">
          <p className="eyebrow">{t.sources.eyebrow}</p>
          <h2>{t.sources.title}</h2>
        </div>
        <div className="source-grid">
          {sources.map((source, index) => (
            <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.url}>
              <span>
                <Link2 size={16} />
                {lang === "zh" ? sourceZh[index][0] : source.label}
              </span>
              <p>{lang === "zh" ? sourceZh[index][1] : source.note}</p>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </section>

      <footer>
        <span>Fable Legacy</span>
        <a href="#top">
          {t.footer}
          <ArrowUpRight size={16} />
        </a>
      </footer>
    </main>
  );
}

function ProjectDetail({ project, lang }: { project: LegacyProject; lang: Lang }) {
  const t = copy[lang].detail;
  const localized = localizedProject(project, lang);

  return (
    <aside className="detail-panel" aria-live="polite">
      <div className="detail-visual">
        <Sparkles size={22} />
        <span>{localized.imageHint}</span>
      </div>
      <div className="detail-header">
        <span className={`badge evidence-${project.evidence}`}>{evidenceLabel[lang][project.evidence]}</span>
        {project.needsConfirmation && (
          <span className="review-flag">
            <ShieldAlert size={15} />
            {t.manual}
          </span>
        )}
      </div>
      <h2>{localized.name}</h2>
      <p>{localized.summary}</p>
      <dl>
        <div>
          <dt>{t.author}</dt>
          <dd>{localized.author}</dd>
        </div>
        <div>
          <dt>{t.type}</dt>
          <dd>{typeLabel[lang][project.type]}</dd>
        </div>
        <div>
          <dt>{t.date}</dt>
          <dd>{project.date}</dd>
        </div>
      </dl>
      <div className="usage-box">
        <h3>{t.usage}</h3>
        <p>{localized.usage}</p>
      </div>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="detail-links">
        <a href={project.sourceUrl} target="_blank" rel="noreferrer">
          {t.source}
          <ExternalLink size={16} />
        </a>
        {project.projectUrl && (
          <a href={project.projectUrl} target="_blank" rel="noreferrer">
            {t.project}
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </aside>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
