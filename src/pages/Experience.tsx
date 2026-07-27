import { experience, profile } from "../content";
import { PageHead } from "../components/PageHead";
import { Reveal } from "../components/Reveal";
import { RoleRow } from "../components/RoleRow";

export function Experience() {
  return (
    <>
      <PageHead title="Experience" lede="Where I've worked, and what I actually shipped there." />

      <ul className="mt-6 flex flex-col">
        {experience.map((r, i) => (
          <RoleRow key={r.company + r.start} role={r} i={i} />
        ))}
      </ul>

      {profile.resume && (
        <Reveal className="mt-8 border-t border-rule pt-6">
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-2 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:text-accent"
          >
            Full résumé
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="size-3.5 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </Reveal>
      )}
    </>
  );
}
