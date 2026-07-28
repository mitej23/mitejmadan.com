import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Every section is labelled the same way: a small quiet kicker with a hairline
 * running out to the edge of the measure.
 *
 * This replaced an ember dot. A coloured dot in front of a label is decoration —
 * it draws the eye without telling it anything. The rule does the same job
 * structurally, reads as a divider rather than an ornament, and keeps the accent
 * reserved for things that are actually interactive.
 */
export function Section({
  label,
  children,
  className = "",
  id,
  /**
   * Top margin, as an explicit prop rather than something callers pass through
   * `className` — two competing `mt-*` utilities have equal specificity, so
   * which one wins would depend on stylesheet order.
   */
  gap = "mt-16 sm:mt-20",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  id?: string;
  gap?: string;
}) {
  return (
    <section id={id} className={`${gap} ${className}`}>
      <Reveal as="h2" className="mb-6 flex items-center gap-3.5">
        <span className="shrink-0 text-[11px] leading-none font-semibold tracking-[0.09em] text-ink-3 uppercase">
          {label}
        </span>
        {/* Draws itself out from the label as the section arrives — the same
            left-anchored scale the keyword underlines use, so it reads as part
            of one vocabulary rather than a second idea. */}
        <span aria-hidden className="sect-rule h-px flex-1 bg-rule" />
      </Reveal>
      {children}
    </section>
  );
}
