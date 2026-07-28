import { useEffect, useRef, useState } from "react";
import { education, experience, stack, systems } from "../content";

/**
 * The reading panel.
 *
 * Originally a Gen-3 text box across the bottom, which meant one sentence per
 * page and seventeen pages to get through the systems. It's a side panel now: the
 * extra height shows a whole entry at once, so paging is per *topic* rather than
 * per sentence, and it no longer covers the room.
 *
 * Content is resolved here rather than in the engine, so `content.ts` stays the
 * single source of truth and never lands in the lazily-loaded game chunk. The
 * engine only reports a topic string; this decides what that means.
 */

/** Keyword markers are for the web page, not for this panel. */
const plain = (s: string) => s.replace(/\*/g, "");

export type Page = {
  /** Small kicker above the heading. */
  kicker?: string;
  title: string;
  /** Lead paragraph. */
  body?: string;
  /** Bulleted detail. */
  items?: string[];
  /** Set apart with a rule, for "what made it hard" and scope notes. */
  aside?: { label: string; text: string }[];
  /** Rendered as chips. */
  tags?: string[];
};

export function pagesFor(topic: string): Page[] {
  switch (topic) {
    case "theagentic:role": {
      const r = experience[0];
      return [
        {
          kicker: `${r.start} — ${r.end}`,
          title: r.company,
          body: r.title,
          items: r.points.map(plain),
        },
      ];
    }

    case "theagentic:systems":
      return [
        {
          kicker: "Shelf",
          title: `${systems.length} systems`,
          body: "Client and product names are left out on purpose. What's kept is the sector, the architecture, and the engineering.",
          items: systems.map((s) => `${s.domain} — ${s.title}`),
        },
        ...systems.map((s, i) => ({
          kicker: `${i + 1} / ${systems.length} · ${s.domain}`,
          title: s.title,
          body: plain(s.body),
          aside: [
            { label: "What made it hard", text: plain(s.hard) },
            ...(s.role ? [{ label: "Scope", text: plain(s.role) }] : []),
          ],
          tags: s.stack,
        })),
      ];

    case "idigitize:role": {
      const r = experience[1];
      return [
        {
          kicker: `${r.start} — ${r.end}`,
          title: r.company,
          body: r.title,
          items: r.points.map(plain),
        },
      ];
    }

    case "education:degrees":
      return [
        {
          kicker: "Shelf",
          title: "Education",
          aside: education.map((d) => ({
            label: `${d.qualification} · ${d.year}`,
            text: `${d.institution}${d.detail ? `\n${d.detail}` : ""}`,
          })),
        },
      ];

    case "education:stack":
      return [
        {
          kicker: "Shelf",
          title: "Stack",
          body: "What I actually build with.",
          aside: stack.map((g) => ({ label: g.group, text: g.items.join(", ") })),
        },
      ];

    default:
      return [{ title: "…", body: "Nothing to read here." }];
  }
}

export function Dialogue({ pages, onClose }: { pages: Page[]; onClose: () => void }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const page = pages[i];
  const last = i >= pages.length - 1;
  const many = pages.length > 1;

  useEffect(() => {
    // A new page starts at its top, not wherever the previous one was scrolled.
    scroller.current?.scrollTo({ top: 0 });
  }, [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keys = [" ", "Enter", "e", "E", "Escape", "ArrowLeft", "ArrowRight"];
      if (!keys.includes(e.key)) return;

      // Consume it. This panel is the innermost layer, and without stopping
      // propagation the outer Escape handler also fired and dropped the viewer
      // out of the whole overworld instead of just closing the text.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
      else if (last && e.key !== "ArrowRight") onClose();
      else setI((n) => Math.min(pages.length - 1, n + 1));
    };
    addEventListener("keydown", onKey, { capture: true });
    return () => removeEventListener("keydown", onKey, { capture: true });
  });

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={page.title}
      tabIndex={-1}
      className="absolute inset-x-0 bottom-0 z-10 max-h-[62%] outline-none sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[24rem]"
    >
      <div className="flex h-full flex-col border-t-[3px] border-white/80 bg-[#161c2b]/97 backdrop-blur sm:border-t-0 sm:border-l-[3px]">
        <div ref={scroller} className="flex-1 overflow-y-auto px-5 py-5">
          {page.kicker && (
            <p className="mb-1.5 text-[10.5px] font-semibold tracking-[0.1em] text-white/45 uppercase">
              {page.kicker}
            </p>
          )}

          <h2 className="text-[16px] leading-[1.3] font-semibold tracking-[-0.01em] text-white">
            {page.title}
          </h2>

          {page.body && (
            <p className="mt-2.5 text-[13.5px] leading-[1.6] whitespace-pre-line text-white/80">
              {page.body}
            </p>
          )}

          {page.items && (
            <ul className="mt-3.5 flex flex-col gap-2">
              {page.items.map((it) => (
                <li
                  key={it}
                  className="relative pl-3.5 text-[13px] leading-[1.55] text-white/75 before:absolute before:top-[0.6em] before:left-0 before:size-[3px] before:rounded-full before:bg-white/35"
                >
                  {it}
                </li>
              ))}
            </ul>
          )}

          {page.aside?.map((a) => (
            <div key={a.label} className="mt-4 border-l border-white/20 pl-3.5">
              <p className="mb-1 text-[10.5px] font-semibold tracking-[0.09em] text-white/40 uppercase">
                {a.label}
              </p>
              <p className="text-[12.5px] leading-[1.6] whitespace-pre-line text-white/70">
                {a.text}
              </p>
            </div>
          ))}

          {page.tags && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {page.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-[5px] bg-white/10 px-1.5 py-0.5 text-[11px] text-white/70"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-white/12 px-4 py-3">
          {many ? (
            <>
              <button
                type="button"
                onClick={() => setI((n) => Math.max(0, n - 1))}
                disabled={i === 0}
                className="rounded px-2 py-1 text-[12px] text-white/60 transition-colors hover:text-white disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-[11px] text-white/40">
                {i + 1} / {pages.length}
              </span>
              <button
                type="button"
                onClick={() => (last ? onClose() : setI((n) => n + 1))}
                className="flex items-center gap-1.5 rounded px-2 py-1 text-[12px] font-medium text-white/80 transition-colors hover:text-white"
              >
                {last ? "Close" : "Next"}
                <span className="dlg-caret" aria-hidden>
                  ▾
                </span>
              </button>
            </>
          ) : (
            <>
              <span className="text-[11px] text-white/35">
                <kbd className="font-sans">Esc</kbd> to close
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded px-2 py-1 text-[12px] font-medium text-white/80 transition-colors hover:text-white"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
