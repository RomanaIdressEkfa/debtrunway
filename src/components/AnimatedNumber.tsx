"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  /** Turns the running value into display text, e.g. the currency formatter. */
  format: (value: number) => string;
  durationMs?: number;
  className?: string;
}

/** Fast at first, easing into the final figure — it lands rather than stops. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts from the previous figure to the new one.
 *
 * Beyond looking alive, the movement carries information: when you raise your
 * extra payment and the interest total visibly falls, the size of the drop is
 * something you feel rather than something you have to compare by memory.
 */
export default function AnimatedNumber({
  value,
  format,
  durationMs = 650,
  className,
}: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;

    if (from === to) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      fromRef.current = to;
      setDisplay(to);
      return;
    }

    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = easeOutExpo(progress);
      const current = from + (to - from) * eased;

      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
      // Whatever was on screen becomes the start of the next run, so an edit
      // mid-animation continues smoothly instead of jumping back.
      fromRef.current = display;
    };
    // `display` is deliberately excluded: including it would restart the
    // animation on every frame it sets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return (
    <span className={className} suppressHydrationWarning>
      {format(display)}
    </span>
  );
}
