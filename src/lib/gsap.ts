import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * One motion vocabulary for the whole site. The new sections use GSAP
 * defaults directly; the exported values remain for the older components
 * that are still part of the repository but not rendered.
 */
export const EASE = {
  reveal: "power3.out",
  spring: "back.out(1.4)",
} as const;

export const MOTION = {
  duration: 0.9,
  microDuration: 0.25,
  stagger: 0.08,
  distance: 18,
  revealStart: "top 85%",
} as const;

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);

  gsap.defaults({
    ease: EASE.reveal,
    duration: MOTION.duration,
  });

  ScrollTrigger.config({
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger, useGSAP };
