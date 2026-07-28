import { useCallback, useState } from "react";

/**
 * Fade-in state for an <img> that is safe under prerendering.
 *
 * The naive version — `opacity: 0` until `onLoad` — breaks on a prerendered
 * page: the markup ships with the image already in it, so the browser can
 * finish loading before React hydrates, and `load` has then already fired
 * against no listener. The image stays invisible forever.
 *
 * The ref callback closes that race by checking `complete` at attach time,
 * which is true for anything already loaded or served from cache.
 */
export function useImageLoaded() {
  const [loaded, setLoaded] = useState(false);

  const ref = useCallback((node: HTMLImageElement | null) => {
    // `naturalWidth` guards against a broken image, where `complete` is also true.
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  const onLoad = useCallback(() => setLoaded(true), []);

  return { loaded, ref, onLoad };
}
