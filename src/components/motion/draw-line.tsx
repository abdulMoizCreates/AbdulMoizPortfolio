"use client";

import { useRef } from "react";

import { EASE, gsap, MOTION, useGSAP } from "@/lib/gsap";

/*
 * A neutral rule that draws from left to right when it enters the viewport.
 * scaleX keeps the animation on the compositor.
 */
export function DrawLine({ className }: { className?: string }) {
  const scopeRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          scopeRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: MOTION.duration,
            ease: EASE.reveal,
            scrollTrigger: {
              trigger: scopeRef.current,
              start: MOTION.revealStart,
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <span
      ref={scopeRef}
      aria-hidden="true"
      className={className ?? "draw-line"}
    />
  );
}
