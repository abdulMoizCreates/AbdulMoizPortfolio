"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

/*
 * Thin fixed indicator at the top of the page. The fill is a scaleX transform
 * so no layout property is animated.
 */
export function ScrollProgress() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          scopeRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              start: 0,
              end: "max",
              scrub: 0.3,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return <div ref={scopeRef} aria-hidden="true" className="scroll-progress" />;
}
