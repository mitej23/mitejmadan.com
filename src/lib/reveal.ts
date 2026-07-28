/**
 * One IntersectionObserver for the whole document, shared by every `.reveal`
 * element. Reveals are one-shot: once an element has arrived it is unobserved,
 * so nothing re-animates on scroll-up and the observer empties itself out.
 */

let io: IntersectionObserver | null = null;

function get(): IntersectionObserver {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io!.unobserve(entry.target);
      }
    },
    // Fire once the element is a little way into view rather than the instant
    // its first pixel crosses the fold — otherwise the reveal finishes offscreen.
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );
  return io;
}

/**
 * Usable directly as a React 19 ref callback: accepts the null React passes on
 * detach, and returns a cleanup React calls on unmount.
 */
export function observeReveal(el: Element | null): () => void {
  if (!el) return () => {};

  // No observer support, or motion suppressed: show the content, full stop.
  if (
    typeof IntersectionObserver === "undefined" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    el.classList.add("is-in");
    return () => {};
  }

  const obs = get();
  obs.observe(el);
  return () => obs.unobserve(el);
}
