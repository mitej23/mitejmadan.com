import { useCallback, useEffect } from "react";

export type Theme = "light" | "dark";

const KEY = "theme";

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

/**
 * The active theme lives in one place only: `data-theme` on <html>, set before
 * first paint by the inline script in index.html.
 *
 * Deliberately no React state. Every themed pixel — including the toggle's own
 * icon — is driven by CSS off that attribute, which means the prerendered HTML
 * and the hydrated tree are identical, and flipping the theme costs zero
 * re-renders.
 */
export function useTheme() {
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode — the theme still applies for this session */
    }
  }, []);

  // Follow the OS, but only while the visitor hasn't made an explicit choice.
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (stored()) return;
      document.documentElement.dataset.theme = mq.matches ? "dark" : "light";
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { toggle };
}
