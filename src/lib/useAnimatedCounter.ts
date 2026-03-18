"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(
  target: number,
  duration = 1200,
  start = 0
): number {
  const [value, setValue] = useState(start);
  const raf = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const from = value;
    const to = target;

    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const elapsed = ts - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };

    startTime.current = null;
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}
