import type { Project } from "../content";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";

/**
 * One project. The hover fill is a pseudo-element bled 12px past the measure, so
 * the highlight feels like a physical row while the hairline rules stay aligned
 * to the text column.
 */
export function ProjectRow({ project, i }: { project: Project; i: number }) {
  const href = project.live ?? project.href;

  return (
    <Reveal as="li" i={i} className="border-t border-rule first:border-t-0">
      <Wrapper href={href}>
        <div className="relative flex items-baseline gap-2.5">
          <h3 className="text-[15px] leading-[1.3] font-semibold tracking-[-0.012em] text-ink">
            {project.name}
          </h3>

          {project.isLive && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.04em] text-ink-3 uppercase">
              <span aria-hidden className="pulse-dot size-[5px] rounded-full bg-live" />
              Live
            </span>
          )}

          <span className="tnum ml-auto shrink-0 pl-2 text-[12px] text-ink-3">
            {project.year}
          </span>

          {href && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="size-3.5 shrink-0 -translate-x-1 self-center text-ink-3 opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          )}
        </div>

        <p className="relative mt-1.5 text-[14px] leading-[1.6] text-ink-2">
          <Rich text={project.blurb} />
        </p>

        <ul className="relative mt-2.5 flex flex-wrap gap-x-1.5 gap-y-1">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded-[5px] bg-sunken px-1.5 py-0.5 text-[11.5px] leading-[1.5] text-ink-2"
            >
              {s}
            </li>
          ))}
        </ul>
      </Wrapper>
    </Reveal>
  );
}

function Wrapper({ href, children }: { href?: string; children: React.ReactNode }) {
  const shell =
    "relative block py-5 before:absolute before:inset-y-1.5 before:-inset-x-3 before:-z-10 before:rounded-[10px] before:bg-sunken before:opacity-0 before:transition-opacity before:duration-200 before:ease-[var(--ease-out-quart)]";

  if (!href) return <div className={shell}>{children}</div>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`group ${shell} hover:before:opacity-100 focus-visible:before:opacity-100`}
    >
      {children}
    </a>
  );
}
