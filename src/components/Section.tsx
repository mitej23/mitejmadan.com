import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Every section is labelled the same way: a small quiet kicker preceded by a
 * single ember dot. The dot is one of the few places the accent gets spent, so
 * it does the work of marking structure without a heavy heading.
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
      <Reveal
        as="h2"
        className="mb-6 flex items-center gap-2 text-[11px] leading-none font-semibold tracking-[0.09em] text-ink-3 uppercase"
      >
        <span aria-hidden className="size-[3px] rounded-full bg-accent" />
        {label}
      </Reveal>
      {children}
    </section>
  );
}
