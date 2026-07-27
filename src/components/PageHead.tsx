/** Title + one-line lede for the sub-pages. Plays on mount, like the home hero. */
export function PageHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header>
      <h1
        className="enter text-[23px] leading-[1.15] font-semibold tracking-[-0.028em] text-ink sm:text-[26px]"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {title}
      </h1>
      <p
        className="enter mt-2.5 max-w-[34rem] text-[14.5px] leading-[1.65] text-ink-2"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        {lede}
      </p>
    </header>
  );
}
