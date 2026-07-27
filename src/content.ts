/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL SITE CONTENT LIVES HERE. Nothing else needs editing to change copy.
 *
 * Drafted from github.com/mitej23 (78 public repos) and TheAgentic. LinkedIn is
 * auth-walled (HTTP 999), so anything that could only have come from a résumé is
 * marked `TODO(mitej)`. Search this file for "TODO" to find every one of them.
 * The site renders correctly as-is — the TODOs are accuracy, not breakage.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Mitej Madan",
  role: "Full Stack Engineer",
  // Shown as the status line under the name. Keep it to one clause.
  status: "Building agent infrastructure at TheAgentic.",
  location: "Mumbai, India",
  timezone: "Asia/Kolkata",
  /**
   * Path to a square photo in `public/`, e.g. "/avatar.jpg". Left null on
   * purpose: the fallback is a drawn monogram that costs zero network requests.
   * Set it once you have a crop you like (400×400 webp is plenty).
   */
  avatar: null as string | null,
  // Two or three short paragraphs. First person, specific, no adjectives that
  // could apply to anyone.
  intro: [
    // TODO(mitej): verify the numbers in this paragraph — years, project count,
    // and user count are placeholders inferred from your GitHub history and
    // TheAgentic's public work. Replace with figures you can stand behind.
    "I build the parts of AI products that have to actually hold up: the services underneath, the data model in the middle, and the interface people touch. Right now that means agent infrastructure at TheAgentic, where a long-running agent has to stay legible to the person waiting on it.",
    "Most of what I ship is TypeScript and Python — React and Node on one side, FastAPI and Postgres on the other. I like the problems where the hard part isn't the model call, it's everything around it: queues that retry correctly, migrations that don't lose history, and state that survives a refresh.",
  ],
  // Set to null to hide the résumé link in the nav.
  resume: "/resume.pdf", // TODO(mitej): drop your PDF at public/resume.pdf, or set this to null.
};

export const links = {
  email: "mitej@theagentic.ai",
  github: "https://github.com/mitej23",
  x: "https://x.com/mitej1347",
  linkedin: "https://www.linkedin.com/in/mitej-madan-06931b155/",
};

/* ── What I do ──────────────────────────────────────────────────────────────
   Three or four areas, each with a heading and one honest paragraph. This is
   the section that separates you from a résumé bullet list.
   ────────────────────────────────────────────────────────────────────────── */

export type Capability = { title: string; body: string };

export const capabilities: Capability[] = [
  {
    title: "Backend and data",
    body: "APIs, background workers, and the schema decisions that get expensive to change later. Postgres with real migrations, job queues that are idempotent because retries are inevitable, and auth I wrote myself often enough to know where the sharp edges are.",
  },
  {
    title: "Product frontend",
    body: "React and TypeScript for interfaces with genuine state — canvases, editors, node graphs, dashboards that stream. The interesting work is usually keeping the UI honest while something slow happens behind it.",
  },
  {
    title: "Agent systems",
    body: "Orchestration, tool calling, and the plumbing that turns a model into something a team can depend on. Most of the difficulty is observability and control: knowing what an agent did, and being able to stop it.",
  },
  {
    title: "Shipping end to end",
    body: "I take features from a rough problem statement to something deployed. That includes the unglamorous parts — CI, environments, migrations in production, and the follow-up fixes nobody scoped.",
  },
];

/* ── Projects ───────────────────────────────────────────────────────────────
   Ordered by what you'd most want a stranger to see, not by date.
   `year` renders in a tabular mono column. `href` is the primary link.
   ────────────────────────────────────────────────────────────────────────── */

export type Project = {
  name: string;
  year: string;
  blurb: string;
  stack: string[];
  href?: string;
  live?: string;
  /** Renders a small ember "live" dot. Use for things people can actually open. */
  isLive?: boolean;
};

export const projects: Project[] = [
  {
    // TODO(mitej): CortexON is TheAgentic's open-source multi-agent system
    // (450+ stars, 75+ forks). Confirm your role and rewrite this in your own
    // words — or delete the entry if you weren't on it.
    name: "CortexON",
    year: "2025",
    blurb:
      "Open-source multi-agent system that takes an open-ended task, plans it, then browses and executes across tools until it returns a finished result. 450+ stars, 75+ forks.",
    stack: ["Python", "TypeScript", "React"],
    href: "https://github.com/TheAgenticAI/CortexON",
    isLive: true,
  },
  {
    name: "Campaigns",
    year: "2024",
    blurb:
      "Email campaign automation built around a visual flow editor — you compose a sequence of sends, waits, and conditions on a canvas, and the backend executes it per recipient with delivery and open tracking.",
    stack: ["TypeScript", "React Flow", "Node", "Postgres"],
    href: "https://github.com/mitej23/Campaigns",
  },
  {
    name: "Alembic Schema Viewer",
    year: "2026",
    blurb:
      "Reads an Alembic migration history and renders the schema it produces, so you can see how tables and relationships evolved across revisions instead of reading migration files in order.",
    stack: ["Python", "Alembic", "SQLAlchemy"],
    href: "https://github.com/mitej23/db-alembic-schema-viewer",
  },
  {
    name: "LLM Math Visualiser",
    year: "2026",
    blurb:
      "Walks through the arithmetic inside a transformer forward pass — embeddings, attention, and projections — as visual steps rather than notation, built to make the shapes concrete.",
    stack: ["Python"],
    href: "https://github.com/mitej23/llm-math-visualiser",
  },
  {
    name: "Canvas Editor",
    year: "2024",
    blurb:
      "SVG-based canvas editor with selection, transform handles, and layer ordering, written from scratch to understand how tools like Figma model geometry and hit-testing.",
    stack: ["TypeScript", "SVG"],
    href: "https://github.com/mitej23/canvas-editor",
  },
  {
    name: "Boardly",
    year: "2024",
    blurb:
      // TODO(mitej): the repo has no description — one sentence on what it does.
      "Collaborative whiteboard with real-time multiplayer cursors and shared board state.",
    stack: ["TypeScript"],
    href: "https://github.com/mitej23/boardly",
  },
  {
    name: "manage.io",
    year: "2024",
    blurb:
      "Portfolio management for mutual fund agents — client holdings, allocations, and returns across a book of investors, with the reporting an agent needs to actually service them.",
    stack: ["JavaScript", "React", "Node"],
    href: "https://github.com/mitej23/manage.io",
  },
  {
    name: "auth-api",
    year: "2024",
    blurb:
      "Authentication service built on rotating refresh and short-lived access tokens, written to get session invalidation and token reuse detection right rather than to reach for a provider.",
    stack: ["JavaScript", "Node", "JWT"],
    href: "https://github.com/mitej23/auth-api",
  },
];

/* ── Experience ─────────────────────────────────────────────────────────────
   TODO(mitej): this is the section I could not source — LinkedIn blocks
   scraping. Fill in real companies, titles, and dates. The two entries below
   are inferred scaffolding: TheAgentic from your GitHub org, and one earlier
   role because your account dates to 2020. Delete or correct freely.
   ────────────────────────────────────────────────────────────────────────── */

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string; // "Present" renders with a live dot
  href?: string;
  points: string[];
};

export const experience: Role[] = [
  {
    company: "TheAgentic",
    title: "Full Stack Engineer",
    start: "TODO", // TODO(mitej): e.g. "Sep 2024"
    end: "Present",
    href: "https://theagentic.ai",
    points: [
      // TODO(mitej): replace all of these with what you actually shipped.
      // Concrete beats impressive — name the system and the outcome.
      "Build and maintain agent orchestration services and the APIs product surfaces consume.",
      "Own the data layer: schema design, migrations, and query performance as usage grew.",
      "Ship the frontend for long-running agent runs — streaming output, intermediate state, and cancellation.",
    ],
  },
  {
    // TODO(mitej): real company, title, and dates — or delete this entry.
    company: "TODO — earlier role",
    title: "Software Engineer",
    start: "TODO",
    end: "TODO",
    points: [
      "TODO(mitej): what you built, and what it changed.",
    ],
  },
];

/* ── Stack ──────────────────────────────────────────────────────────────────
   Grouped so it reads as a set of decisions, not a keyword dump. Keep each
   group short — a list of twenty tools says nothing.
   ────────────────────────────────────────────────────────────────────────── */

export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "Python", "SQL", "C++"] },
  { group: "Frontend", items: ["React", "Vite", "Tailwind", "TanStack Query"] },
  { group: "Backend", items: ["Node", "Express", "FastAPI", "Postgres", "Redis"] },
  { group: "Infra", items: ["Docker", "AWS", "Vercel", "GitHub Actions"] },
  // TODO(mitej): prune anything here you wouldn't want to be interviewed on.
];

/* ── Off the clock ──────────────────────────────────────────────────────────
   One short paragraph of something true and non-professional. This is the line
   people remember. Generic hobbies are worse than nothing.
   ────────────────────────────────────────────────────────────────────────── */

// TODO(mitej): rewrite this in your own words — it's the one section I have no
// basis for, and a placeholder here is more obvious to a reader than anywhere
// else on the site.
export const offClock =
  "Away from the editor I read a lot of systems writing, take things apart to see how they were put together, and lose evenings to problems nobody asked me to solve.";
