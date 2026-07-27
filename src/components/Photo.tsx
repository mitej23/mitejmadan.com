import { useState } from "react";
import { photo } from "../content";

/**
 * The single photograph on the site.
 *
 * The LQIP sits behind the real image as a scaled-up background, so the frame is
 * filled with the right colours from the first paint — including before any JS
 * runs, since the data URI is in the prerendered HTML. The real file fades over
 * it on decode; `onLoad` also fires for images already in the browser cache, so
 * a repeat visit doesn't sit at the placeholder.
 *
 * `width`/`height` are set on the element to reserve the aspect ratio and keep
 * the layout from shifting when it lands.
 */
export function Photo({ className = "" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className={className}>
      <div
        className="relative overflow-hidden rounded-xl bg-cover bg-center ring-1 ring-rule"
        style={{ backgroundImage: `url("${photo.lqip}")`, aspectRatio: "1 / 1" }}
      >
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 640px) 17rem, calc(100vw - 2.5rem)"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="size-full object-cover transition-opacity duration-500 ease-[var(--ease-out-quart)] motion-reduce:transition-none"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>

      <figcaption className="mt-2.5 flex items-center gap-1.5 text-[12px] text-ink-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="size-3 shrink-0"
        >
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
        {photo.caption}
      </figcaption>
    </figure>
  );
}
