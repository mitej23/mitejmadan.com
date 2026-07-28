import { useCallback, useEffect, useRef, useState } from "react";
import type { GameHandle } from "../game/mount";
import { Dialogue, pagesFor, type Page } from "./OverworldDialogue";

/**
 * The pipe, the transition, and the host the overworld mounts into.
 *
 * Everything here is small and stays in the main bundle. The engine does not:
 * it arrives through a dynamic import() the moment the pipe is used, so a
 * visitor who never plays pays only for this file.
 *
 * Pixelation is done in discrete steps rather than a smooth ramp. CSS cannot
 * animate SVG filter primitive attributes, and driving them per-frame from JS
 * forces a repaint of the whole filtered subtree. Four fixed filters swapped on
 * a timer is cheaper, and a stepped ramp is truer to the era anyway.
 *
 * The filter targets #site, not <html>: Chromium reports a computed filter on the
 * root element but never paints it. That cost a debugging pass — the CSS looked
 * correct and applied, and nothing happened.
 */

type Phase = "idle" | "pixelating" | "wiping" | "playing" | "leaving";

const PIXEL_STEPS = 4;
const STEP_MS = 110;
const WIPE_MS = 460;

function prefersReducedMotion() {
  return (
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Overworld() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pixelStep, setPixelStep] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  /** Name of the room you are standing in, or "" for the town. */
  const [place, setPlace] = useState("");
  /** Non-null while a text box is open; the engine is paused for its lifetime. */
  const [pages, setPages] = useState<Page[] | null>(null);
  /** Set when something readable is in front of the player. */
  const [near, setNear] = useState<string | null>(null);

  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameHandle | null>(null);
  const modRef = useRef<{
    mountGame: (
      el: HTMLElement,
      opts: {
        onLeave?: () => void;
        onEnter?: (name: string) => void;
        onRead?: (topic: string) => void;
        onNear?: (topic: string | null) => void;
      },
    ) => Promise<GameHandle>;
  } | null>(null);
  const timers = useRef<number[]>([]);
  /** Where the reader was, so leaving puts them back rather than at the top. */
  const scrollY = useRef(0);
  const returnFocus = useRef<HTMLElement | null>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const exit = useCallback(() => {
    clearTimers();
    gameRef.current?.destroy();
    gameRef.current = null;
    setPhase("idle");
    setPixelStep(0);
    setSlow(false);
    setPlace("");
    setPages(null);
    setNear(null);
    document.documentElement.classList.remove("ow-lock");
    // Restore the reading position and the focus ring we took.
    requestAnimationFrame(() => {
      scrollTo({ top: scrollY.current, behavior: "instant" });
      returnFocus.current?.focus();
    });
  }, []);

  const enter = useCallback(async () => {
    if (phase !== "idle") return;

    scrollY.current = window.scrollY;
    returnFocus.current = document.activeElement as HTMLElement | null;

    const reduced = prefersReducedMotion();

    // Fetch the engine immediately, so the transition is cover for the download
    // rather than a delay bolted in front of it.
    const loading = import("../game/mount").catch((e: unknown) => {
      console.error(e);
      return null;
    });

    // Wait for the pixelate to finish AND the module to arrive before wiping to
    // black. Wiping on a fixed timer meant a slow chunk left the viewer staring
    // at a black overlay for however long the network took — the transition has
    // to be the slower of the two, not the faster.
    let holdSlow: number | undefined;
    if (reduced) {
      setPixelStep(0);
    } else {
      setPhase("pixelating");
      for (let i = 1; i <= PIXEL_STEPS; i++) {
        after(i * STEP_MS, () => setPixelStep(i));
      }
      // If the wait runs long, say so instead of looking frozen.
      holdSlow = window.setTimeout(() => setSlow(true), 1200);
      timers.current.push(holdSlow);
    }

    const settle = reduced
      ? Promise.resolve()
      : new Promise<void>((r) => after(PIXEL_STEPS * STEP_MS + 40, r));

    const [mod] = await Promise.all([loading, settle]);

    clearTimeout(holdSlow);
    setSlow(false);

    if (!mod) {
      setLoadFailed(true);
      exit();
      return;
    }

    modRef.current = mod;
    setPhase("wiping");
    after(reduced ? 0 : WIPE_MS, () => setPhase("playing"));
  }, [phase, exit]);

  /**
   * Mount from an effect rather than a rAF after setState: effects run after
   * React has committed, so hostRef is guaranteed to exist. The previous version
   * bailed out silently when the ref was null, which left the overlay up and the
   * game unmounted with nothing logged — a black screen and no error.
   */
  useEffect(() => {
    if (phase !== "playing") return;
    const host = hostRef.current;
    const mod = modRef.current;
    if (!host || !mod) {
      setLoadFailed(true);
      exit();
      return;
    }

    let cancelled = false;
    document.documentElement.classList.add("ow-lock");

    mod
      .mountGame(host, {
        // Walking south out of the town gate leaves, which is the second exit
        // the design needs: one you find by playing, not by reading the UI.
        onLeave: () => exit(),
        onEnter: (name: string) => setPlace(name),
        onRead: (topic: string) => setPages(pagesFor(topic)),
        onNear: (topic: string | null) => setNear(topic),
      })
      .then((handle) => {
        if (cancelled) {
          handle.destroy();
          return;
        }
        gameRef.current = handle;
        host.focus();
      })
      .catch((e: unknown) => {
        console.error(e);
        if (cancelled) return;
        setLoadFailed(true);
        exit();
      });

    return () => {
      cancelled = true;
    };
  }, [phase, exit]);

  useEffect(() => {
    gameRef.current?.setPaused(pages !== null);
  }, [pages]);

  // Escape always leaves. The game must never be something you get stuck in.
  useEffect(() => {
    if (phase === "idle") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      // A dialogue is the innermost layer, so it consumes Escape first.
      if (pages) {
        setPages(null);
        return;
      }
      exit();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [phase, exit, pages]);

  useEffect(() => () => {
    clearTimers();
    gameRef.current?.destroy();
    document.documentElement.classList.remove("ow-lock");
  }, []);

  const pixelating = phase === "pixelating" && pixelStep > 0;

  return (
    <>
      <PixelateDefs />

      {pixelating && (
        <style>{`#site { filter: url(#ow-px-${pixelStep}); }`}</style>
      )}

      {phase === "wiping" && <TileWipe />}

      {slow && (
        <p
          role="status"
          className="fixed inset-x-0 top-1/2 z-70 text-center text-[13px] font-medium text-ink-2"
        >
          Loading overworld…
        </p>
      )}

      {phase === "playing" && (
        <div className="fixed inset-0 z-70 bg-[#0b0b0a]">
          <div
            ref={hostRef}
            tabIndex={-1}
            aria-label="Overworld mode. Arrow keys or W A S D to walk. Escape to leave."
            className={`h-full outline-none transition-[width] duration-300 ease-[var(--ease-out-quart)] motion-reduce:transition-none ${
              pages ? "w-full sm:w-[calc(100%-24rem)]" : "w-full"
            }`}
          />
          {place && (
            <p className={`pointer-events-none absolute top-5 text-center text-[13px] font-semibold tracking-[0.06em] text-white/85 uppercase drop-shadow transition-[right] ${pages ? "left-0 right-0 sm:right-[24rem]" : "inset-x-0"}`}>
              {place}
            </p>
          )}

          {pages && <Dialogue pages={pages} onClose={() => setPages(null)} />}

          {near && !pages && (
            <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center text-[12.5px] font-medium text-white/80">
              Press <kbd className="font-sans">Space</kbd> to read
            </p>
          )}

          {/* No button down here any more: it sat directly over the south gate,
              which is the way out. Walk through the gate, or use Esc / the × . */}
          <div className={`pointer-events-none absolute bottom-3 flex flex-col items-center gap-1 transition-[right] ${pages ? "left-0 right-0 sm:right-[24rem]" : "inset-x-0"}`}>
            <p className="text-center text-[11.5px] text-white/40">
              Arrows / WASD to walk · <kbd className="font-sans">Space</kbd> to read ·
              walk out the south gate to leave
            </p>
            <p className="text-center text-[10.5px] text-white/25">
              Tiles by{" "}
              <a
                href="https://axulart.itch.io/axularts-basic-top-down-interior"
                target="_blank"
                rel="noreferrer noopener"
                className="pointer-events-auto underline decoration-white/25 hover:text-white/50"
              >
                AxulArt
              </a>{" "}
              (CC BY 4.0) · Pocket Creature Tamer
            </p>
          </div>
          {/* The labelled control lives at the bottom centre; this is just a
              close affordance in the corner, so the two don't read as duplicates. */}
          <button
            type="button"
            onClick={exit}
            aria-label="Back to résumé"
            title="Back to résumé (Esc)"
            className={`absolute top-4 z-20 grid size-9 place-items-center rounded-full bg-white/10 text-white/70 backdrop-blur transition-[background-color,color,right] hover:bg-white/20 hover:text-white ${pages ? "right-4 sm:right-[25rem]" : "right-4"}`}
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* A real labelled button, not a hidden easter egg — otherwise nobody who
          can't see it will ever find it, and most people won't either.

          Hidden below `sm` for two reasons: it collides with the centred nav pill
          at 320-375px, and there are no touch controls yet, so on a phone it would
          open something you cannot play. Revisit when the D-pad lands. */}
      <button
        type="button"
        onClick={enter}
        disabled={phase !== "idle"}
        aria-label="Enter overworld mode — a walkable pixel version of this site"
        title="Enter the pipe"
        className="no-print group fixed top-3 right-3 z-50 hidden size-11 place-items-center sm:grid rounded-xl transition-[scale] duration-200 ease-[var(--ease-out-quart)] hover:scale-105 active:scale-95 disabled:pointer-events-none sm:top-4 sm:right-4"
      >
        <Pipe />
        <span className="sr-only">Enter overworld mode</span>
      </button>

      {loadFailed && (
        <p
          role="status"
          className="fixed bottom-4 left-1/2 z-70 -translate-x-1/2 rounded-full border border-rule bg-bg px-4 py-2 text-[12.5px] text-ink-2 shadow-lg"
        >
          Couldn't load overworld mode.
        </p>
      )}
    </>
  );
}

/** A Mario pipe, drawn rather than imported — it's a dozen rects. */
function Pipe() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-9 [image-rendering:pixelated]">
      <g shapeRendering="crispEdges">
        <rect x="1" y="3" width="14" height="4" fill="#3aa34a" />
        <rect x="1" y="3" width="14" height="1" fill="#7fd88a" />
        <rect x="1" y="6" width="14" height="1" fill="#1d6b2b" />
        <rect x="3" y="7" width="10" height="9" fill="#3aa34a" />
        <rect x="3" y="7" width="2" height="9" fill="#7fd88a" />
        <rect x="11" y="7" width="2" height="9" fill="#1d6b2b" />
        <rect x="5" y="4" width="6" height="2" fill="#14251a" />
      </g>
    </svg>
  );
}

/**
 * The scene change. A radial stagger of squares, which is how the real games do
 * it — and cheap, because each cell is one transform with a delay rather than
 * anything JS drives per frame.
 */
function TileWipe() {
  const [cells] = useState(() => {
    const size = 64;
    const cols = Math.ceil(innerWidth / size);
    const rows = Math.ceil(innerHeight / size);
    // Stagger from the pipe's corner outward, so the page collapses toward it.
    const originX = cols - 1;
    const originY = 0;
    const max = Math.hypot(cols, rows) || 1;
    return Array.from({ length: cols * rows }, (_, i) => {
      const x = i % cols;
      const y = Math.floor(i / cols);
      const d = Math.hypot(x - originX, y - originY) / max;
      return { delay: Math.round(d * 320) };
    }).map((c, i) => ({ ...c, key: i, size, cols }));
  });

  const cols = cells[0]?.cols ?? 1;
  const size = cells[0]?.size ?? 64;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-60 grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridAutoRows: `${size}px`,
      }}
    >
      {cells.map((c) => (
        <span
          key={c.key}
          className="ow-cell bg-[#0b0b0a]"
          style={{ animationDelay: `${c.delay}ms` }}
        />
      ))}
    </div>
  );
}

/** Four fixed pixelation levels. `feTile` samples one pixel per block, `feMorphology` fills it. */
function PixelateDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        {[2, 4, 8, 14].map((n, i) => (
          <filter
            key={n}
            id={`ow-px-${i + 1}`}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feFlood x={n / 2} y={n / 2} width="1" height="1" />
            <feComposite width={n} height={n} />
            <feTile result="grid" />
            <feComposite in="SourceGraphic" in2="grid" operator="in" />
            <feMorphology operator="dilate" radius={n / 2} />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
