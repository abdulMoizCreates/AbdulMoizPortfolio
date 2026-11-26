"use client";

import { useRef, type ReactNode } from "react";

import { EASE, gsap, MOTION, useGSAP } from "@/lib/gsap";

/*
 * Hover and focus micro-interactions. Small controls get a slight spring;
 * cards get a quiet lift. Both are transform-only and revert on unmount.
 */
export function HoverEffects({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (!contextSafe) return;

      const safe = contextSafe;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = scopeRef.current;
        if (!scope) return;

        const springs = gsap.utils.toArray<HTMLElement>(
          "[data-hover-spring]",
          scope,
        );
        const lifts = gsap.utils.toArray<HTMLElement>(
          "[data-hover-lift]",
          scope,
        );

        const springIn = safe((event: Event) => {
          gsap.to(event.currentTarget as HTMLElement, {
            scale: 1.03,
            duration: MOTION.microDuration,
            ease: EASE.spring,
          });
        });

        const springOut = safe((event: Event) => {
          gsap.to(event.currentTarget as HTMLElement, {
            scale: 1,
            duration: MOTION.microDuration,
            ease: EASE.spring,
          });
        });

        const liftIn = safe((event: Event) => {
          gsap.to(event.currentTarget as HTMLElement, {
            y: -4,
            duration: MOTION.microDuration,
            ease: EASE.reveal,
          });
        });

        const liftOut = safe((event: Event) => {
          gsap.to(event.currentTarget as HTMLElement, {
            y: 0,
            duration: MOTION.microDuration,
            ease: EASE.reveal,
          });
        });

        springs.forEach((element) => {
          element.addEventListener("mouseenter", springIn);
          element.addEventListener("mouseleave", springOut);
          element.addEventListener("focus", springIn);
          element.addEventListener("blur", springOut);
        });

        lifts.forEach((element) => {
          element.addEventListener("mouseenter", liftIn);
          element.addEventListener("mouseleave", liftOut);
        });

        return () => {
          springs.forEach((element) => {
            element.removeEventListener("mouseenter", springIn);
            element.removeEventListener("mouseleave", springOut);
            element.removeEventListener("focus", springIn);
            element.removeEventListener("blur", springOut);
            gsap.set(element, { clearProps: "transform" });
          });

          lifts.forEach((element) => {
            element.removeEventListener("mouseenter", liftIn);
            element.removeEventListener("mouseleave", liftOut);
            gsap.set(element, { clearProps: "transform" });
          });
        };
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return <div ref={scopeRef}>{children}</div>;
}
