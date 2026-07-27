import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, usePath } from "../lib/router";
import { useTheme } from "../lib/theme";
import { profile } from "../content";

const routes = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
];

/** useLayoutEffect warns during the build-time prerender; useEffect never runs there. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Nav() {
  const path = usePath();
  const { toggle } = useTheme();

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  // Measure the active link and park the indicator behind it. Layout effect so
  // the first paint already has it in the right place — no visible jump.
  useIsoLayoutEffect(() => {
    const active = itemRefs.current.get(path);
    const list = listRef.current;
    if (!active || !list) {
      setPill(null);
      return;
    }
    setPill({
      x: active.offsetLeft - list.offsetLeft,
      w: active.offsetWidth,
    });
  }, [path]);

  // Re-measure when the font swaps in or the viewport changes, both of which
  // move the links out from under the indicator.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const active = itemRefs.current.get(location.pathname);
      if (!active) return;
      setPill({ x: active.offsetLeft - list.offsetLeft, w: active.offsetWidth });
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-bg px-4 py-2 text-[13px] font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:z-60 focus:-translate-x-1/2 focus:ring-1 focus:ring-rule-strong"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="enter fixed top-3 left-1/2 z-50 -translate-x-1/2 sm:top-4"
        style={{ "--i": 0, "--lift": "-8px" } as React.CSSProperties}
      >
        {/* Padding tightens below `sm` so the pill clears a 320px viewport
            without clipping — it is centred by translate, so any overflow would
            be cut off symmetrically at both ends. */}
        <div className="flex items-center rounded-full border border-rule bg-[var(--glass)] p-1 shadow-[0_1px_2px_oklch(0.2_0.01_65/0.04),0_8px_24px_-12px_oklch(0.2_0.01_65/0.12)] backdrop-blur-xl backdrop-saturate-150 sm:gap-0.5">
          <div ref={listRef} className="relative flex items-center">
            {pill && (
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-full bg-sunken transition-[transform,width] duration-[320ms] ease-[var(--ease-out-quart)] motion-reduce:transition-none"
                style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
              />
            )}

            {routes.map((r) => {
              const active = path === r.href;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  ref={(el: HTMLAnchorElement | null) => {
                    if (el) itemRefs.current.set(r.href, el);
                    else itemRefs.current.delete(r.href);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-2 py-1.5 text-[12.5px] leading-none font-medium transition-colors duration-200 ease-[var(--ease-out-quart)] active:scale-[0.96] sm:px-3 sm:text-[13px] ${
                    active ? "text-ink" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {r.label}
                </Link>
              );
            })}
          </div>

          <span aria-hidden className="mx-0.5 h-4 w-px bg-rule sm:mx-1" />

          {profile.resume && (
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full px-2 py-1.5 text-[12.5px] leading-none font-medium text-ink-3 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:text-ink active:scale-[0.96] sm:px-3 sm:text-[13px]"
            >
              Résumé
            </a>
          )}

          <ThemeToggle onToggle={toggle} />
        </div>
      </nav>
    </>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function ThemeToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle dark mode"
      title="Toggle theme"
      className="grid size-7 shrink-0 place-items-center rounded-full text-ink-3 transition-[color,background-color,scale] duration-200 ease-[var(--ease-out-quart)] hover:bg-sunken hover:text-ink active:scale-[0.92] sm:size-8"
    >
      <span className="relative grid size-4 place-items-center">
        <svg {...iconProps} className="icon-sun size-4">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
        </svg>
        <svg {...iconProps} className="icon-moon size-4">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </span>
    </button>
  );
}
