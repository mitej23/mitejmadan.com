import { photos } from "../content";
import { Link } from "../lib/router";
import { useImageLoaded } from "../lib/useImageLoaded";

/** Three frames chosen to differ from each other: cold, warm, green. */
const FEATURED = ["fog-trees", "longtail-sunbeams", "valley-tree"];

/**
 * A contact-sheet row on the home page that opens the gallery. Deliberately
 * small — it is a pointer to /photos, not a second gallery, so the frames are
 * uniform crops rather than the real proportions they get on their own page.
 */
export function PhotoStrip() {
  const picks = FEATURED.map((s) => photos.find((p) => p.slug === s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <Link
      href="/photos"
      aria-label={`Photos — ${photos.length} frames`}
      className="group block"
    >
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {picks.map((p) => (
          <Thumb key={p.slug} slug={p.slug} lqip={p.lqip} alt={p.alt} />
        ))}
      </ul>

      <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-2 transition-colors duration-200 ease-[var(--ease-out-quart)] group-hover:text-accent">
        All {photos.length} photos
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="size-3.5 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

function Thumb({ slug, lqip, alt }: { slug: string; lqip: string; alt: string }) {
  const { loaded, ref, onLoad } = useImageLoaded();

  return (
    <li
      className="overflow-hidden rounded-lg bg-cover bg-center ring-1 ring-rule"
      style={{ backgroundImage: `url("${lqip}")`, aspectRatio: "4 / 5" }}
    >
      <img
        src={`/photos/${slug}-500.webp`}
        width={400}
        height={500}
        alt={alt}
        loading="lazy"
        decoding="async"
        ref={ref}
        onLoad={onLoad}
        className="size-full object-cover transition-[opacity,scale] duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03] motion-reduce:transition-none"
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </li>
  );
}
