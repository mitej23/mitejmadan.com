import type { CSSProperties, ElementType, ReactNode } from "react";
import { observeReveal } from "../lib/reveal";

type Props = {
  children: ReactNode;
  /** Stagger index. Each step adds 55ms of delay. */
  i?: number;
  /** Travel distance for the lift. Default 10px. */
  lift?: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/**
 * Scroll-triggered entrance. The ref callback returns its own cleanup, which
 * React 19 calls on unmount — no useEffect needed.
 */
export function Reveal({
  children,
  i = 0,
  lift,
  as: Tag = "div",
  className = "",
  style,
  ...rest
}: Props) {
  return (
    <Tag
      ref={observeReveal}
      className={`reveal ${className}`}
      style={{ "--i": i, ...(lift ? { "--lift": lift } : null), ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
