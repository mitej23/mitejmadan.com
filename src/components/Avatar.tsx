import { profile } from "../content";

/**
 * Photo if there is one, otherwise a drawn monogram. The fallback isn't a
 * placeholder — it's a designed mark, so shipping without a photo costs nothing
 * visually and costs one fewer network request.
 */
export function Avatar() {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  if (profile.avatar) {
    return (
      <img
        src={profile.avatar}
        alt={profile.name}
        width={52}
        height={52}
        decoding="async"
        fetchPriority="high"
        className="size-[52px] rounded-full object-cover ring-1 ring-rule"
      />
    );
  }

  // A full ember ring rather than a decorative arc: at 52px an arc reads as a
  // rendering artifact, a complete ring reads as a deliberate mark.
  return (
    <span
      aria-hidden
      className="grid size-[52px] place-items-center rounded-full bg-accent-soft ring-1 ring-accent/25 select-none"
    >
      <span className="text-[16px] leading-none font-semibold tracking-[-0.03em] text-accent">
        {initials}
      </span>
    </span>
  );
}
