"use client";

import Image from "next/image";
import { useRef } from "react";

import { EASE, gsap, MOTION, useGSAP } from "@/lib/gsap";

type ImageRevealProps = {
  src: string;
  alt: string;
  sizes: string;
  label?: string;
  className?: string;
  priority?: boolean;
};

/*
 * Transform-only image reveal. A solid veil wipes away with scaleY while the
 * image settles from 1.1 to 1. On desktop the media layer also drifts very
 * slightly against the scroll. No clip-path or layout properties are animated.
 */
export function ImageReveal({
  src,
  alt,
  sizes,
  label,
  className,
  priority = false,
}: ImageRevealProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = scopeRef.current;
        const media = scope?.querySelector("[data-reveal-media]");
        const veil = scope?.querySelector("[data-reveal-veil]");
        if (!scope || !media || !veil) return;

        gsap.set(veil, { transformOrigin: "top center" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope,
              start: MOTION.revealStart,
              once: true,
            },
          })
          .fromTo(media, { scale: 1.1 }, { scale: 1, duration: 0.9 }, 0)
          .to(veil, { scaleY: 0, duration: 0.9, ease: EASE.reveal }, 0);
      });

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const scope = scopeRef.current;
          const layer = scope?.querySelector("[data-parallax-layer]");
          if (!scope || !layer) return;

          gsap.fromTo(
            layer,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: scope,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <div
      ref={scopeRef}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <div className="media-parallax" data-parallax-layer>
        <Image
          className="media-image"
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          data-reveal-media
        />
      </div>
      <span aria-hidden="true" className="image-reveal-veil" data-reveal-veil />
    </div>
  );
}
