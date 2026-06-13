import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Archive,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  Filter,
  Github,
  Inbox,
  Link2,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  X
} from "lucide-react";
import heroImage from "./assets/archive-hero.png";
import { projects, sources, timeline, typeLabels, type LegacyProject } from "./data/projects";
import "./styles.css";

type SubmitState = "idle" | "submitting" | "sent" | "error";

const evidenceLabel: Record<LegacyProject["evidence"], string> = {
  primary: "Primary",
  secondary: "Secondary",
  community: "Community",
  "needs-review": "Needs review"
};

function App() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<(typeof typeLabels)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<LegacyProject | null>(projects[0]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesType = selectedType === "All" || project.type === selectedType;
      const haystack = [
        project.name,
        project.author,
        project.type,
        project.usage,
        project.summary,
        project.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      return matchesType && (!normalized || haystack.includes(normalized));
    });
  }, [query, selectedType]);

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
        <nav className="topbar" aria-label="Primary">
          <a className="brand" href="#top" id="top">
            <Archive size={18} />
            Fable Legacy
          </a>
          <div className="navlinks">
            <a href="#archive">Archive</a>
            <a href="#submit">Submit</a>
            <a href="#sources">Sources</a>
          </div>
        </nav>

        <div className="hero-content">
          <p className="kicker">
            <span>Archive opened</span>
            <span>June 13, 2026</span>
          </p>
          <h1 id="page-title">Fable Legacy</h1>
          <p className="lede">
            A living index of projects, demos, refactors, reviews, and public artifacts from the brief Claude Fable 5 era.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#archive">
              <Database size={18} />
              Browse the archive
            </a>
            <a className="button ghost" href="#submit">
              <Inbox size={18} />
              Submit a project
            </a>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Archive status">
          <div>
            <strong>{projects.length}</strong>
            <span>seed entries</span>
          </div>
          <div>
            <strong>{projects.filter((project) => project.evidence === "primary").length}</strong>
            <span>primary sources</span>
          </div>
          <div>
            <strong>{projects.filter((project) => project.needsConfirmation).length}</strong>
            <span>need review</span>
          </div>
        </aside>
      </section>

      <section className="timeline" aria-label="Fable 5 timeline">
        {timeline.map((item) => (
          <article key={item.date}>
            <time dateTime={item.date}>{item.date}</time>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="archive-section" id="archive">
        <div className="section-heading">
          <p className="eyebrow">The Index</p>
          <h2>Browse the surviving traces</h2>
          <p>
            Entries are intentionally labeled by evidence level. Official demos, press references, social posts, and community claims are useful, but they are not equally proven.
          </p>
        </div>

        <div className="control-bar">
          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, authors, tags..."
            />
          </label>
          <div className="filters" aria-label="Project type filters">
            <Filter size={18} />
            {typeLabels.map((type) => (
              <button
                key={type}
                className={selectedType === type ? "active" : ""}
                onClick={() => setSelectedType(type)}
                type="button"
              >
                {type}
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
                <span className={`badge evidence-${project.evidence}`}>{evidenceLabel[project.evidence]}</span>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <span className="card-meta">
                  {project.type} · {project.author}
                </span>
              </button>
            ))}
            {filteredProjects.length === 0 && (
              <div className="empty-state">
                <Search size={22} />
                <p>No entries match this filter yet.</p>
              </div>
            )}
          </div>

          <ProjectDetail project={selectedProject ?? filteredProjects[0] ?? projects[0]} />
        </div>
      </section>

      <section className="submit-section" id="submit">
        <div className="submit-copy">
          <p className="eyebrow">Community Intake</p>
          <h2>Submit a Fable 5 artifact</h2>
          <p>
            Add a project, a refactor, a preserved demo, or a source link. Submissions are queued for review before they become part of the public archive.
          </p>
          <div className="infra-note">
            <Github size={18} />
            <span>Ready for Cloudflare Pages Functions and D1. Offline/local submissions are saved as browser drafts during local preview.</span>
          </div>
        </div>

        <form className="submission-form" onSubmit={onSubmit}>
          <label>
            Project name
            <input name="projectName" required minLength={2} placeholder="Solar system simulator" />
          </label>
          <label>
            Project URL
            <input name="projectUrl" required type="url" placeholder="https://..." />
          </label>
          <label>
            Author or team
            <input name="author" required placeholder="Builder name, team, or handle" />
          </label>
          <label>
            Contact, optional
            <input name="contact" placeholder="Email, X handle, GitHub..." />
          </label>
          <label>
            Project type
            <select name="projectType" required defaultValue="">
              <option value="" disabled>
                Select type
              </option>
              {typeLabels
                .filter((type) => type !== "All")
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Fable 5 usage
            <textarea name="fableUsage" required rows={3} placeholder="Made with, refactored by, optimized by, or reviewed with Fable 5..." />
          </label>
          <label>
            Project description
            <textarea name="description" required rows={4} placeholder="What should the archive preserve about this project?" />
          </label>
          <label>
            Proof/source link
            <input name="proofUrl" required type="url" placeholder="Tweet, repo, video, blog post, screenshot page..." />
          </label>
          <button className="button primary submit-button" type="submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? <Clock3 size={18} /> : submitState === "sent" ? <CheckCircle2 size={18} /> : <Send size={18} />}
            {submitState === "submitting" ? "Submitting..." : submitState === "sent" ? "Saved for review" : "Submit artifact"}
          </button>
          {submitState === "sent" && (
            <p className="form-status">
              Received. In local preview it is stored as a browser draft; on Cloudflare it will write to D1 when the binding is configured.
            </p>
          )}
          {submitState === "error" && <p className="form-status error">Something went wrong. Please try again.</p>}
        </form>
      </section>

      <section className="sources-section" id="sources">
        <div className="section-heading">
          <p className="eyebrow">Research Log</p>
          <h2>Sources used for the seed archive</h2>
        </div>
        <div className="source-grid">
          {sources.map((source) => (
            <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.url}>
              <span>
                <Link2 size={16} />
                {source.label}
              </span>
              <p>{source.note}</p>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </section>

      <footer>
        <span>Fable Legacy</span>
        <a href="#top">
          Back to top
          <ArrowUpRight size={16} />
        </a>
      </footer>
    </main>
  );
}

function ProjectDetail({ project }: { project: LegacyProject }) {
  return (
    <aside className="detail-panel" aria-live="polite">
      <div className="detail-visual">
        <Sparkles size={22} />
        <span>{project.imageHint}</span>
      </div>
      <div className="detail-header">
        <span className={`badge evidence-${project.evidence}`}>{evidenceLabel[project.evidence]}</span>
        {project.needsConfirmation && (
          <span className="review-flag">
            <ShieldAlert size={15} />
            Needs manual confirmation
          </span>
        )}
      </div>
      <h2>{project.name}</h2>
      <p>{project.summary}</p>
      <dl>
        <div>
          <dt>Author</dt>
          <dd>{project.author}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{project.type}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{project.date}</dd>
        </div>
      </dl>
      <div className="usage-box">
        <h3>Fable 5 usage</h3>
        <p>{project.usage}</p>
      </div>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="detail-links">
        <a href={project.sourceUrl} target="_blank" rel="noreferrer">
          Source
          <ExternalLink size={16} />
        </a>
        {project.projectUrl && (
          <a href={project.projectUrl} target="_blank" rel="noreferrer">
            Project
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
