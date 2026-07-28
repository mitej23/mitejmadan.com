import type { Role } from "../content";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";

/**
 * One role, hung off a timeline.
 *
 * The spine is a real element rather than decoration: two roles stacked with a
 * hairline between them left the dates as the only clue that this was a
 * chronology. The rule spans the row's full height including its padding, so
 * consecutive rows join into one continuous line.
 *
 * The "still here" marker lives on the node now. It used to be a separate pulsing
 * dot beside the company name, which said the same thing twice once the timeline
 * existed.
 */
export function RoleRow({ role, i }: { role: Role; i: number }) {
  const present = role.end === "Present";

  return (
    <Reveal
      as="li"
      i={i}
      className="flex gap-4 border-t border-rule py-6 first:border-t-0 first:pt-1"
    >
      <div aria-hidden className="relative w-[9px] shrink-0">
        <span className="tl-line absolute inset-y-0 left-1 w-px bg-rule-strong" />
        <span
          className={`tl-node relative mt-[6px] block size-[9px] rounded-full ring-[3px] ring-bg ${
            present ? "pulse-dot bg-live" : "bg-ink-4"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3 className="text-[15px] leading-[1.3] font-semibold tracking-[-0.012em] text-ink">
            {role.href ? (
              <a href={role.href} target="_blank" rel="noreferrer noopener" className="link">
                {role.company}
              </a>
            ) : (
              role.company
            )}
          </h3>

          <span className="tnum ml-auto shrink-0 text-[12px] text-ink-3">
            {role.start} — {role.end}
          </span>
        </div>

        <p className="mt-0.5 text-[13.5px] text-ink-3">{role.title}</p>

        <ul className="mt-3.5 flex flex-col gap-2">
          {role.points.map((p) => (
            <li
              key={p}
              className="relative pl-4 text-[14px] leading-[1.6] text-ink-2 before:absolute before:top-[0.62em] before:left-0 before:size-[3px] before:rounded-full before:bg-ink-4"
            >
              <Rich text={p} />
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
