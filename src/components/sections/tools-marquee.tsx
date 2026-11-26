"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { ToolMark } from "@/components/tool-mark";

type ToolsMarqueeProps = {
  items: string[];
};

export function ToolsMarquee({ items }: ToolsMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const speedTweenRef = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(paused);
  const hoveredRef = useRef(false);

  const animateSpeed = useCallback((target: number) => {
    const tween = tweenRef.current;

    if (!tween) {
      return;
    }

    speedTweenRef.current?.kill();

    const proxy = { value: tween.timeScale() };

    speedTweenRef.current = gsap.to(proxy, {
      value: target,
      duration: 0.65,
      ease: "power2.out",
      onUpdate: () => {
        tween.timeScale(proxy.value);
      },
      onComplete: () => {
        speedTweenRef.current = null;
      },
    });
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useGSAP(
    () => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(track, {
          xPercent: -50,
          duration: Math.max(32, items.length * 3.6),
          ease: "none",
          repeat: -1,
        });

        tweenRef.current = tween;

        if (pausedRef.current) {
          tween.pause();
        }

        return () => {
          speedTweenRef.current?.kill();
          speedTweenRef.current = null;
          tween.kill();
          tweenRef.current = null;
        };
      });

      return () => media.revert();
    },
    { scope: trackRef, dependencies: [items] },
  );

  useEffect(() => {
    const tween = tweenRef.current;

    if (!tween) {
      return;
    }

    if (paused) {
      tween.pause();
    } else {
      tween.play();
      animateSpeed(hoveredRef.current ? 0.35 : 1);
    }
  }, [paused, animateSpeed]);

  if (items.length === 0) {
    return null;
  }

  const renderGroup = (hidden: boolean) => (
    <ul
      role="list"
      aria-hidden={hidden ? "true" : undefined}
      className="marquee-group"
    >
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="marquee-item">
          <span className="marquee-tool"><ToolMark name={item} />{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="tools-title" className="marquee-section">
      <h2 id="tools-title" className="sr-only">
        Tools and technologies
      </h2>

      <div className="page-container marquee-controls">
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play tool marquee" : "Pause tool marquee"}
          aria-pressed={paused}
          aria-controls="tools-marquee"
          className="marquee-toggle"
        >
          {paused ? (
            <Play aria-hidden="true" />
          ) : (
            <Pause aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        className="marquee-mask"
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") {
            return;
          }

          hoveredRef.current = true;

          if (!pausedRef.current) {
            animateSpeed(0.35);
          }
        }}
        onPointerLeave={() => {
          hoveredRef.current = false;

          if (!pausedRef.current) {
            animateSpeed(1);
          }
        }}
      >
        <div
          id="tools-marquee"
          ref={trackRef}
          className="marquee-track flex w-max items-center"
        >
          {renderGroup(false)}
          {renderGroup(true)}
        </div>
      </div>
    </section>
  );
}
