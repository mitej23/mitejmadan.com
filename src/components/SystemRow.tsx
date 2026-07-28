import type { System } from "../content";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";

/**
 * One anonymised system.
 *
 * Eight of these stacked was a wall of prose, so the dense half — what made it
 * hard, and whose work it was — sits behind a disclosure. Collapsed, a reader
 * gets domain, title, one paragraph and the stack; expanded, they get the
 * engineering. Native <details>, so it works with JS off.
 */
export function SystemRow({
  system,
  i,
  total,
}: {
  system: System;
  i: number;
  total: number;
}) {
  return (
    <Reveal as="li" i={i} className="border-t border-rule py-7 first:border-t-0 first:pt-1">
      {/* The ordinal is the one thing eight near-identical rows couldn't tell
          you: where you are in the set. It's static on purpose — counting it up
          would animate data a reader is trying to read. */}
      <div className="mb-1.5 flex items-baseline gap-3">
        <p className="text-[11px] leading-none font-semibold tracking-[0.07em] text-ink-3 uppercase">
          {system.domain}
        </p>
        <span aria-hidden className="h-px flex-1 bg-rule" />
        <span className="tnum shrink-0 text-[11px] leading-none text-ink-3">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-[15px] leading-[1.35] font-semibold tracking-[-0.012em] text-ink">
        {system.title}
      </h3>

      <p className="mt-2.5 text-[14px] leading-[1.65] text-ink-2">
        <Rich text={system.body} />
      </p>

      <details className="disc group mt-3.5">
        <summary className="inline-flex items-center gap-1.5 rounded text-[12.5px] font-medium text-ink-3 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="size-3"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
          What made it hard
        </summary>

        <div className="disc-body mt-3">
          <p className="border-l border-rule-strong pl-3.5 text-[13.5px] leading-[1.65] text-ink-2">
            <Rich text={system.hard} />
          </p>

          {system.role && (
            <p className="mt-3 text-[12.5px] leading-[1.6] text-ink-3">
              <span className="font-medium text-ink-2">Scope — </span>
              {system.role}
            </p>
          )}
        </div>
      </details>

      <ul className="mt-4 flex flex-wrap gap-x-1.5 gap-y-1">
        {system.stack.map((s) => (
          <li
            key={s}
            className="rounded-[5px] bg-sunken px-1.5 py-0.5 text-[11.5px] leading-[1.5] text-ink-2"
          >
            {s}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
