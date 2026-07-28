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
  avatar: "/avatar-256.webp" as string | null,
  // Two or three short paragraphs. First person, specific, no adjectives that
  // could apply to anyone.
  intro: [
    "I build the parts of software that have to actually hold up: the *services underneath*, the *data model in the middle*, and the *interface people touch*. Right now that means *agent infrastructure* at TheAgentic.",
    "Most of what I ship is TypeScript — React on one side, Node and Postgres on the other — with Python where it fits better. I'm drawn to the problems where the hard part isn't the feature, it's the correctness underneath: *merging concurrent edits without a server picking winners*, executing a scheduled flow per recipient, keeping state that survives a refresh.",
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
    title: "Agent harnesses",
    body: "The loop around a model call — *tool dispatch*, *exit conditions*, *approval gates*, and a *durable record* of what happened. The difficulty is rarely the model; it's *containment*. Errors compound over a long run, so the work is bounding what one bad step can reach and leaving a trace good enough to diagnose it afterwards.",
  },
  {
    title: "Tool surfaces",
    body: "A model given hundreds of tools picks badly, so the question is what the tool layer should be at all — how it's grouped, how much each call returns, and whether it can be *generated from the schema* instead of hand-maintained against one. I've consistently got more out of this than out of prompt work.",
  },
  {
    title: "Interfaces for work that takes time",
    body: "Agent runs, long jobs, and collaborative editing share a problem: the interface has to stay truthful while something slow or concurrent happens behind it, including when the user closes the tab and comes back. That means *streamed state*, *buffered replay* rather than silent gaps, and approval steps that own a real deadline.",
  },
  {
    title: "Backend and data",
    body: "Postgres-first: schema and migrations, background execution that stays correct unattended, and auth I've written from scratch often enough to know the sharp edges. On the correctness end, *CRDTs* for concurrent edits that have to converge without a server arbitrating who wins.",
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
    name: "Boardly",
    year: "2024",
    blurb:
      "Collaborative canvas for brainstorming, built on *CRDTs* so concurrent edits converge without a server deciding who wins. Y.js handles conflict resolution; JWT handles auth and authorization.",
    stack: ["React", "TypeScript", "Y.js", "Express", "Prisma", "React Query"],
    href: "https://github.com/mitej23/boardly",
  },
  {
    name: "Campaigns",
    year: "2024",
    blurb:
      "Email automation built around a *drag-and-drop editor*: you compose a campaign as a flow of sends, delays, and conditions, and the backend executes it per recipient — including branches that depend on what the recipient did.",
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
    start: "Dec 2024",
    end: "Present",
    href: "https://theagentic.ai",
    points: [
      "Build agent systems end to end across seven products — orchestrator-worker trees, tool layers, human-in-the-loop approval gates, and the operator interfaces that make a long run legible while it is still running.",
      "Generated a ~520-tool agent surface from 131 database models instead of hand-writing it, so the tools stay correct against a schema that keeps moving.",
      "Designed the approval path for irreversible actions: mutating tools propose rather than execute, and identity and tenancy bind outside the model's reach so it cannot widen its own scope.",
      "Own the real-time layer on most of these — streamed traces, per-session buffering so a reconnecting client rebuilds accurate state, and steppers that flatten nested conditional runs.",
      "Shipped a cross-platform mobile client to the App Store, and wrote the deterministic scoring engine behind an explainable recommendation product.",
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

/* ── Photographs ────────────────────────────────────────────────────────────
   Rendered on /photos as a two-column masonry.

   Ordered, not dumped. The two Thailand sunbeam frames are near-identical in
   tone, so they sit at positions 2 and 6 rather than side by side, and the
   sequence alternates cool/warm so no two neighbours read the same. Opens on
   the strongest frame and closes on the brightest.

   Sources were shot on a phone; two carried EXIF orientation 6 and had the
   rotation baked into the pixels during export, because `cwebp` doesn't read
   EXIF and would otherwise have published them on their side.

   `alt` describes what is in the frame. Captions are intentionally absent —
   see TODO below if you want them.
   ────────────────────────────────────────────────────────────────────────── */

export type Photo = {
  slug: string;
  /** Intrinsic size of the exported asset — reserves the box, prevents reflow. */
  w: number;
  h: number;
  alt: string;
  lqip: string;
  /**
   * Which desktop column this frame sits in. Explicit rather than left to CSS
   * `columns`, which fills top-to-bottom per column and put the two
   * near-identical sunbeam frames side by side. Array order is the mobile
   * (single-column) reading order; `col` is the desktop arrangement.
   */
  col: 0 | 1;
};

// TODO(mitej): no captions and no locations. I'm not guessing where these were
// shot. If you want them, add a `caption` field here and render it in PhotoGrid.
export const photos: Photo[] = [
  {
    slug: "cave-mouth",
    col: 0,
    w: 1125,
    h: 1500,
    alt: "A figure sitting alone in the mouth of a sea cave, silhouetted against bright water and a limestone stack offshore.",
    lqip: "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAADQBACdASoUABsAPt1cqE0opSQiKA1REBuJZQC7AA3W8mhYHxvUDroIhN/hyurgAAD4oj8Wx8CBDaRWCG3EEf2sqc+3XaGFSFaJ2O13OisNdZpynEXHMZ0JRicLjz+1j++khz6STamWTxByu+6Xm0to+SNL1KPcxuoZ8oxrv/zAmmDsLYoEYr4WEAA=",
  },
  {
    slug: "fog-trees",
    col: 1,
    w: 1125,
    h: 1500,
    alt: "Two bare trees on a hillside in heavy fog, their branches meeting against a flat grey sky.",
    lqip: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAABwBACdASoUABsAPtlWpUyoJKOiN/VYAQAbCWcAygBFX7f3wShdfnmfutAUAAD+5yZzC6/maFP7AjbFU3v2qQy4Od6sOJfsxqCIFHjkS9tzpd1cNXEvUAAA",
  },
  {
    slug: "longtail-sunbeams",
    col: 0,
    w: 1500,
    h: 1500,
    alt: "A longtail boat in silhouette at dusk as sunbeams break through a heavy cloud bank over the sea.",
    lqip: "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAACwBACdASoUABQAPt1cqE0opSQiKA1REBuJZwDKABIlzUdKLf0Y0h4eiQ7vAsgAAP3v2maz3TP30FP2+6kcfYzJD5K267Pk80hySqfrjcIHs0hJ8GlKKfX54zWNk/ZhqnYaDf+TTtBkCBwF1sPzMZLBPOqWIedptIeELCjprOAAAA==",
  },
  {
    slug: "stage-blue",
    col: 1,
    w: 1125,
    h: 1500,
    alt: "A performer alone behind a booth on a vast blue-lit stage, seen over a crowd of raised phones.",
    lqip: "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADwBACdASoUABsAPtVYpEyoJSOiMAwBABqJagCdL3WB0xZS8EkL3NTsKOzhJDCzk8AA/vVvsFoGHajN9YvRCtmXIEVdgwyhn8+2wxNKOe63OLkymLSV8vV0PPwK16fdds4bp9o9TrKfFcARJ1JcIbrLRxJBeVjpMk/AaThAAAA=",
  },
  {
    slug: "fort-lake",
    col: 0,
    w: 1125,
    h: 1500,
    alt: "A hilltop fort wall dropping away to a hazy lake far below, with visitors climbing the mossy steps.",
    lqip: "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAADwBACdASoUABsAPt1mrFCopSQiqAgBEBuJZQAA7OVa4OaLdgyfZpmIvqDYCD3ZfoAA/u07T4RpcF4TzvjLZLN7ibnprhcgtwt4HIiLTJ3dFA7xoqduHGRjEyq7RtBPat6RvyHuEAba199qfiRUXmOxUgokYDS7bgrPV1iVfjkxQN2GvvHZa6IRKzVcIAAA",
  },
  {
    slug: "valley-tree",
    col: 1,
    w: 1125,
    h: 1500,
    alt: "Two monkeys running along a branch of a broad tree that frames a green valley and distant fields.",
    lqip:
      "data:image/webp;base64,UklGRvYAAABXRUJQVlA4IOoAAADQBQCdASoUABsAPt1irE8opaQiKAqpEBuJYwDImywTnIW/pmJ/PAfC+r1LIQ/rgyN2QJSk+KAgAP7sJ8262QtO98FTUH39OQqjwVdHzUyWxZ1R55n+o9nNTO1E2rMOi/caiOTCXgIO02tEc6BAu8kjs1ZfNRdLUcNoCrZw8KAui9/BddX9l48SOTGlY4hx9AjRs2tpQD/bluyHB9wCKcwbr19NiNVs7U1Qk0VhRXLnBO0RlWI1covbdQkATekpUkSvSDhotm/2fOzUVDhAWlh/u941tMJkKtUcUMIthmZ5xr/unQHRayrtAAA=",
  },
  {
    slug: "fisherman-dusk",
    col: 0,
    w: 1500,
    h: 828,
    alt: "A lone figure casting a fishing line from black rocks at dusk, with moored sailboats scattered across the bay.",
    lqip: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQBACdASoUAAwAPt1cpkyopSOiMAgBEBuJZwDDNCKjyzRri+mpZoXQAAD+sGblIm4gzo0CK4Eds1M5uDeFUfIN3O9hTjVx/FV7NI629kWKUgJz4sOkAAAA",
  },
];

/* ── Systems ────────────────────────────────────────────────────────────────
   Work built at TheAgentic, rendered under the role on /experience.

   ANONYMISED ON PURPOSE. No product, company, or client name appears here, and
   nothing identifies a specific customer. What's kept is the sector, the
   architecture, and the engineering — which is what a reader is actually
   evaluating, and is standard practice for work under NDA.

   Every claim below was read out of the source by a reviewer, not summarised
   from a README. `role` is stated wherever the work was part of a larger team
   effort, so nothing here overstates what was his.
   ────────────────────────────────────────────────────────────────────────── */

export type System = {
  title: string;
  domain: string;
  /** What it is. */
  body: string;
  /** The genuinely difficult part — the reason it's worth listing. */
  hard: string;
  stack: string[];
  /** Scope qualifier, where the work was one part of a bigger system. */
  role?: string;
};

export const systems: System[] = [
  {
    title: "Conversational agent layer over a project-management platform",
    domain: "Construction operations",
    body: "A chat surface that lets site and office staff read and write project records — requests for information, daily logs, inspections, budgets, change orders — in natural language instead of navigating roughly ninety separate screens. Rather than hand-writing the tool surface, a generator reflects *131 ORM models*, classifies them by column shape, and emits *~520 intent tools* plus the agents that own them, so the tools track a schema that keeps moving.",
    hard: "No single model call can choose sensibly among 520 tools, so requests route through an *orchestrator-worker tree* — a router, ten domain coordinators, and 86 object-level workers — with per-turn tool selection capped at eight and context isolated per subagent. Every mutating action stops for human approval, which the graph library can't do at the leaves — an interrupt only resumes inside the graph that owns the checkpointer. *Mutating tools were inverted into proposers* that return a proposal instead of executing, and one confirm-and-execute tool at the router carries the approval gate. *Identity and tenancy bind from request-scoped context* and never enter the model-facing signature, so the model cannot set who owns a row or widen an organisation's scope even by editing a proposal.",
    stack: ["Python", "FastAPI", "LangGraph", "LangChain", "Postgres", "SQLAlchemy", "SSE", "React"],
  },
  {
    title: "Explainable admissions matching and scoring engine",
    domain: "Higher-education advising",
    body: "Turns a structured student profile into a ranked, tier-labelled shortlist drawn from ~2,500 institutions, scored on two independent axes: admissions probability and preference fit. Every scoring node emits its inputs, its formula, and the branch it took, which the interface renders as a navigable graph so a non-technical adviser can click any number and read the arithmetic that produced it.",
    hard: "The authoritative data is heterogeneous and mostly missing — the figures that matter most are the ones institutions most often omit. *Missingness had to become a first-class scoring concept*: components deactivate rather than defaulting to zero, weights renormalise across whatever survived, and per-factor weights come from each institution's own published importance ratings rather than one global guess. A language model reranks and narrates but cannot introduce facts: a *grounding validator* re-extracts every numeric token from the generated text and fails the whole response back to deterministic output on any mismatch.",
    stack: ["Python", "FastAPI", "Postgres", "pgvector", "ARQ", "Pydantic AI", "React", "React Flow"],
  },
  {
    title: "Multi-agent assistant over a sales team's existing stack",
    domain: "Sales productivity",
    body: "An orchestrator-worker system: a lead agent delegates to eight specialists — CRM, email, calendar, chat, spreadsheets, file storage, web research, coaching — each bound to the individual user's own authorised connections rather than a shared service account. It runs a read-only advisory mode and an action mode that writes to those systems, streaming execution traces to both a web app and a browser side panel.",
    hard: "Every write to a system you don't own is irreversible, so mutations split into a *pure preview step and a separate executor*, with approval state carried across turns in a Postgres checkpointer keyed by conversation. That needs prompt-level guards too: an already-approved draft must never be silently redrafted, and \"do it, but change one thing\" has to be treated as a new request rather than an approval. The third-party CRM also returns an unstable response envelope, so reads defend through several unwrapping layers with a list-and-filter fallback when the vendor's own search fails.",
    stack: ["Python", "FastAPI", "LangGraph", "Postgres", "pgvector", "OAuth", "Stripe", "SSE"],
  },
  {
    title: "Property and field-service operations app",
    domain: "Property management",
    body: "A cross-platform mobile client, shipped to the App Store, covering a property portfolio, an owner and vendor directory, and the full lifecycle of service jobs — outreach, site visits, quotes, negotiation, completion — across 46 screens. It adds a connected calendar, device-contact import behind an explicit second consent gate, and location-scoped vendor discovery on top of a REST backend.",
    hard: "Notification action buttons resolve a business decision *without ever bringing the app to the foreground*, so the response handler has to authenticate and post to the backend directly, with separate paths for an action press, a plain tap, and an action identifier it doesn't recognise. A sixteen-state job lifecycle surfaced as a stepper means a status change invalidates cache keys the mutation site cannot name statically — invalidation runs by *predicate-matching over the query cache* instead. Native modules are required lazily inside try/catch so the bundle still loads where they're absent.",
    stack: ["TypeScript", "React Native", "Expo", "TanStack Query", "APNs / FCM", "Swift"],
  },
  {
    title: "Operator console for an agentic workflow platform",
    domain: "Freight and logistics operations",
    body: "A multi-tenant platform where operations staff assemble workflows on a visual canvas — pulling records from a transport management system, branching on them, calling models, sending mail, placing calls, and driving vendor portals through a remote headless browser where no API exists. Two execution substrates sit side by side: a node-graph engine for user-authored workflows, and a step-sequence coordinator for long browser runs with human checkpoints. Runs are triggered manually, on cron, on internal events, by webhook, or by polling.",
    hard: "*A run outlives the tab that started it*, so the operator-facing half is the difficult half. Progress events are *buffered server-side and replayed in order* when a client attaches late or reconnects, and the stepper has to flatten a nested, conditional step tree and reveal branches as they're actually taken — otherwise a run that began before the tab was open reads as broken rather than in progress. Human-in-the-loop is a real step type that blocks on an event with a per-step timeout and releases the leased browser on rejection or expiry, which means the approval interface owns a countdown and an edit round-trip, not just a yes and a no.",
    stack: ["React", "TypeScript", "React Flow", "TanStack Query", "WebSockets", "Python", "FastAPI"],
    role: "Dominant frontend author and largest contributor of five. Owned the real-time operator layer — the run-progress stepper, the human-in-the-loop modal, the session viewer, the WebSocket hook, and the data-fetching layer — plus the auth flows and analytics surface. On the backend I contributed model prompt formatting for thread analysis and a geocoding fallback chain with negative-result caching. The graph engine and tool registry were a colleague's.",
  },
  {
    title: "Case management with national court-record sync",
    domain: "Legal, regulated market",
    body: "A practice platform that imports and continuously re-syncs matters from a national court-records API, tracking docket movements, official notices, and filing deadlines, with an agent that produces versioned document artefacts. Access is governed by firm-level roles, per-matter team assignments with row-level visibility, and a confidentiality seal for restricted matters.",
    hard: "The upstream API is asynchronous, credit-metered, and weakly documented, and every call costs real money — so the interface had to make that asynchrony legible rather than hide it. Long lookups start a job and poll on an interval written specifically to survive a transient not-yet-visible state that would otherwise read as failure, and bulk import is a job-preview-confirm flow so credits are only spent on confirm. The agent's tool-call trace streams through a hand-written frame reader whose error type distinguishes *a connection failure before anything persisted*, which is safe to retry, from a mid-stream failure, where retrying would write the turn twice.",
    stack: ["React", "TypeScript", "TanStack Query", "FastAPI", "Postgres", "Redis", "Celery", "SSE"],
    role: "Led the frontend — agent chat surface, matter pages, deadlines with calendar sync, and role-based member management. Contributed the backend streaming and persistence of agent step traces and versioned artefacts. The court-sync service layer was largely a colleague's.",
  },
  {
    title: "Two-sided platform for personal finance and advisers",
    domain: "Consumer fintech and wealth advisory",
    body: "One application with two role surfaces over a shared design system: a dashboard where people with irregular income see aggregated net worth, linked accounts, cash flow, goals, and debt payoff; and an adviser workspace for managing a client book through decisions, alerts, an advice ledger, and execution tracking. 46 routed pages behind a single token layer.",
    hard: "Header-based auth sessions *can't attach a token to the browser's own EventSource*, so both live surfaces needed hand-rolled readers over fetch: one reassembles multi-line frames for a tool-calling chat that renders typed payload cards, the other does sequence-number gap detection and backoff reconnection for an adviser event feed. Retiring the design-file sample data was its own discipline — three line-by-line audits classifying every rendered value as live, mocked, or locally derived before replacing it, including optimistic mutations that walk every cached list containing a row, patch it in place, snapshot for rollback, and invalidate on settle.",
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "TanStack Query", "Web Workers", "FastAPI"],
    role: "Largest line contribution in the repo and dominant author of the adviser surface, the design-token layer, and the migration from raw fetch to a cached query layer. The projection and tax engines were a colleague's; I redesigned and extended their interface.",
  },
  {
    title: "Architecture audit and replatforming plan, five-service system",
    domain: "Education services",
    body: "A multi-tenant platform for AI-assisted advising sessions, spread across five services: a REST API that is the sole writer to a 64-table Postgres schema, a stateless agent runtime that holds no database credentials and reaches everything through service-authenticated tool calls, an event fan-out service, and two separate portals for families and firm staff.",
    hard: "The interesting finding was that *several seams had never actually been connected* — the fan-out service validated tokens from a different identity provider than the API issued, the browser sent its credential as a query parameter while the handler read a header, and the agent runtime expected an HTTP tool endpoint the API exposed only over stdio. Establishing that required reverse-engineering the tool-server contract from the client code rather than from any spec, then scoring every service edge as real or assumed and arguing both sides of collapsing five services into two.",
    stack: ["TypeScript", "Node", "Express", "Postgres", "pgvector", "Redis", "MCP", "SSE"],
    role: "This was an assessment, not an implementation — I wrote the cross-repo completion audit, the component coverage matrix, and the rebuild plan. None of the production code in these repositories is mine.",
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
  "Away from the editor I read a lot of systems writing, take things apart to see how they were put together, and lose evenings to problems nobody asked me to solve. Every so often I get far enough from a screen to remember why.";

/**
 * The one photograph on the site. Cropped square from the original 3024×4032 —
 * the top half of the frame was empty sky, and dropping it puts the limestone
 * cliffs, the water gradient, and the sand all in one composition.
 *
 * `lqip` is a 20×20 WebP inlined as a data URI (203 bytes). It paints the photo's
 * colour immediately, including in the prerendered HTML, so the space is never
 * blank while the real file loads.
 */
export const photo = {
  src: "/photos/thailand-600.webp",
  srcSet:
    "/photos/thailand-400.webp 400w, /photos/thailand-600.webp 600w, /photos/thailand-900.webp 900w",
  width: 600,
  height: 600,
  alt: "Mitej standing at the shoreline on a beach in Thailand, limestone cliffs across the water behind him.",
  // TODO(mitej): name the actual beach and year if you want it more specific —
  // the cliffs look like Krabi, but I'm not going to guess on your behalf.
  caption: "Thailand",
  lqip:
    "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAAAQBQCdASoUABQAPt1cqU2opSQiKA1REBuJQBYj6rg1MSrKEDmDKJDfwTsz+0qcBagAAPeYxaZ37yC+lhN8G/WYjy2Kcnp1XsM/B2BtfII1/Qwu4QEIo/drgkBqy5szlzsL1rom48ovhtXFnx60Q4QAAAA=",
};
