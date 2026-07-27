import type { System } from "../content";
import { Reveal } from "./Reveal";

/**
 * One anonymised system. Deliberately roomier than a résumé bullet: the domain
 * sits above the title as a quiet kicker, then what it is, then the part worth
 * reading — and a scope line whenever the work was one piece of a larger effort.
 */
export function SystemRow({ system, i }: { system: System; i: number }) {
  return (
    <Reveal as="li" i={i} className="border-t border-rule py-6 first:border-t-0 first:pt-1">
      <p className="mb-1.5 text-[11px] leading-none font-semibold tracking-[0.07em] text-ink-3 uppercase">
        {system.domain}
      </p>

      <h3 className="text-[15px] leading-[1.35] font-semibold tracking-[-0.012em] text-ink">
        {system.title}
      </h3>

      <p className="mt-2 text-[14px] leading-[1.65] text-ink-2">{system.body}</p>

      <p className="mt-3 border-l border-accent/35 pl-3.5 text-[13.5px] leading-[1.65] text-ink-2">
        {system.hard}
      </p>

      {system.role && (
        <p className="mt-3 text-[12.5px] leading-[1.6] text-ink-3">
          <span className="font-medium text-ink-2">Scope — </span>
          {system.role}
        </p>
      )}

      <ul className="mt-3.5 flex flex-wrap gap-x-1.5 gap-y-1">
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
