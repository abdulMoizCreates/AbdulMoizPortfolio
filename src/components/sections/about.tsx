"use client";

import dynamic from "next/dynamic";
import { MousePointer2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ToolMark } from "@/components/tool-mark";
import { about, type Role } from "@/lib/about";
import { gsap, useGSAP } from "@/lib/gsap";

const FilmTape = dynamic(() => import("@/components/three/film-tape"), {
  ssr: false,
  loading: () => null,
});

function DeveloperArtifact({ role }: { role: Role }) {
  const typed = role.label.toLowerCase();

  return (
    <div className="about-terminal">
      <div className="about-terminal-bar">
        <span>~/portfolio</span>
        <span>bash</span>
      </div>
      <div className="about-terminal-body">
        <p className="about-terminal-line">
          <span className="about-terminal-prompt">$</span>
          whoami
        </p>
        <p className="about-terminal-line about-terminal-value">
          {Array.from(typed).map((character, index) => (
            <span
              key={`${character}-${index}`}
              data-terminal-char
              className="about-terminal-char"
            >
              {character}
            </span>
          ))}
          <span aria-hidden="true" className="about-terminal-cursor" />
        </p>
        <p className="about-terminal-line">
          <span className="about-terminal-prompt">$</span>
          stack --list
        </p>
        {role.tools.length > 0 ? (
          <ul data-terminal-tools className="about-terminal-tools">
            {role.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function DesignerArtifact({ role }: { role: Role }) {
  return (
    <div className="about-selection">
      <p className="about-selection-type">
        <span className="about-selection-target" data-selection-target>
          <span aria-hidden="true" data-selection-fill className="about-selection-fill" />
          <span className="about-selection-text">{role.description}</span>
          <span aria-hidden="true" data-selection-frame className="about-selection-frame">
            <span data-selection-handle className="about-selection-handle about-selection-handle--tl" />
            <span data-selection-handle className="about-selection-handle about-selection-handle--tr" />
            <span data-selection-handle className="about-selection-handle about-selection-handle--bl" />
            <span data-selection-handle className="about-selection-handle about-selection-handle--br" />
            <MousePointer2
              aria-hidden="true"
              data-selection-cursor
              className="about-selection-cursor"
              strokeWidth={1.5}
            />
          </span>
        </span>
      </p>
    </div>
  );
}

type VideoArtifactProps = {
  role: Role;
  tapeEnabled: boolean;
  tapeVisible: boolean;
};

function VideoArtifact({ role, tapeEnabled, tapeVisible }: VideoArtifactProps) {
  return (
    <div className="about-film">
      {tapeEnabled ? (
        <div data-film-canvas className="about-film-canvas">
          {tapeVisible ? <FilmTape /> : null}
        </div>
      ) : null}

      <div aria-hidden="true" className="about-timeline">
        <div className="about-timeline-rows">
          {role.tools.map((tool, index) => (
            <div key={tool} className="about-timeline-row">
              <span className="about-timeline-label">{tool}</span>
              <div className="about-timeline-lane">
                <span
                  data-timeline-clip
                  className={`about-timeline-clip about-timeline-clip--${(index % 3) + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
        <span data-timeline-playhead className="about-timeline-playhead" />
      </div>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tapeEnabled, setTapeEnabled] = useState(false);
  const [tapeVisible, setTapeVisible] = useState(false);
  const roles = about.about.roles;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const stage = section.querySelector<HTMLElement>("[data-about-stage]");
    const media = window.matchMedia(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    );
    let observer: IntersectionObserver | null = null;

    const sync = () => {
      const enabled = media.matches;

      setTapeEnabled(enabled);
      observer?.disconnect();
      observer = null;

      if (enabled && stage) {
        observer = new IntersectionObserver(
          ([entry]) => setTapeVisible(entry.isIntersecting),
          { rootMargin: "240px 0px" },
        );
        observer.observe(stage);
      } else {
        setTapeVisible(false);
      }
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      observer?.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || roles.length !== 3) return;

      const media = gsap.matchMedia();

      media.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          const stage = section.querySelector<HTMLElement>("[data-about-stage]");
          if (!stage) return;

          const scenes = gsap.utils.toArray<HTMLElement>("[data-about-scene]", stage);
          const terminalChars = gsap.utils.toArray<HTMLElement>("[data-terminal-char]", stage);
          const terminalTools = gsap.utils.toArray<HTMLElement>(
            "[data-terminal-tools] > li",
            stage,
          );
          const selectionFill = stage.querySelector<HTMLElement>("[data-selection-fill]");
          const selectionFrame = stage.querySelector<HTMLElement>("[data-selection-frame]");
          const selectionHandles = gsap.utils.toArray<HTMLElement>(
            "[data-selection-handle]",
            stage,
          );
          const selectionCursor = stage.querySelector<HTMLElement>("[data-selection-cursor]");
          const timelineClips = gsap.utils.toArray<HTMLElement>("[data-timeline-clip]", stage);
          const playhead = stage.querySelector<HTMLElement>("[data-timeline-playhead]");
          const lane = stage.querySelector<HTMLElement>(".about-timeline-lane");

          if (
            scenes.length !== 3 ||
            !selectionFill ||
            !selectionFrame ||
            !selectionCursor ||
            !playhead ||
            !lane
          ) {
            return;
          }

          stage.setAttribute("data-about-mode", "pinned");

          gsap.set(scenes, { autoAlpha: 0, yPercent: 4 });
          gsap.set(scenes[0], { autoAlpha: 1, yPercent: 0 });
          gsap.set(terminalChars, { opacity: 0 });
          gsap.set(terminalTools, { autoAlpha: 0, y: 8 });
          gsap.set(selectionFill, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(selectionFrame, {
            scaleX: 0.18,
            scaleY: 0.18,
            autoAlpha: 0,
            transformOrigin: "top left",
          });
          gsap.set(selectionHandles, { autoAlpha: 0, scale: 0 });
          gsap.set(selectionCursor, { autoAlpha: 0, x: 26, y: 26 });
          gsap.set(timelineClips, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(playhead, { autoAlpha: 0, x: 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: "top top+=88",
              end: () => `+=${window.innerHeight * 2.4}`,
              pin: stage,
              pinSpacing: true,
              scrub: 0.55,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(terminalChars, { opacity: 1, duration: 0.01, stagger: 0.03 }, 0.1)
            .to(
              terminalTools,
              { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.02 },
              0.5,
            )
            .to(scenes[0], { autoAlpha: 0, yPercent: -4, duration: 0.35 }, 0.9)
            .to(scenes[1], { autoAlpha: 1, yPercent: 0, duration: 0.35 }, 1.0)
            .to(selectionFill, { scaleX: 1, duration: 0.35 }, 1.12)
            .to(
              selectionFrame,
              { scaleX: 1, scaleY: 1, autoAlpha: 1, duration: 0.35 },
              1.12,
            )
            .to(
              selectionHandles,
              { autoAlpha: 1, scale: 1, duration: 0.2, stagger: 0.04 },
              1.35,
            )
            .to(selectionCursor, { autoAlpha: 1, x: 0, y: 0, duration: 0.35 }, 1.35)
            .to(scenes[1], { autoAlpha: 0, yPercent: -4, duration: 0.35 }, 1.85)
            .to(scenes[2], { autoAlpha: 1, yPercent: 0, duration: 0.35 }, 1.95)
            .to(
              timelineClips,
              { scaleX: 1, duration: 0.3, stagger: 0.08 },
              2.1,
            )
            .to(playhead, { autoAlpha: 1, duration: 0.01 }, 2.05)
            .fromTo(
              playhead,
              { x: 0 },
              { x: () => lane.offsetWidth, duration: 0.85, ease: "none" },
              2.1,
            );

          return () => {
            stage.removeAttribute("data-about-mode");
            timeline.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [roles.length] },
  );

  if (roles.length === 0) return null;

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
      className="section-shell about-section"
    >
      <div className="page-container">
        <div className="about-head">
          <p className="about-kicker">A little about me</p>
          <h2 id="about-title">Three ways I make things.</h2>
          {about.about.long ? (
            <p className="about-intro">{about.about.long}</p>
          ) : null}
        </div>

        <div data-about-stage className="about-stage">
          {roles.map((role) => (
            <article
              key={role.id}
              data-about-scene
              className={`about-scene about-scene--${role.id}`}
            >
              <div className="about-scene-copy">
                <p className="about-scene-label">{role.label}</p>
                <h3>{role.statement}</h3>
                {role.id !== "designer" && role.description ? (
                  <p className="about-scene-description">{role.description}</p>
                ) : null}
                {role.tools.length > 0 ? (
                  <ul
                    aria-label={`${role.label} tools`}
                    className="about-scene-tools"
                  >
                    {role.tools.map((tool) => (
                      <li key={tool}>
                        <ToolMark name={tool} />
                        {tool}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div
                aria-hidden={role.id !== "designer" ? "true" : undefined}
                className="about-scene-art"
              >
                {role.id === "developer" ? (
                  <DeveloperArtifact role={role} />
                ) : null}
                {role.id === "designer" ? (
                  <DesignerArtifact role={role} />
                ) : null}
                {role.id === "video-editor" ? (
                  <VideoArtifact
                    role={role}
                    tapeEnabled={tapeEnabled}
                    tapeVisible={tapeVisible}
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
