import { Fragment } from "react";

/**
 * Renders a content string with `*marked*` terms as keyword emphasis.
 *
 * The marker is deliberately the lightest thing that could work: content.ts
 * stays plain readable prose, and there's no markdown parser in the bundle.
 * Only single-line, non-nested spans are supported, which is all the copy needs.
 *
 * Styling and the draw-in animation live in `.kw` (see index.css).
 */
export function Rich({ text }: { text: string }) {
  // Capturing split, so the delimiters survive in the output array.
  const parts = text.split(/(\*[^*\n]+\*)/g);

  return (
    <>
      {parts.map((part, i) =>
        part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className="kw">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
