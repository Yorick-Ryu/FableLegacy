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
  LockKeyhole,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import heroImage from "./assets/archive-hero.png";
import { typeLabels, type LegacyProject } from "./data/projects";
import "./styles.css";

type SubmitState = "idle" | "submitting" | "sent" | "error";
type Lang = "en" | "zh";
type LoadState = "loading" | "ready" | "error";
type AdminState = "idle" | "loading" | "ready" | "error";

type ProjectTranslation = Partial<Pick<LegacyProject, "name" | "author" | "usage" | "summary" | "imageHint">>;

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  body: string;
};

type SourceEntry = {
  id: string;
  label: string;
  url: string;
  note: string;
};

type ArchiveData = {
  projects: LegacyProject[];
  projectTranslations: Record<string, Record<string, ProjectTranslation>>;
  timeline: TimelineEvent[];
  timelineTranslations: Record<string, Record<string, Partial<Pick<TimelineEvent, "title" | "body">>>>;
  sources: SourceEntry[];
  sourceTranslations: Record<string, Record<string, Partial<Pick<SourceEntry, "label" | "note">>>>;
};

type AdminSubmission = {
  id: string;
  project_name: string;
  project_url: string;
  author: string;
  contact: string | null;
  project_type: string;
  fable_usage: string;
  description: string;
  proof_url: string;
  status: string;
  created_at: string;
};

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
      community: "community leads"
    },
    archive: {
      eyebrow: "The Index",
      title: "Browse the surviving traces",
      body: "Entries are labeled by evidence level. Official demos, press references, social posts, and community claims are useful, but they are not equally proven.",
      search: "Search projects, authors, tags...",
      empty: "No entries match this filter yet.",
      loading: "Loading archive data...",
      error: "Archive data could not be loaded."
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
      author: "Author",
      type: "Type",
      date: "Date",
      usage: "Fable 5 usage",
      source: "Source",
      project: "Project",
      media: "Media"
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
      community: "社区线索"
    },
    archive: {
      eyebrow: "索引",
      title: "浏览留下来的痕迹",
      body: "每个条目都会标注证据等级。官方演示、媒体引用、社交发布与社区线索都值得保存，但它们的可信度并不相同。",
      search: "搜索项目、作者、标签...",
      empty: "没有符合当前筛选的条目。",
      loading: "正在加载档案数据...",
      error: "档案数据加载失败。"
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
      author: "作者",
      type: "类型",
      date: "日期",
      usage: "Fable 5 使用方式",
      source: "来源",
      project: "项目",
      media: "媒体"
    },
    footer: "回到顶部",
    lang: "EN"
  }
} as const;

const evidenceLabel: Record<Lang, Record<LegacyProject["evidence"], string>> = {
  en: {
    primary: "Primary",
    secondary: "Secondary",
    community: "Community"
  },
  zh: {
    primary: "一手来源",
    secondary: "二手来源",
    community: "社区线索"
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
    Refactor: "Refactor",
    Optimization: "Optimization"
  },
  zh: {
    All: "全部",
    Demo: "演示",
    Game: "游戏",
    Tool: "工具",
    Website: "网站",
    Research: "研究",
    Benchmark: "评测",
    Refactor: "重构",
    Optimization: "优化"
  }
};

function initialLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function localizedProject(project: LegacyProject, translations: ArchiveData["projectTranslations"], lang: Lang) {
  return lang === "zh" ? { ...project, ...translations.zh?.[project.id] } : project;
}

function localizedTimeline(event: TimelineEvent, translations: ArchiveData["timelineTranslations"], lang: Lang) {
  return lang === "zh" ? { ...event, ...translations.zh?.[event.id] } : event;
}

function localizedSource(source: SourceEntry, translations: ArchiveData["sourceTranslations"], lang: Lang) {
  return lang === "zh" ? { ...source, ...translations.zh?.[source.id] } : source;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(() => typeof window !== "undefined" && window.location.hash === "#admin");
  const [lang, setLang] = useState<Lang>(initialLang);
  const [archiveData, setArchiveData] = useState<ArchiveData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<(typeof typeLabels)[number]>("All");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const t = copy[lang];
  const projects = archiveData?.projects ?? [];
  const timeline = archiveData?.timeline ?? [];
  const sources = archiveData?.sources ?? [];

  useEffect(() => {
    function onHashChange() {
      setIsAdmin(window.location.hash === "#admin");
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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

  useEffect(() => {
    let cancelled = false;

    async function loadArchive() {
      setLoadState("loading");
      try {
        const response = await fetch("/api/archive", { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Archive request failed");
        const data = (await response.json()) as ArchiveData;
        if (cancelled) return;
        setArchiveData(data);
        setSelectedProjectId(data.projects[0]?.id ?? null);
        setLoadState("ready");
      } catch {
        if (cancelled) return;
        setArchiveData(null);
        setSelectedProjectId(null);
        setLoadState("error");
      }
    }

    void loadArchive();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const localized = localizedProject(project, archiveData?.projectTranslations ?? {}, lang);
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
  }, [archiveData?.projectTranslations, lang, projects, query, selectedType]);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0] ?? null;

  function selectType(type: (typeof typeLabels)[number]) {
    const firstProject = type === "All" ? projects[0] : projects.find((project) => project.type === type);
    if (!firstProject) return;
    setSelectedType(type);
    setSelectedProjectId(firstProject.id);
  }

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
      setSubmitState("error");
    }
  }

  if (isAdmin) {
    return <AdminPanel onExit={() => setIsAdmin(false)} />;
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
            <strong>{projects.filter((project) => project.evidence === "community").length}</strong>
            <span>{t.hero.community}</span>
          </div>
        </aside>
      </section>

        <section className="timeline" aria-label={t.aria.timeline}>
        {timeline.map((item) => {
          const localized = localizedTimeline(item, archiveData?.timelineTranslations ?? {}, lang);
          return (
          <article key={item.id}>
            <time dateTime={item.date}>{item.date}</time>
            <h2>{localized.title}</h2>
            <p>{localized.body}</p>
          </article>
          );
        })}
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
                onClick={() => selectType(type)}
                type="button"
              >
                {typeLabel[lang][type]}
              </button>
            ))}
          </div>
        </div>

        <div className="archive-grid">
          <div className="project-list">
            {loadState === "loading" && (
              <div className="empty-state">
                <Clock3 size={22} />
                <p>{t.archive.loading}</p>
              </div>
            )}
            {loadState === "error" && (
              <div className="empty-state">
                <ShieldAlert size={22} />
                <p>{t.archive.error}</p>
              </div>
            )}
            {filteredProjects.map((project) => (
              <button
                className={`project-card ${selectedProject?.id === project.id ? "selected" : ""}`}
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                type="button"
              >
                <span className={`badge evidence-${project.evidence}`}>{evidenceLabel[lang][project.evidence]}</span>
                <h3>{localizedProject(project, archiveData?.projectTranslations ?? {}, lang).name}</h3>
                <p>{localizedProject(project, archiveData?.projectTranslations ?? {}, lang).summary}</p>
                <span className="card-meta">
                  {typeLabel[lang][project.type]} · {localizedProject(project, archiveData?.projectTranslations ?? {}, lang).author}
                </span>
              </button>
            ))}
            {loadState === "ready" && filteredProjects.length === 0 && (
              <div className="empty-state">
                <Search size={22} />
                <p>{t.archive.empty}</p>
              </div>
            )}
          </div>

          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              projectTranslations={archiveData?.projectTranslations ?? {}}
              lang={lang}
            />
          )}
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
          {sources.map((source) => {
            const localized = localizedSource(source, archiveData?.sourceTranslations ?? {}, lang);
            return (
            <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.url}>
              <span>
                <Link2 size={16} />
                {localized.label}
              </span>
              <p>{localized.note}</p>
              <ExternalLink size={16} />
            </a>
            );
          })}
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

function AdminPanel({ onExit }: { onExit: () => void }) {
  const [token, setToken] = useState(() => localStorage.getItem("fable-admin-token") ?? "");
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [adminState, setAdminState] = useState<AdminState>("idle");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadSubmissions(nextToken = token) {
    setAdminState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/submissions?status=pending", {
        headers: adminHeaders(nextToken)
      });
      if (!response.ok) throw new Error("Unable to load submissions");
      const data = (await response.json()) as { submissions: AdminSubmission[] };
      localStorage.setItem("fable-admin-token", nextToken);
      setSubmissions(data.submissions);
      setAdminState("ready");
    } catch {
      setSubmissions([]);
      setAdminState("error");
      setMessage("无法加载投稿。请确认管理员 token 和环境变量 FABLE_ADMIN_TOKEN 是否一致。");
    }
  }

  async function reviewSubmission(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setMessage("");

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          ...adminHeaders(token),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, action })
      });
      if (!response.ok) throw new Error("Review failed");
      setSubmissions((current) => current.filter((submission) => submission.id !== id));
      setMessage(action === "approve" ? "已批准并发布到公开档案。" : "已拒绝该投稿。");
    } catch {
      setMessage("操作失败，请稍后重试。");
    } finally {
      setBusyId(null);
    }
  }

  function onTokenSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadSubmissions(token);
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a
          className="brand"
          href="#top"
          onClick={() => {
            window.location.hash = "";
            onExit();
          }}
        >
          <Archive size={18} />
          Fable Legacy
        </a>
        <button className="button ghost" type="button" onClick={() => void loadSubmissions()}>
          <RefreshCw size={18} />
          刷新
        </button>
      </header>

      <section className="admin-shell">
        <div className="section-heading">
          <p className="eyebrow">Review Queue</p>
          <h1>投稿审核</h1>
          <p>这里显示尚未审批的投稿。批准后会写入公开归档，并把原投稿状态标记为 approved。</p>
        </div>

        <form className="admin-token-form" onSubmit={onTokenSubmit}>
          <label>
            管理员 token
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="FABLE_ADMIN_TOKEN"
              type="password"
            />
          </label>
          <button className="button primary" type="submit" disabled={adminState === "loading"}>
            <LockKeyhole size={18} />
            {adminState === "loading" ? "加载中..." : "进入审核"}
          </button>
        </form>

        {message && <p className={`admin-message ${adminState === "error" ? "error" : ""}`}>{message}</p>}

        <div className="admin-list">
          {adminState === "ready" && submissions.length === 0 && (
            <div className="empty-state">
              <CheckCircle2 size={22} />
              <p>当前没有待审核投稿。</p>
            </div>
          )}

          {submissions.map((submission) => (
            <article className="admin-card" key={submission.id}>
              <div className="admin-card-main">
                <span className="badge status-pending">{submission.status}</span>
                <h2>{submission.project_name}</h2>
                <p>{submission.description}</p>
                <dl>
                  <div>
                    <dt>作者</dt>
                    <dd>{submission.author}</dd>
                  </div>
                  <div>
                    <dt>类型</dt>
                    <dd>{submission.project_type}</dd>
                  </div>
                  <div>
                    <dt>提交时间</dt>
                    <dd>{submission.created_at}</dd>
                  </div>
                </dl>
                <div className="usage-box">
                  <h3>Fable 5 使用方式</h3>
                  <p>{submission.fable_usage}</p>
                </div>
                <div className="detail-links">
                  <a href={submission.project_url} target="_blank" rel="noreferrer">
                    项目链接
                    <ExternalLink size={16} />
                  </a>
                  <a href={submission.proof_url} target="_blank" rel="noreferrer">
                    证明链接
                    <ExternalLink size={16} />
                  </a>
                  {submission.contact && <span>联系方式：{submission.contact}</span>}
                </div>
              </div>
              <div className="admin-actions">
                <button
                  className="button primary"
                  type="button"
                  disabled={busyId === submission.id}
                  onClick={() => void reviewSubmission(submission.id, "approve")}
                >
                  <CheckCircle2 size={18} />
                  {busyId === submission.id ? "处理中..." : "批准发布"}
                </button>
                <button
                  className="button ghost"
                  type="button"
                  disabled={busyId === submission.id}
                  onClick={() => void reviewSubmission(submission.id, "reject")}
                >
                  <ShieldAlert size={18} />
                  拒绝
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function adminHeaders(token: string) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`
  };
}

function ProjectDetail({
  project,
  projectTranslations,
  lang
}: {
  project: LegacyProject;
  projectTranslations: ArchiveData["projectTranslations"];
  lang: Lang;
}) {
  const t = copy[lang].detail;
  const localized = localizedProject(project, projectTranslations, lang);

  return (
    <aside className="detail-panel" aria-live="polite">
      <div className="detail-visual">
        {project.mediaUrl ? (
          <video src={project.mediaUrl} controls playsInline preload="metadata" aria-label={localized.imageHint} />
        ) : (
          <>
            <Sparkles size={22} />
            <span>{localized.imageHint}</span>
          </>
        )}
      </div>
      <div className="detail-header">
        <span className={`badge evidence-${project.evidence}`}>{evidenceLabel[lang][project.evidence]}</span>
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
        {project.mediaUrl && (
          <a href={project.mediaUrl} target="_blank" rel="noreferrer">
            {t.media}
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
