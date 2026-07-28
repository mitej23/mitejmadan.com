import { useEffect, useState } from "react";
import { usePath } from "../lib/router";

/**
 * Pixel mode: the whole résumé, re-set as if it were running on the handheld.
 *
 * This started as a 250px lens that followed the cursor, and that idea does not
 * survive contact with the medium. Two findings killed it:
 *
 *  - An SVG pixelate filter samples one pixel per block and dilates it. Text is
 *    thin dark strokes on a light ground, so each block lands on a stroke or a gap
 *    more or less at random — the result is smeared noise, not blockiness. And it
 *    cost 26ms a frame at a 250px radius, against a 16.7ms floor.
 *  - A genuine mosaic (rasterise, downscale, upscale with nearest-neighbour) does
 *    produce real blocks, but a block big enough to read as pixel art makes 14px
 *    body text two or three blocks tall. Unreadable. That is geometry, not a bug
 *    in the implementation — legible prose and visible mosaic cannot coexist.
 *
 * So the effect is not a filter over the type; it is the type. The two pixel faces
 * the overworld already ships do the work, which is why this costs no new bytes and
 * no per-frame anything: one attribute on <html>, and the rest is CSS. Going
 * full-screen also removes the lens's real defect — a partial aperture reflows the
 * text inside it and stops lining up with the page around it.
 */

const KEY = "pixel-mode";

/** Target block size in CSS pixels. Blocks stay this big whatever the photo's size. */
const BLOCK = 5;

/**
 * Photographs get a real mosaic, and they are the only thing here that does.
 *
 * `image-rendering: pixelated` on its own does nothing to these: it changes how a
 * raster is *upscaled*, and every photo on the site renders at or below its natural
 * size. So the source has to actually be reduced — draw the loaded image into a
 * small canvas, hand that back as the src, and let the same CSS blow it up with
 * nearest-neighbour sampling.
 *
 * A mosaic ruins prose but suits a photograph: a picture survives losing detail and
 * stays recognisable, which is exactly why the text is re-set in a pixel face
 * instead of being pixelated the same way.
 *
 * `srcset` has to go with it — left in place the browser picks a candidate from
 * there and ignores the src entirely. Originals are parked on the dataset so
 * switching back is exact rather than reconstructed.
 */
function mosaic(img: HTMLImageElement) {
  if (img.dataset.pxlDone === "1") return;
  const rect = img.getBoundingClientRect();
  const w = Math.round(rect.width), h = Math.round(rect.height);
  if (!img.complete || !img.naturalWidth || w < 16 || h < 16) return;

  const cols = Math.max(12, Math.round(w / BLOCK));
  const rows = Math.max(12, Math.round((cols * h) / w));

  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d");
  if (!ctx) return;
  // Downscaling *is* the pixelation: the browser box-filters as it draws, which is
  // the averaging step an SVG filter cannot do.
  ctx.drawImage(img, 0, 0, cols, rows);

  let url: string;
  try {
    url = c.toDataURL("image/png");
  } catch {
    return; // A cross-origin image would taint the canvas; leave it alone.
  }

  img.dataset.pxlSrc = img.getAttribute("src") ?? "";
  img.dataset.pxlSrcset = img.getAttribute("srcset") ?? "";
  img.dataset.pxlSizes = img.getAttribute("sizes") ?? "";
  img.dataset.pxlDone = "1";
  img.dataset.pxlW = String(cols);
  img.removeAttribute("srcset");
  img.removeAttribute("sizes");
  img.src = url;
}

function unmosaic(img: HTMLImageElement) {
  if (img.dataset.pxlDone !== "1") return;
  const { pxlSrc = "", pxlSrcset = "", pxlSizes = "" } = img.dataset;
  if (pxlSrcset) img.setAttribute("srcset", pxlSrcset);
  if (pxlSizes) img.setAttribute("sizes", pxlSizes);
  if (pxlSrc) img.setAttribute("src", pxlSrc);
  delete img.dataset.pxlDone;
  delete img.dataset.pxlW;
  delete img.dataset.pxlSrc;
  delete img.dataset.pxlSrcset;
  delete img.dataset.pxlSizes;
}

const eachImage = (fn: (img: HTMLImageElement) => void) =>
  document.querySelectorAll<HTMLImageElement>("#main img").forEach(fn);

function apply(on: boolean) {
  document.documentElement.dataset.pixel = on ? "on" : "off";
}

export function PixelMode() {
  // A route change swaps #main out, bringing a fresh set of <img> elements.
  const path = usePath();
  const [on, setOn] = useState(false);

  // The inline head script has already set the attribute from storage before first
  // paint, so this only syncs React's copy of the state. Reading storage during
  // render would put the prerendered markup at odds with hydration.
  useEffect(() => {
    setOn(document.documentElement.dataset.pixel === "on");
  }, []);

  // Photographs are reduced for real, so this has to run whenever the set of images
  // changes: a new route, or one that finished loading after the switch was thrown.
  useEffect(() => {
    if (!on) {
      eachImage(unmosaic);
      return;
    }
    // Measured a frame late, deliberately. Reading the box in the same tick as the
    // switch can catch a mid-layout width, and since the block size is derived from
    // it, that showed up as the mosaic being twice as coarse on some runs as others.
    let raf = requestAnimationFrame(() => eachImage(mosaic));

    const onLoad = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLImageElement) mosaic(t);
    };
    // Capture phase: `load` on an <img> does not bubble.
    document.addEventListener("load", onLoad, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("load", onLoad, true);
    };
  }, [on, path]);

  const toggle = () => {
    setOn((v) => {
      const next = !v;
      apply(next);
      try {
        localStorage.setItem(KEY, next ? "on" : "off");
      } catch {
        /* private mode, or storage disabled */
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      title={on ? "Back to normal type" : "See this résumé in pixels"}
      className="pxl-switch no-print fixed right-4 bottom-4 z-40 inline-flex items-center gap-2.5 rounded-full border border-rule bg-[var(--glass)] py-2 pr-2 pl-3 text-[12.5px] leading-none font-medium text-ink-3 shadow-[0_1px_2px_oklch(0.2_0.01_65/0.04),0_8px_24px_-12px_oklch(0.2_0.01_65/0.12)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:text-ink active:scale-[0.97] sm:right-6 sm:bottom-6"
    >
      <PixelGlyph />
      Pixels
      {/* The track is decoration; the button itself carries the switch semantics,
          so this is hidden from assistive tech rather than described twice. */}
      <span aria-hidden className="pxl-track">
        <span className="pxl-knob" />
      </span>
    </button>
  );
}

/** A checker that reads as "pixels" at 14px, drawn rather than imported. */
function PixelGlyph() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden className="size-3.5 shrink-0">
      {[
        [0, 0],
        [2, 2],
        [4, 0],
        [6, 2],
        [0, 4],
        [2, 6],
        [4, 4],
        [6, 6],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill="currentColor" />
      ))}
    </svg>
  );
}
