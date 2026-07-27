import { Link } from "../lib/router";
import { PageHead } from "../components/PageHead";

export function NotFound() {
  return (
    <>
      <PageHead
        title="Nothing here"
        lede="That URL doesn't exist — or it did once and I moved it."
      />
      <p className="enter mt-6 text-[14px]" style={{ "--i": 3 } as React.CSSProperties}>
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 font-medium text-ink-2 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="size-3.5 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:-translate-x-0.5 motion-reduce:transition-none"
          >
            <path d="M20 12H5M11 18l-6-6 6-6" />
          </svg>
          Back home
        </Link>
      </p>
    </>
  );
}
