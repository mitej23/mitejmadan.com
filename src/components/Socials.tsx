import { links } from "../content";

/** Hand-drawn 24px paths. An icon package would cost more than these four glyphs. */
const icons = {
  github: (
    <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.4-3.88-1.4-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  ),
  x: (
    <path d="M17.2 3h2.9l-6.35 7.26L21 21h-5.8l-4.55-5.94L5.4 21H2.5l6.8-7.77L3 3h5.95l4.1 5.43L17.2 3Zm-1.02 16.2h1.6L8.9 4.7H7.18l9 14.5Z" />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95C20.4 8.73 21 11.06 21 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z" />
  ),
  email: (
    <path d="M3 5h18a1 1 0 0 1 1 1v.35l-10 6.09L2 6.35V6a1 1 0 0 1 1-1Zm-1 3.63L12 14.7l10-6.07V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8.63Z" />
  ),
} as const;

const entries = [
  { key: "github", label: "GitHub", href: links.github, handle: "mitej23" },
  { key: "x", label: "X", href: links.x, handle: "@mitej1347" },
  { key: "linkedin", label: "LinkedIn", href: links.linkedin, handle: "Mitej Madan" },
  { key: "email", label: "Email", href: `mailto:${links.email}`, handle: links.email },
] as const;

/** `variant="row"` is the compact icon row for the footer. */
export function Socials({ variant = "list" }: { variant?: "list" | "row" }) {
  if (variant === "row") {
    return (
      <ul className="flex items-center gap-1">
        {entries.map((e) => (
          <li key={e.key}>
            <a
              href={e.href}
              {...(e.key === "email" ? {} : { target: "_blank", rel: "noreferrer noopener" })}
              aria-label={e.label}
              title={e.label}
              className="grid size-8 place-items-center rounded-full text-ink-3 transition-[color,background-color,scale] duration-200 ease-[var(--ease-out-quart)] hover:bg-sunken hover:text-ink active:scale-[0.92]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[15px]">
                {icons[e.key]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="-mx-2 flex flex-col">
      {entries.map((e) => (
        <li key={e.key}>
          <a
            href={e.href}
            {...(e.key === "email" ? {} : { target: "_blank", rel: "noreferrer noopener" })}
            className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:bg-sunken"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="size-4 shrink-0 text-ink-3 transition-colors duration-200 group-hover:text-accent"
            >
              {icons[e.key]}
            </svg>
            <span className="text-[14px] font-medium text-ink">{e.label}</span>
            <span className="ml-auto truncate text-[13px] text-ink-3">{e.handle}</span>
            {/* Arrow slides in on hover — the affordance appears only when relevant. */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="size-3.5 shrink-0 -translate-x-1 text-ink-3 opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
