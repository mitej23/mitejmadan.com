import { photos, type Photo } from "../content";
import { observeReveal } from "../lib/reveal";
import { useImageLoaded } from "../lib/useImageLoaded";

/**
 * Two hand-assigned columns rather than CSS `columns`.
 *
 * CSS multi-column fills top-to-bottom per column and rebalances on its own,
 * which put the two near-identical sunbeam frames directly beside each other.
 * Assigning each frame a column in content.ts is the only way to actually
 * control what sits next to what. Columns are balanced by total aspect height
 * (4.22 vs 3.67), so neither runs much longer than the other.
 *
 * Below `sm` the two columns stack, so the reading order is column one then
 * column two — which still keeps the two sunbeam frames far apart.
 */
export function PhotoGrid() {
  const columns = [photos.filter((p) => p.col === 0), photos.filter((p) => p.col === 1)];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      {columns.map((column, c) => (
        <div key={c} className="flex flex-1 flex-col gap-3 sm:gap-4">
          {column.map((p, i) => (
            <PhotoTile key={p.slug} photo={p} i={i} />
          ))}
        </div>
      ))}
    </div>
  );
}

function PhotoTile({ photo, i }: { photo: Photo; i: number }) {
  const { loaded, ref, onLoad } = useImageLoaded();

  return (
    <figure
      ref={observeReveal}
      className="reveal"
      // Stagger is capped: past a few steps the delay stops reading as
      // choreography and starts reading as the page being slow.
      style={{ "--i": Math.min(i, 3), "--lift": "14px" } as React.CSSProperties}
    >
      <div
        className="overflow-hidden rounded-lg bg-cover bg-center ring-1 ring-rule"
        style={{
          backgroundImage: `url("${photo.lqip}")`,
          aspectRatio: `${photo.w} / ${photo.h}`,
        }}
      >
        <img
          src={`/photos/${photo.slug}-1000.webp`}
          srcSet={`/photos/${photo.slug}-500.webp 500w, /photos/${photo.slug}-1000.webp 1000w`}
          sizes="(min-width: 640px) 25rem, calc(100vw - 2.5rem)"
          width={photo.w}
          height={photo.h}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          ref={ref}
          onLoad={onLoad}
          className="size-full object-cover transition-opacity duration-500 ease-[var(--ease-out-quart)] motion-reduce:transition-none"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>
    </figure>
  );
}
