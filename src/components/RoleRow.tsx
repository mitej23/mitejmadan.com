import type { Role } from "../content";
import { Reveal } from "./Reveal";

export function RoleRow({ role, i }: { role: Role; i: number }) {
  const present = role.end === "Present";

  return (
    <Reveal as="li" i={i} className="border-t border-rule py-6 first:border-t-0 first:pt-1">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <h3 className="text-[15px] leading-[1.3] font-semibold tracking-[-0.012em] text-ink">
          {role.href ? (
            <a
              href={role.href}
              target="_blank"
              rel="noreferrer noopener"
              className="link"
            >
              {role.company}
            </a>
          ) : (
            role.company
          )}
        </h3>

        {present && (
          <span aria-hidden className="pulse-dot size-[5px] rounded-full bg-live" />
        )}

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
            {p}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
