"use client";

import { Fragment, useRef } from "react";

import { EASE, gsap, MOTION, useGSAP } from "@/lib/gsap";

type MaskRevealProps = {
  text: string;
  className?: string;
  duration?: number;
  stagger?: number;
  emphasis?: string[];
};

/*
 * Word-by-word mask reveal. Each word sits in an overflow-hidden container
 * and travels from yPercent 100 to 0. Only transform is animated.
 */
export function MaskReveal({
  text,
  className,
  duration = MOTION.duration,
  stagger = MOTION.stagger,
  emphasis,
}: MaskRevealProps) {
  const scopeRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ").filter(Boolean);
  const boldWords = emphasis ?? words;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = scopeRef.current;
        const maskedLetters = scope?.querySelectorAll<HTMLElement>(
          "[data-mask-letter]",
        );
        if (!scope || !maskedLetters || maskedLetters.length === 0) return;

        gsap.fromTo(
          maskedLetters,
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration,
            stagger: { each: Math.min(stagger, 0.035), from: "start" },
            ease: EASE.reveal,
            scrollTrigger: {
              trigger: scope,
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
    <span ref={scopeRef} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="reveal-mask">
            <span className={`reveal-word ${boldWords.includes(word) ? "font-bold" : "font-light"}`}>
              {Array.from(word).map((letter, letterIndex) => (
                <span className="reveal-char" data-mask-letter key={`${letter}-${letterIndex}`}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
