import { capabilities, offClock, profile, projects, stack } from "../content";
import { Avatar } from "../components/Avatar";
import { LocalTime } from "../components/LocalTime";
import { ProjectRow } from "../components/ProjectRow";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { Socials } from "../components/Socials";
import { Link } from "../lib/router";

const FEATURED = 4;

export function Home() {
  return (
    <>
      {/* ── Hero. Uses `.enter` rather than `.reveal`: it is above the fold, so
             it should play on mount instead of waiting for an observer. ── */}
      <header>
        <div className="enter mb-6" style={{ "--i": 1 } as React.CSSProperties}>
          <Avatar />
        </div>

        <h1
          className="enter text-[23px] leading-[1.15] font-semibold tracking-[-0.028em] text-ink sm:text-[27px]"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {profile.name}
        </h1>

        <p
          className="enter mt-1 text-[15px] text-ink-2 sm:text-[16px]"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          {profile.role}
        </p>

        <p
          className="enter mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-3"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="pulse-dot size-[5px] rounded-full bg-live" />
            {profile.status}
          </span>
          <span aria-hidden className="text-ink-4">
            ·
          </span>
          <span>
            {profile.location}, <LocalTime />
          </span>
        </p>
      </header>

      <div
        className="enter mt-9 flex flex-col gap-4 text-[15px] leading-[1.68] text-ink-2"
        style={{ "--i": 5 } as React.CSSProperties}
      >
        {profile.intro.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      {/* ── What I do ── */}
      <Section label="What I do">
        <div className="flex flex-col gap-7">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} i={i} className="flex flex-col gap-1">
              <h3 className="text-[14.5px] leading-[1.3] font-semibold tracking-[-0.01em] text-ink">
                {c.title}
              </h3>
              <p className="text-[14px] leading-[1.65] text-ink-2">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Selected work ── */}
      <Section label="Selected work">
        <ul className="-mt-5 flex flex-col">
          {projects.slice(0, FEATURED).map((p, i) => (
            <ProjectRow key={p.name} project={p} i={i} />
          ))}
        </ul>

        <Reveal className="mt-6 border-t border-rule pt-5">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-2 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:text-accent"
          >
            All {projects.length} projects
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="size-3.5 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5 motion-reduce:transition-none"
            >
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Reveal>
      </Section>

      {/* ── Stack ── */}
      <Section label="Stack">
        <dl className="flex flex-col">
          {stack.map((g, i) => (
            <Reveal
              key={g.group}
              as="div"
              i={i}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border-t border-rule py-3.5 first:border-t-0 first:pt-0"
            >
              <dt className="w-20 shrink-0 text-[12px] text-ink-3">{g.group}</dt>
              <dd className="flex-1 text-[14px] leading-[1.6] text-ink-2">
                {g.items.join(", ")}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* ── Off the clock ── */}
      <Section label="Off the clock">
        <Reveal>
          <p className="text-[14.5px] leading-[1.68] text-ink-2">{offClock}</p>
        </Reveal>
      </Section>

      {/* ── Contact ── */}
      <Section label="Where to find me">
        <Reveal>
          <Socials />
        </Reveal>
      </Section>
    </>
  );
}
