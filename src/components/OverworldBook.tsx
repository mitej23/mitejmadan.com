import { useEffect, useRef, useState } from "react";
import { education, experience, stack, systems } from "../content";

/**
 * The reading book.
 *
 * Replaces the side panel: shelf content now opens as an actual book, which is
 * both more in keeping with the overworld and stops the reading surface competing
 * with the room for the right-hand third of the screen.
 *
 * The frame is pixel art (Crusenho's Complete UI Book Styles Pack — see
 * CREDITS.md; attribution is a licence condition). The text on top is real DOM,
 * so it stays selectable, scalable and readable by a screen reader — the sprite
 * supplies the furniture, not the content.
 *
 * Geometry comes from the sprites, not from taste: the cover is 224x160 and the
 * two pages are 104x147 each, which lay out with an even 8px side margin and a
 * 6px top margin. Every offset below is that arithmetic expressed as a
 * percentage, so the whole thing scales to any size and stays aligned.
 */

const COVER_W = 224;
const COVER_H = 160;
const PAGE_W = 104;
const PAGE_H = 147;
const PAGE_X = 8;
const PAGE_Y = 6;

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

const pageBox = (side: "left" | "right") => ({
  top: pct(PAGE_Y, COVER_H),
  height: pct(PAGE_H, COVER_H),
  width: pct(PAGE_W, COVER_W),
  left: pct(side === "left" ? PAGE_X : PAGE_X + PAGE_W, COVER_W),
});

/** Keyword markers are for the web page, not for this book. */
const plain = (s: string) => s.replace(/\*/g, "");

export type Spread = {
  /** Small line above the heading, on the left page. */
  kicker?: string;
  title: string;
  /** Lead paragraph, left page. */
  body?: string;
  /** Bulleted detail, right page. */
  items?: string[];
  /** Set apart under a rule on the right page. */
  aside?: { label: string; text: string }[];
  /** Chips at the foot of the right page. */
  tags?: string[];
};

export function spreadsFor(topic: string): Spread[] {
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
          body: "Names left out on purpose. What's kept is the sector, the architecture, and the engineering.",
          items: systems.map((s) => `${s.domain} — ${s.title}`),
        },
        ...systems.map((s, i) => ({
          kicker: `${i + 1} of ${systems.length} · ${s.domain}`,
          title: s.title,
          body: plain(s.body),
          aside: s.role ? [{ label: "Scope", text: plain(s.role) }] : undefined,
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
          aside: stack.map((g) => ({ label: g.group, text: g.items.join(", ") })),
        },
      ];

    default:
      return [{ title: "…", body: "Nothing to read here." }];
  }
}

export function Book({ spreads, onClose }: { spreads: Spread[]; onClose: () => void }) {
  const [i, setI] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  /** Drives the page-turn flash; keyed so each turn replays it. */
  const [turn, setTurn] = useState(0);

  const spread = spreads[i];
  const last = i >= spreads.length - 1;
  const many = spreads.length > 1;

  const go = (n: number) => {
    const next = Math.max(0, Math.min(spreads.length - 1, n));
    if (next === i) return;
    setI(next);
    setTurn((t) => t + 1);
  };

  useEffect(() => {
    leftRef.current?.scrollTo({ top: 0 });
  }, [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keys = [" ", "Enter", "e", "E", "Escape", "ArrowLeft", "ArrowRight"];
      if (!keys.includes(e.key)) return;

      // The book is the innermost layer, so it consumes what it handles —
      // otherwise the outer Escape handler also fires and leaves the overworld
      // entirely instead of just shutting the book.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(i - 1);
      else if (last && e.key !== "ArrowRight") onClose();
      else go(i + 1);
    };
    addEventListener("keydown", onKey, { capture: true });
    return () => removeEventListener("keydown", onKey, { capture: true });
  });

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  return (
    <div
      className="ow-ui absolute inset-0 z-30 grid place-items-center bg-black/55 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-label={spread.title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="ow-book relative w-full max-w-[54rem] outline-none"
        style={{ aspectRatio: `${COVER_W} / ${COVER_H}` }}
      >
        {/* The bound cover, with the two pages inset on top of it. */}
        <img src="/game/book/cover.png" alt="" aria-hidden className="ow-px absolute inset-0 size-full" />

        {(["left", "right"] as const).map((side) => (
          <img
            key={side}
            src={`/game/book/page-${side}.png`}
            alt=""
            aria-hidden
            className="ow-px absolute"
            style={pageBox(side)}
          />
        ))}

        {/*
          One text column set spanning both pages rather than two independent
          boxes. CSS columns put the gutter exactly where the spine is, so prose
          runs left page then right page the way a book actually reads — the
          previous version left the right page empty while the left overflowed.
        */}
        <div
          key={turn}
          ref={leftRef}
          className="ow-page absolute overflow-y-auto"
          style={{
            left: pct(PAGE_X, COVER_W),
            width: pct(PAGE_W * 2, COVER_W),
            top: pct(PAGE_Y, COVER_H),
            height: pct(PAGE_H, COVER_H),
            padding: "6% 5% 9%",
            columnCount: 2,
            columnGap: "9%",
            // `balance` splits the prose itself across the spine so both pages
            // carry text; `auto` filled the left page and left the right nearly
            // empty, which read as a layout bug rather than a book.
            columnFill: "balance",
          }}
        >
          {spread.kicker && (
            <p className="mb-2 text-[11px] leading-none tracking-[0.12em] text-[var(--bk-ink-3)] uppercase">
              {spread.kicker}
            </p>
          )}

          <h2 className="text-[17px] leading-[1.35] text-[var(--bk-ink)]">{spread.title}</h2>

          {spread.body && (
            <p className="ow-prose mt-3 whitespace-pre-line text-[var(--bk-ink-2)]">
              {spread.body}
            </p>
          )}

          {spread.items && (
            <ul className="mt-3 flex flex-col gap-2.5">
              {spread.items.map((it) => (
                <li
                  key={it}
                  className="ow-prose relative pl-4 text-[var(--bk-ink-2)] before:absolute before:top-[0.75em] before:left-0 before:size-[3px] before:bg-[var(--bk-ink-3)]"
                >
                  {it}
                </li>
              ))}
            </ul>
          )}

          {spread.aside?.map((a) => (
            <div key={a.label} className="mt-4 border-l-2 border-[var(--bk-rule)] pl-3.5">
              <p className="mb-1 text-[11px] leading-none tracking-[0.12em] text-[var(--bk-ink-3)] uppercase">
                {a.label}
              </p>
              <p className="ow-prose whitespace-pre-line text-[var(--bk-ink-2)]">{a.text}</p>
            </div>
          ))}

          {spread.tags && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {spread.tags.map((t) => (
                <li
                  key={t}
                  className="border border-[var(--bk-rule)] px-1.5 py-0.5 text-[12px] text-[var(--bk-ink-2)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Controls sit on the cover margin, clear of the paper. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close book"
          className="absolute -top-3 -right-3 grid size-9 place-items-center border-2 border-[var(--bk-edge)] bg-[var(--bk-paper)] text-[var(--bk-ink)] transition-transform hover:scale-105 active:scale-95"
        >
          <span aria-hidden className="text-[15px] leading-none">
            ×
          </span>
        </button>

        {many && (
          <div className="absolute -bottom-12 inset-x-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(i - 1)}
              disabled={i === 0}
              aria-label="Previous page"
              className="grid size-9 place-items-center border-2 border-[var(--bk-edge)] bg-[var(--bk-paper)] text-[15px] text-[var(--bk-ink)] transition-colors hover:bg-[var(--bk-paper-2)] disabled:opacity-30"
            >
              ←
            </button>
            <span className="text-[12px] tracking-[0.1em] text-white/70 tabular-nums">
              {i + 1} / {spreads.length}
            </span>
            <button
              type="button"
              onClick={() => (last ? onClose() : go(i + 1))}
              aria-label={last ? "Close book" : "Next page"}
              className="grid size-9 place-items-center border-2 border-[var(--bk-edge)] bg-[var(--bk-paper)] text-[15px] text-[var(--bk-ink)] transition-colors hover:bg-[var(--bk-paper-2)]"
            >
              {last ? "×" : "→"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
