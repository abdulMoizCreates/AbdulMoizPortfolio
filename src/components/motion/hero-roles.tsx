"use client";

import { useRef } from "react";

import { EASE, gsap, useGSAP } from "@/lib/gsap";

type HeroRolesProps = {
  roles: string[];
};

/*
 * The role line stays in its designed position but becomes a quiet, masked
 * cycle through the real roles from about.json. Reduced motion and no-JS keep
 * the complete static list, and assistive tech always reads the full text.
 */
export function HeroRoles({ roles }: HeroRolesProps) {
  const scopeRef = useRef<HTMLSpanElement>(null);
  const joined = roles.join("  /  ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = scopeRef.current;
        if (!scope) return;

        const layers = gsap.utils.toArray<HTMLElement>(
          "[data-hero-role-layer]",
          scope,
        );
        if (layers.length < 2) return;

        const EXIT = 0.5;
        const ENTER = 0.6;
        const GAP = 0.1;
        const HOLD = 2.2;
        const CYCLE = GAP + ENTER + HOLD;

        gsap.set(layers, { autoAlpha: 0, yPercent: 100 });
        gsap.set(layers[0], { autoAlpha: 1, yPercent: 0 });

        const timeline = gsap.timeline({ repeat: -1, delay: 2.2 });

        layers.forEach((_, step) => {
          const start = step * CYCLE;
          const current = layers[step];
          const next = layers[(step + 1) % layers.length];

          timeline.to(
            current,
            { yPercent: -100, autoAlpha: 0, duration: EXIT, ease: EASE.reveal },
            start,
          );
          timeline.fromTo(
            next,
            { yPercent: 100, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: ENTER,
              ease: EASE.reveal,
              immediateRender: false,
            },
            start + GAP,
          );
        });

        return () => {
          timeline.kill();
          gsap.set(layers, { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  if (roles.length === 0) return null;

  return (
    <span ref={scopeRef} data-hero-roles-content>
      <span className="hero-roles-sr">{joined}</span>
      <span className="hero-roles-static" aria-hidden="true">
        {joined}
      </span>
      <span className="hero-roles-cycle" aria-hidden="true">
        {roles.map((role, index) => (
          <span
            key={`${role}-${index}`}
            className="hero-role-layer"
            data-hero-role-layer
          >
            {role}
          </span>
        ))}
      </span>
    </span>
  );
}
