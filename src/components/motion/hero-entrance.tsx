"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

type HeroEntranceProps = {
  children: ReactNode;
  className?: string;
};

export function HeroEntrance({ children, className }: HeroEntranceProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const name = scope.querySelector("[data-hero-name-text]");
        const portrait = scope.querySelector("[data-hero-portrait]");
        const columns = gsap.utils.toArray<HTMLElement>(
          "[data-hero-column]",
          scope,
        );

        gsap.set(name, { yPercent: 110, y: 0 });
        gsap.set(portrait, { autoAlpha: 0, y: 24, scale: 0.98 });
        gsap.set(columns, { autoAlpha: 0, y: 16 });

        const timeline = gsap.timeline({
          defaults: { ease: "expo.out" },
        });

        timeline
          .to(name, { yPercent: 0, duration: 1.25 }, 0.15)
          .to(
            portrait,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.4,
              ease: "power3.out",
            },
            0.3,
          )
          .to(
            columns,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
            },
            0.6,
          );

        return () => {
          timeline.kill();
        };
      });

      media.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          const name = scope.querySelector("[data-hero-name]");
          if (!name) return;

          gsap.to(name, {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        },
      );

      return () => media.revert();
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
