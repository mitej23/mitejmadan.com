import {
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type Ref,
} from "react";

/**
 * ~50 lines instead of a routing library. Three routes do not justify 20KB of
 * matcher, loader, and data-router machinery.
 */

const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  addEventListener("popstate", fn);
  return () => {
    listeners.delete(fn);
    removeEventListener("popstate", fn);
  };
}

function snapshot() {
  return location.pathname;
}

/**
 * Which path the build-time prerender is currently rendering. Only ever set by
 * the SSR entry.
 */
let renderPath = "/";

export function setRenderPath(path: string) {
  renderPath = path;
}

/**
 * React calls this during client hydration as well as on the server, so it has to
 * return what the server actually rendered — not a server-only default.
 *
 * It used to return `renderPath` unconditionally, which is "/" in the browser
 * because only the SSR entry ever sets it. That made the first client render of
 * every prerendered sub-page believe it was on the home page: the nav marked the
 * wrong link current, the home-only hero rendered, hydration mismatched, and
 * React threw the prerendered tree away and rebuilt the document client-side.
 * The prerender was doing nothing for three of the four routes.
 *
 * In the browser the answer is just the URL the document was served at, which is
 * by construction the path it was prerendered for.
 */
function serverSnapshot() {
  return typeof document === "undefined" ? renderPath : location.pathname;
}

export function usePath(): string {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

export function navigate(to: string, replace = false) {
  if (to === location.pathname) return;
  history[replace ? "replaceState" : "pushState"](null, "", to);
  emit();
  // Match the browser's own behaviour on a real navigation. Instant rather than
  // smooth: a 600ms scroll animation on top of a route change reads as lag.
  scrollTo({ top: 0, behavior: "instant" });
}

/** Left-click, no modifier keys — otherwise let the browser do its thing. */
function isPlainClick(e: React.MouseEvent) {
  return (
    e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
  );
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /** React 19 passes ref through as an ordinary prop — no forwardRef needed. */
  ref?: Ref<HTMLAnchorElement>;
};

export function Link({ href, onClick, ...rest }: LinkProps) {
  const internal = href.startsWith("/") && !href.startsWith("//");

  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!internal || e.defaultPrevented || !isPlainClick(e)) return;
        e.preventDefault();
        navigate(href);
      }}
      {...(internal ? {} : { target: "_blank", rel: "noreferrer noopener" })}
      {...rest}
    />
  );
}
