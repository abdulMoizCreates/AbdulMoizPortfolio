"use client";

import { useRef } from "react";

import { EASE, gsap, MOTION, useGSAP } from "@/lib/gsap";

type CountUpProps = {
  value: number;
  duration?: number;
  className?: string;
};

/*
 * Counts a real number up from zero when scrolled into view. Only text content
 * changes; no DOM geometry is animated. Reduced motion shows the final value.
 */
export function CountUp({ value, duration = 0.9, className }: CountUpProps) {
  const scopeRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { value: 0 };

        gsap.to(counter, {
          value,
          duration,
          ease: EASE.reveal,
          scrollTrigger: {
            trigger: scopeRef.current,
            start: MOTION.revealStart,
            once: true,
          },
          onStart: () => {
            if (scopeRef.current) scopeRef.current.textContent = "0";
          },
          onUpdate: () => {
            if (scopeRef.current) {
              scopeRef.current.textContent = String(Math.round(counter.value));
            }
          },
        });
      });

      return () => mm.revert();
    },
    { scope: scopeRef, dependencies: [value, duration] },
  );

  return (
    <span ref={scopeRef} className={className}>
      {value}
    </span>
  );
}
