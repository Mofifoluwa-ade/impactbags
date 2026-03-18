"use client";
import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  const raf = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const from = prev.current;
    const to = target;
    prev.current = target;
    startTime.current = null;
    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const p = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return value;
}
