/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL SITE CONTENT LIVES HERE. Nothing else needs editing to change copy.
 *
 * Sourced from Mitej_Madan_Resume (1).pdf (his own, marked outdated — it ends
 * July 2023) plus github.com/mitej23. Anything the résumé didn't cover — the
 * TheAgentic role above all, since it postdates the document — is marked
 * `TODO(mitej)`. Search for "TODO" to find every one.
 *
 * Stack lists and project blurbs are kept to what there is evidence for. If
 * something you use daily is missing, that's why — add it.
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
    "I build the parts of software that have to actually hold up: the services underneath, the data model in the middle, and the interface people touch. Right now that means agent infrastructure at TheAgentic.",
    "Most of what I ship is TypeScript — React on one side, Node and Postgres on the other — with Python where it fits better. I'm drawn to the problems where the hard part isn't the feature, it's the correctness underneath: merging concurrent edits without a server picking winners, executing a scheduled flow per recipient, keeping state that survives a refresh.",
  ],
  /**
   * TODO(mitej): pointing at nothing on purpose. You called the résumé outdated
   * (it ends July 2023 and predates TheAgentic), so publishing it under a
   * "Résumé" nav link would misrepresent you. Drop a current PDF at
   * `public/resume.pdf` and set this to "/resume.pdf" to bring the link back.
   */
  resume: null as string | null,
};

export const links = {
  // The résumé lists mitejmadan@gmail.com; using the work address the site is
  // being built under. TODO(mitej): switch if you'd rather personal mail.
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
    title: "Product frontend",
    body: "React and TypeScript for interfaces with genuine state — collaborative canvases, drag-and-drop flow editors, dashboards. Most of my work has been here, and the interesting part is usually keeping the UI honest while something slow or concurrent happens behind it.",
  },
  {
    title: "Backend and data",
    body: "Node and Express over Postgres, with Prisma for the schema. Auth I've written from scratch often enough to know where the sharp edges are, and background execution — scheduled sends, conditional delays, retries — that has to stay correct when it runs unattended.",
  },
  {
    title: "Real-time and correctness",
    body: "CRDTs with Y.js for conflict-free collaborative editing, and WebSockets where state has to move as it changes. This is the work I like most: getting concurrent writes to converge without a server arbitrating who wins.",
  },
  {
    title: "Shipping end to end",
    body: "I take features from a rough problem statement to something deployed, across whatever the stack turns out to be — I've shipped in Laravel and Flask and React Native when that was the right answer, not just the familiar one.",
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
  /** Renders a small "live" dot. Use for things people can actually open. */
  isLive?: boolean;
};

export const projects: Project[] = [
  {
    // TODO(mitej): CortexON is TheAgentic's open-source multi-agent system
    // (450+ stars, 75+ forks). It postdates the résumé, so I can't confirm your
    // role — rewrite this in your own words, or delete the entry.
    name: "CortexON",
    year: "2025",
    blurb:
      "Open-source multi-agent system that takes an open-ended task, plans it, then browses and executes across tools until it returns a finished result. 450+ stars, 75+ forks.",
    stack: ["Python", "TypeScript", "React"],
    href: "https://github.com/TheAgenticAI/CortexON",
    isLive: true,
  },
  {
    name: "Boardly",
    year: "2024",
    blurb:
      "Collaborative canvas for brainstorming, built on CRDTs so concurrent edits converge without a server deciding who wins. Y.js handles conflict resolution; JWT handles auth and authorization.",
    stack: ["React", "TypeScript", "Y.js", "Express", "Prisma", "React Query"],
    href: "https://github.com/mitej23/boardly",
  },
  {
    name: "Campaigns",
    year: "2024",
    blurb:
      "Email automation built around a drag-and-drop editor: you compose a campaign as a flow of sends, delays, and conditions, and the backend executes it per recipient — including branches that depend on what the recipient did.",
    stack: ["React", "Express", "Postgres", "shadcn/ui"],
    href: "https://github.com/mitej23/Campaigns",
  },
  {
    name: "College Data Collection System",
    year: "2022",
    blurb:
      "Centralised storage system for a college, with complex filtering and bulk import/export. Files live in the institution's own OneDrive via Azure and MSAL rather than a bucket I'd have to manage.",
    stack: ["Laravel", "Flask", "Azure OneDrive", "MSAL"],
    href: "https://github.com/mitej23/College-Management-System",
  },
  {
    name: "Alembic Schema Viewer",
    year: "2026",
    // TODO(mitej): the repo has no description — this is my reading of the code.
    blurb:
      "Reads an Alembic migration history and renders the schema it produces, so you can see how tables and relationships evolved across revisions instead of reading migration files in order.",
    stack: ["Python", "Alembic", "SQLAlchemy"],
    href: "https://github.com/mitej23/db-alembic-schema-viewer",
  },
  {
    name: "LLM Math Visualiser",
    year: "2026",
    // TODO(mitej): also undescribed in the repo — correct if I've read it wrong.
    blurb:
      "Walks through the arithmetic inside a transformer forward pass — embeddings, attention, and projections — as visual steps rather than notation, built to make the shapes concrete.",
    stack: ["Python"],
    href: "https://github.com/mitej23/llm-math-visualiser",
  },
  {
    name: "Food Ordering System",
    year: "2022",
    // No `href`: github.com/mitej23/restaurant-app returns 404, so the résumé's
    // link is dead — renamed, deleted, or private.
    // TODO(mitej): add the current repo URL, or drop this entry.
    blurb:
      "Mobile food ordering app with live delivery tracking — WebSockets push a courier's location to the customer as it changes, with Firebase behind it.",
    stack: ["React Native", "Redux", "Firebase", "WebSockets"],
  },
  {
    name: "Canvas Editor",
    year: "2024",
    // TODO(mitej): undescribed repo — my reading of the code.
    blurb:
      "SVG-based canvas editor with selection, transform handles, and layer ordering, written from scratch to understand how tools like Figma model geometry and hit-testing.",
    stack: ["TypeScript", "SVG"],
    href: "https://github.com/mitej23/canvas-editor",
  },
  {
    name: "manage.io",
    year: "2024",
    blurb:
      "Portfolio management for mutual fund agents — client holdings, allocations, and returns across a book of investors, with the reporting an agent needs to service them.",
    stack: ["JavaScript", "React", "Node"],
    href: "https://github.com/mitej23/manage.io",
  },
];

/* ── Experience ─────────────────────────────────────────────────────────────
   `end: "Present"` renders with a live dot.
   ────────────────────────────────────────────────────────────────────────── */

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  href?: string;
  points: string[];
};

export const experience: Role[] = [
  {
    company: "TheAgentic",
    title: "Full Stack Engineer",
    // TODO(mitej): the résumé predates this role entirely, so the start date and
    // all three bullets below are still mine, not yours. This is the last
    // significant placeholder on the site — concrete beats impressive, so name
    // the system and what changed because of it.
    start: "TODO",
    end: "Present",
    href: "https://theagentic.ai",
    points: [
      "Build and maintain agent orchestration services and the APIs product surfaces consume.",
      "Own the data layer: schema design, migrations, and query performance as usage grew.",
      "Ship the frontend for long-running agent runs — streaming output, intermediate state, and cancellation.",
    ],
  },
  {
    company: "Idigitize Infotech LLP",
    title: "Front-End Developer",
    start: "Dec 2022",
    end: "Jul 2023",
    points: [
      "Built the admin and user dashboards for CapitalIdeaz.in in React.",
      "Shipped several e-commerce admin panels in Next.js, factored around reusable components rather than per-client rewrites.",
      "Worked across school management and rent management systems.",
      "Built landing pages to spec with the UI/UX designers.",
    ],
  },
];

/* ── Education ──────────────────────────────────────────────────────────────
   Rendered under Experience. Both entries are from the résumé.
   ────────────────────────────────────────────────────────────────────────── */

export type Degree = {
  qualification: string;
  institution: string;
  year: string;
  detail?: string;
};

export const education: Degree[] = [
  {
    qualification: "Master of Computer Applications",
    institution: "NMIMS Mukesh Patel School of Technology Management & Engineering",
    year: "2024",
    detail: "CGPA 3.87 / 4",
  },
  {
    qualification: "BSc Information Technology",
    institution: "Narsee Monjee College of Commerce & Economics, Mumbai University",
    year: "2023",
    detail: "CGPA 8.55 / 10",
  },
];

/* ── Stack ──────────────────────────────────────────────────────────────────
   Only what there's evidence you've shipped with. Grouped so it reads as a set
   of decisions rather than a keyword dump.
   ────────────────────────────────────────────────────────────────────────── */

export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "React Native", "Tailwind", "React Query"] },
  { group: "Backend", items: ["Node", "Express", "Postgres", "Prisma", "Flask"] },
  { group: "Real-time", items: ["Y.js / CRDTs", "WebSockets"] },
  { group: "Cloud", items: ["Firebase", "Azure", "Vercel"] },
  // TODO(mitej): add what you use at TheAgentic that isn't here — I removed my
  // earlier guesses (FastAPI, Redis, Docker, AWS) rather than assert them.
];

/* ── Off the clock ──────────────────────────────────────────────────────────
   One short paragraph of something true and non-professional. This is the line
   people remember. Generic hobbies are worse than nothing.
   ────────────────────────────────────────────────────────────────────────── */

// TODO(mitej): the résumé had nothing personal in it, so this is still mine and
// still the section with no basis behind it. Rewrite it or delete it — a
// placeholder reads more obviously here than anywhere else on the site.
export const offClock =
  "Away from the editor I read a lot of systems writing, take things apart to see how they were put together, and lose evenings to problems nobody asked me to solve.";
