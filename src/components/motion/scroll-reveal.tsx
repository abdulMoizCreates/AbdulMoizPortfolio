"use client";

import { useRef, type ReactNode } from "react";

import { EASE, gsap, MOTION, useGSAP } from "@/lib/gsap";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  stagger?: number;
};

/*
 * Staggers marked descendants into view once. Mark a child with
 * data-reveal to include it; unmarked children (e.g. a masked heading)
 * are left to their own animation.
 */
export function ScrollReveal({
  children,
  className,
  distance = MOTION.distance,
  duration = MOTION.duration,
  stagger = MOTION.stagger,
}: ScrollRevealProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          scopeRef.current,
        );

        if (items.length === 0) return;

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: distance },
          {
            autoAlpha: 1,
            y: 0,
            duration,
            stagger,
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
    {
      scope: scopeRef,
      dependencies: [distance, duration, stagger],
    },
  );

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
