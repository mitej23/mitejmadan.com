import { links, projects } from "../content";
import { PageHead } from "../components/PageHead";
import { ProjectRow } from "../components/ProjectRow";
import { Reveal } from "../components/Reveal";

export function Projects() {
  return (
    <>
      <PageHead
        title="Projects"
        lede="Things I built end to end. Most are open source — the link goes to the code."
      />

      <ul className="mt-4 flex flex-col">
        {projects.map((p, i) => (
          <ProjectRow key={p.name} project={p} i={i} />
        ))}
      </ul>

      <Reveal className="mt-8 border-t border-rule pt-6">
        <p className="text-[13.5px] leading-[1.6] text-ink-3">
          There are{" "}
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="link font-medium text-ink"
          >
            plenty more on GitHub
          </a>
          , including the ones I built to learn something and then left alone.
        </p>
      </Reveal>
    </>
  );
}
