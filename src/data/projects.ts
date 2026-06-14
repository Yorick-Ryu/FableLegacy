export type EvidenceLevel = "primary" | "secondary" | "community";

export type LegacyProject = {
  id: string;
  name: string;
  author: string;
  type: "Demo" | "Game" | "Tool" | "Website" | "Research" | "Benchmark" | "Refactor" | "Optimization";
  usage: string;
  summary: string;
  sourceUrl: string;
  projectUrl?: string;
  mediaUrl?: string;
  date: string;
  evidence: EvidenceLevel;
  tags: string[];
  imageHint: string;
};

export const timeline = [
  {
    date: "2026-06-09",
    title: "Claude Fable 5 becomes publicly available",
    body: "Anthropic introduced Fable 5 as a widely released Mythos-class Claude model for demanding reasoning and long-horizon agentic work."
  },
  {
    date: "2026-06-12",
    title: "Access suspended under a US government directive",
    body: "Anthropic said it had to abruptly disable Fable 5 and Mythos 5 access for customers to comply with an export-control directive."
  },
  {
    date: "2026-06-13",
    title: "The archive starts",
    body: "The first public demos, benchmarks, posts, and community builds are gathered here as a living Fable Legacy index."
  }
];

export const sources = [
  {
    label: "Anthropic launch post",
    url: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
    note: "Primary source for official model background and built-in demo examples."
  },
  {
    label: "Anthropic suspension statement",
    url: "https://www.anthropic.com/news/fable-mythos-access",
    note: "Primary source for the access suspension that turned the project into a legacy archive."
  },
  {
    label: "Claude API docs",
    url: "https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5",
    note: "Primary documentation for model naming, intended use, and API availability."
  },
  {
    label: "Official Claude social thread",
    url: "https://x.com/claudeai/status/2065456678909227064",
    note: "Official community showcase thread with individual media links gathered as public archive leads."
  },
  {
    label: "ExplainX community roundup",
    url: "https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026",
    note: "Secondary roundup of first-wave community projects."
  },
  {
    label: "Pasquale Pillitteri community reaction post",
    url: "https://pasqualepillitteri.it/en/news/4828/claude-fable-5-anthropic-thread-community-reactions",
    note: "Secondary capture of the official thread and community response."
  },
  {
    label: "AWS launch post",
    url: "https://aws.amazon.com/blogs/aws/anthropic-claude-fable-5-on-aws-mythos-class-capabilities-with-built-in-safeguards-now-available/",
    note: "Partner announcement with availability context."
  },
  {
    label: "Endor Labs security benchmark",
    url: "https://www.endorlabs.com/learn/claude-fable-5-mythos-grade-hype",
    note: "Independent benchmark with coding and security-task results."
  },
  {
    label: "CodeRabbit model review",
    url: "https://www.coderabbit.ai/blog/fable-5-model-review",
    note: "Review mentioning real-time app generation and build behavior."
  },
  {
    label: "Reddit frontend overhaul post",
    url: "https://www.reddit.com/r/ClaudeAI/comments/1u2keuw/fable_5_was_shockingly_tokenefficient_for_a_full/",
    note: "Community submission describing a full frontend overhaul."
  },
  {
    label: "YouTube Higgsfield motion site",
    url: "https://www.youtube.com/watch?v=N5JeyaqIa7c",
    note: "Creator video claiming a motion website built with Claude Fable 5 and Higgsfield MCP."
  }
];

export const projects: LegacyProject[] = [
  {
    id: "solar-system-physics",
    name: "Physics-first solar system simulator",
    author: "Anthropic demo",
    type: "Demo",
    usage: "Built by Fable 5 as an autonomous simulation, deriving orbital motion from first principles and using it to predict eclipses.",
    summary: "A browser-style scientific simulation used in Anthropic's launch material to illustrate long-horizon reasoning and implementation.",
    sourceUrl: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
    date: "2026-06-09",
    evidence: "primary",
    tags: ["simulation", "physics", "official-demo"],
    imageHint: "Orbit traces and eclipse prediction"
  },
  {
    id: "factorio-agent",
    name: "Autonomous Factorio factory",
    author: "Anthropic demo",
    type: "Game",
    usage: "Fable 5 played Factorio, strategized, and built an automated factory on its own.",
    summary: "A game-playing demonstration that positioned Fable 5 as a model capable of sustained planning in dynamic environments.",
    sourceUrl: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
    date: "2026-06-09",
    evidence: "primary",
    tags: ["game", "agent", "planning"],
    imageHint: "Factory belts and autonomous build planning"
  },
  {
    id: "browser-cad-copilot",
    name: "Browser CAD editor and 3D printable model",
    author: "Anthropic demo",
    type: "Tool",
    usage: "Fable 5 created a browser CAD editor, its AI copilot, and a complete 3D-printable model inside it.",
    summary: "A nested creation example: a tool made by Fable 5 was then used by Fable 5 to produce a physical-design artifact.",
    sourceUrl: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
    date: "2026-06-09",
    evidence: "primary",
    tags: ["cad", "3d-printing", "copilot"],
    imageHint: "Parametric model in a browser CAD surface"
  },
  {
    id: "ruby-codebase-migration",
    name: "50M-line Ruby codebase migration",
    author: "Reported in launch coverage",
    type: "Refactor",
    usage: "Reported as a large migration completed in roughly one day with Fable 5 assistance.",
    summary: "A scale-oriented software engineering case referenced in coverage of Fable 5's agentic coding capabilities.",
    sourceUrl: "https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks",
    date: "2026-06-10",
    evidence: "secondary",
    tags: ["migration", "ruby", "enterprise"],
    imageHint: "Large repository migration ledger"
  },
  {
    id: "pokemon-firered-vision",
    name: "Pokemon FireRed vision-only run",
    author: "Reported in launch coverage",
    type: "Game",
    usage: "Fable 5 reportedly played through Pokemon FireRed using vision input.",
    summary: "A vision-and-control game demonstration circulated in press coverage around Fable 5's release.",
    sourceUrl: "https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks",
    date: "2026-06-10",
    evidence: "secondary",
    tags: ["game", "vision", "agent"],
    imageHint: "Retro handheld game input stream"
  },
  {
    id: "survey-analysis-tool",
    name: "Advanced survey analysis tool",
    author: "Reported in launch coverage",
    type: "Research",
    usage: "Created over a long autonomous work session for academic-style survey analysis.",
    summary: "A research tooling case that points toward Fable 5's use in data exploration, analysis UX, and long-running implementation.",
    sourceUrl: "https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks",
    date: "2026-06-10",
    evidence: "secondary",
    tags: ["research", "analytics", "long-horizon"],
    imageHint: "Survey dashboard and statistical panels"
  },
  {
    id: "procedural-shaders",
    name: "Procedural shader studies",
    author: "Community builders via official thread",
    type: "Demo",
    usage: "Community projects built with Fable 5, collected in first-week showcases.",
    summary: "Generative visual experiments showing real-time shader composition and code-driven animation.",
    sourceUrl: "https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026",
    date: "2026-06-13",
    evidence: "community",
    tags: ["shader", "creative-coding", "community"],
    imageHint: "Procedural material swatches"
  },
  {
    id: "fluid-ink-simulation",
    name: "Fluid ink simulations",
    author: "Community builders via official thread",
    type: "Demo",
    usage: "A first-wave creative coding artifact reportedly built with Fable 5.",
    summary: "Canvas/WebGL-style fluid visuals that fit the early Fable 5 pattern of expressive, interactive frontends.",
    sourceUrl: "https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026",
    date: "2026-06-13",
    evidence: "community",
    tags: ["fluid", "canvas", "creative-coding"],
    imageHint: "Ink plumes and simulation controls"
  },
  {
    id: "goldfish-app",
    name: "Goldfish app",
    author: "Community builders via official thread",
    type: "Website",
    usage: "Mentioned in the first 72-hour community roundup as a Fable 5 build.",
    summary: "A whimsical community app preserved as one of the first public artifacts from Fable 5's brief availability window.",
    sourceUrl: "https://explainx.ai/blog/claude-fable-5-community-projects-first-week-2026",
    date: "2026-06-13",
    evidence: "community",
    tags: ["app", "community", "interactive"],
    imageHint: "Small interactive creature app"
  },
  {
    id: "motion-website-higgsfield",
    name: "Motion website with Higgsfield MCP",
    author: "YouTube creator",
    type: "Website",
    usage: "Video title and description claim Claude Fable 5 plus Higgsfield MCP built a motion website with generated media assets.",
    summary: "A creator workflow example where Fable 5 orchestrated code and media generation into a motion-heavy website.",
    sourceUrl: "https://www.youtube.com/watch?v=N5JeyaqIa7c",
    projectUrl: "https://www.youtube.com/watch?v=N5JeyaqIa7c",
    date: "2026-06-11",
    evidence: "community",
    tags: ["website", "motion", "media-generation"],
    imageHint: "Motion landing page and video assets"
  },
  {
    id: "real-time-app-review",
    name: "Real-time app build reviewed by CodeRabbit",
    author: "CodeRabbit review",
    type: "Tool",
    usage: "Review describes Fable 5 building a real-time application with procedural visuals, phase changes, and a successful production build.",
    summary: "A review artifact that is useful for the archive because it includes strengths and remaining engineering gaps.",
    sourceUrl: "https://www.coderabbit.ai/blog/fable-5-model-review",
    date: "2026-06-09",
    evidence: "secondary",
    tags: ["real-time", "review", "production-build"],
    imageHint: "Realtime state loop and canvas effects"
  },
  {
    id: "agent-security-league-benchmark",
    name: "Agent Security League benchmark",
    author: "Endor Labs",
    type: "Benchmark",
    usage: "Fable 5 was benchmarked on 200 real-world coding tasks, including functional and security solves.",
    summary: "A counterweight entry for the archive: not a showcase build, but evidence of how Fable 5 behaved on practical engineering tasks.",
    sourceUrl: "https://www.endorlabs.com/learn/claude-fable-5-mythos-grade-hype",
    projectUrl: "https://www.endorlabs.com/learn/claude-fable-5-mythos-grade-hype",
    date: "2026-06-10",
    evidence: "secondary",
    tags: ["benchmark", "security", "coding"],
    imageHint: "Benchmark grid and issue traces"
  },
  {
    id: "personal-os-overhaul",
    name: "Personal OS frontend overhaul",
    author: "Reddit community post",
    type: "Refactor",
    usage: "A user described using Fable 5 for a token-efficient overhaul of a personal webapp OS.",
    summary: "A community refactor entry involving daily overview, mail, calendar, tasks, dev projects, news, and knowledge-base surfaces.",
    sourceUrl: "https://www.reddit.com/r/ClaudeAI/comments/1u2keuw/fable_5_was_shockingly_tokenefficient_for_a_full/",
    date: "2026-06-11",
    evidence: "community",
    tags: ["frontend", "refactor", "personal-tools"],
    imageHint: "Dense personal dashboard"
  },
  {
    id: "soccer-neo-gothic-plane",
    name: "Soccer game, neo-gothic city, and plane model set",
    author: "Instagram community post",
    type: "Demo",
    usage: "A social post describes a set of projects built with Claude Fable 5, including a soccer game, neo-gothic city, and plane model.",
    summary: "A bundle entry awaiting direct media review; useful as an intake target because it names multiple visual projects.",
    sourceUrl: "https://www.instagram.com/p/DZfmFqJIK8Y/",
    date: "2026-06-13",
    evidence: "community",
    tags: ["game", "3d", "social-post"],
    imageHint: "Three-item social media showcase"
  }
];

export const typeLabels = ["All", "Demo", "Game", "Tool", "Website", "Research", "Benchmark", "Refactor", "Optimization"] as const;
