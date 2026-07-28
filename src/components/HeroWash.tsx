import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

/**
 * A slow wash of colour across the top of the page, in the site's own palette.
 *
 * Full-bleed on purpose: constrained to the text column it reads as a stray
 * rectangle, because a soft gradient with hard left and right edges looks like
 * a mistake. It spans the viewport and is masked to nothing on every edge.
 *
 * Constraints it has to respect to earn its ~8KB:
 *  - Decoration, so it must never block anything. It mounts a frame after
 *    hydration and fades in; before that the area is plain page background,
 *    which is what it dissolves into anyway, so nothing looks missing.
 *  - Frozen (speed 0) under `prefers-reduced-motion` — static colour, no motion.
 *  - Bounded by contrast, not taste: ink-3 clears WCAG AA on the page background
 *    by only 4.72:1, so the wash may not darken what sits behind it by much.
 *    At 0.3 opacity with these tones the worst composite still measures 4.6:1.
 *    Darkening either the palette or the opacity will break that — check before
 *    changing them.
 */
export function HeroWash() {
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    setStill(motion.matches);
    const onMotion = () => setStill(motion.matches);
    motion.addEventListener("change", onMotion);

    // The theme lives on <html>; watch it so the wash re-tints on toggle.
    const root = document.documentElement;
    const sync = () => setDark(root.dataset.theme === "dark");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      motion.removeEventListener("change", onMotion);
      obs.disconnect();
      cancelAnimationFrame(id);
    };
  }, []);

  const mask =
    "radial-gradient(120% 100% at 50% 0%, black 0%, black 35%, transparent 78%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] overflow-hidden transition-opacity duration-[1400ms] ease-[var(--ease-out-quart)] motion-reduce:transition-none"
      style={{
        opacity: ready ? (dark ? 0.4 : 0.3) : 0,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {ready && (
        <MeshGradient
          className="size-full"
          colors={
            dark
              ? ["#0f0e0d", "#2a1d16", "#3a2418", "#141210"]
              : ["#faf9f7", "#f8f1ea", "#f4e9de", "#fbf7f3"]
          }
          distortion={0.9}
          swirl={0.3}
          speed={still ? 0 : 0.1}
        />
      )}
    </div>
  );
}
