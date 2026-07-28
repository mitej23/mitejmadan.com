import { useEffect, useRef, useState } from "react";
import { education, experience, stack, systems } from "../content";

/**
 * The Gen-3 style text box.
 *
 * Content is resolved here rather than in the engine, so `content.ts` stays the
 * single source of truth and never gets bundled into the lazily-loaded game
 * chunk. The engine only reports a topic string; this decides what that means.
 */

/** Keyword markers are for the web page, not for a text box. */
const plain = (s: string) => s.replace(/\*/g, "");

export type Page = { title: string; body: string };

export function pagesFor(topic: string): Page[] {
  switch (topic) {
    case "theagentic:role": {
      const r = experience[0];
      return [
        { title: r.company, body: `${r.title}\n${r.start} — ${r.end}` },
        ...r.points.map((p, i) => ({
          title: `${r.company} · ${i + 1}/${r.points.length}`,
          body: plain(p),
        })),
      ];
    }

    case "theagentic:systems":
      return [
        {
          title: "Systems",
          body: `${systems.length} systems built here. Client and product names are left out on purpose — what's kept is the sector, the architecture, and the engineering.`,
        },
        ...systems.flatMap((s, i) => [
          {
            title: `${i + 1}/${systems.length} · ${s.domain}`,
            body: `${s.title}\n\n${plain(s.body)}`,
          },
          {
            title: `${i + 1}/${systems.length} · what made it hard`,
            body: plain(s.hard),
          },
        ]),
      ];

    case "idigitize:role": {
      const r = experience[1];
      return [
        { title: r.company, body: `${r.title}\n${r.start} — ${r.end}` },
        ...r.points.map((p, i) => ({
          title: `${r.company} · ${i + 1}/${r.points.length}`,
          body: plain(p),
        })),
      ];
    }

    case "education:degrees":
      return education.map((d) => ({
        title: d.year,
        body: `${d.qualification}\n${d.institution}${d.detail ? `\n${d.detail}` : ""}`,
      }));

    case "education:stack":
      return [
        { title: "Stack", body: "What I actually build with." },
        ...stack.map((g) => ({ title: g.group, body: g.items.join(", ") })),
      ];

    default:
      return [{ title: "…", body: "Nothing to read here." }];
  }
}

export function Dialogue({
  pages,
  onClose,
}: {
  pages: Page[];
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const page = pages[i];
  const last = i >= pages.length - 1;

  const next = () => (last ? onClose() : setI((n) => n + 1));

  // The engine is paused while this is open, so we own the keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keys = [" ", "Enter", "e", "E", "Escape", "ArrowLeft", "ArrowRight"];
      if (!keys.includes(e.key)) return;

      // Consume it. This box is the innermost layer, and without stopping
      // propagation the outer Escape handler also fired and dropped the viewer
      // out of the whole overworld instead of just closing the text.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
      else next();
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
      onClick={next}
      className="absolute inset-x-0 bottom-0 z-10 cursor-pointer p-3 outline-none sm:p-5"
    >
      <div className="mx-auto max-w-[44rem] rounded-xl border-[3px] border-white/85 bg-[#1b2233]/95 px-5 py-4 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.8)] backdrop-blur">
        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.09em] text-white/50 uppercase">
          {page.title}
        </p>
        <p className="text-[14.5px] leading-[1.6] whitespace-pre-line text-white">
          {page.body}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-white/45">
          <span>
            {i + 1} / {pages.length}
          </span>
          <span className="flex items-center gap-1.5">
            {last ? "Close" : "Next"}
            {/* The blinking marker Gen 3 uses to say "there is more". */}
            <span className="dlg-caret" aria-hidden>
              ▾
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
