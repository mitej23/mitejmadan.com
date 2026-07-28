import { education, experience, profile, systems } from "../content";
import { PageHead } from "../components/PageHead";
import { Reveal } from "../components/Reveal";
import { RoleRow } from "../components/RoleRow";
import { Section } from "../components/Section";
import { SystemRow } from "../components/SystemRow";

export function Experience() {
  return (
    <>
      <PageHead title="Experience" lede="Where I've worked, and what I actually shipped there." />

      <ul className="mt-6 flex flex-col">
        {experience.map((r, i) => (
          <RoleRow key={r.company + r.start} role={r} i={i} />
        ))}
      </ul>

      <Section label="Selected systems" gap="mt-10 sm:mt-12">
        <Reveal className="mb-7 -mt-1">
          <p className="text-[13.5px] leading-[1.6] text-ink-3">
            Client and product names are left out on purpose. What's kept is the sector,
            the architecture, and the engineering — and a scope note wherever the work
            was one part of a larger team effort.
          </p>
        </Reveal>

        <ul className="flex flex-col">
          {systems.map((s, i) => (
            <SystemRow key={s.title} system={s} i={i} total={systems.length} />
          ))}
        </ul>
      </Section>

      {/* Tighter than the default: the role list above already ends on its own
          generous bottom padding, so the standard gap reads as a dead zone. */}
      <Section label="Education" gap="mt-14 sm:mt-16">
        <ul className="flex flex-col">
          {education.map((d, i) => (
            <Reveal
              as="li"
              key={d.qualification}
              i={i}
              className="border-t border-rule py-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-2.5">
                <h3 className="text-[14.5px] leading-[1.3] font-semibold tracking-[-0.012em] text-ink">
                  {d.qualification}
                </h3>
                <span className="tnum ml-auto shrink-0 text-[12px] text-ink-3">{d.year}</span>
              </div>
              <p className="mt-1 text-[13.5px] leading-[1.55] text-ink-2">{d.institution}</p>
              {d.detail && <p className="tnum mt-0.5 text-[12.5px] text-ink-3">{d.detail}</p>}
            </Reveal>
          ))}
        </ul>
      </Section>

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
