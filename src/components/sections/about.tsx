"use client";

import { MousePointer2, Play, SkipBack, SkipForward } from "lucide-react";
import { Fragment, useRef, type RefObject } from "react";

import { ToolMark } from "@/components/tool-mark";
import { about, type Role } from "@/lib/about";
import { gsap, useGSAP } from "@/lib/gsap";

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
  const words = role.description.split(/\s+/).filter(Boolean);

  return (
    <div className="about-design">
      <div className="about-design-workspace" data-design-workspace>
        <div aria-hidden="true" className="about-design-rail">
          {role.tools.map((tool) => (
            <span key={tool} data-design-tool className="about-design-rail-item">
              <ToolMark name={tool} />
            </span>
          ))}
        </div>

        <div className="about-design-canvas">
          <div data-design-artboard className="about-design-artboard">
            <div aria-hidden="true" className="about-design-artboard-bar">
              <span>{role.label}</span>
              <span>100%</span>
            </div>

            <div className="about-design-poster">
              <p className="about-design-poster-kicker">{role.label}</p>
              <p className="about-design-poster-copy" aria-label={role.description}>
                <span
                  aria-hidden="true"
                  className="about-design-selection"
                  data-design-selection
                >
                  {words.map((word, index) => (
                    <Fragment key={`${word}-${index}`}>
                      <span className="about-design-word-mask">
                        <span data-design-word className="about-design-word">
                          {word}
                        </span>
                      </span>{" "}
                    </Fragment>
                  ))}
                  <span aria-hidden="true" data-design-frame className="about-design-frame">
                    <span data-design-handle className="about-design-handle about-design-handle--tl" />
                    <span data-design-handle className="about-design-handle about-design-handle--tr" />
                    <span data-design-handle className="about-design-handle about-design-handle--bl" />
                    <span data-design-handle className="about-design-handle about-design-handle--br" />
                    <MousePointer2
                      aria-hidden="true"
                      data-design-cursor
                      className="about-design-cursor"
                      strokeWidth={1.4}
                    />
                  </span>
                </span>
              </p>
              <div className="about-design-palette" aria-hidden="true">
                <span>Palette</span>
                <span className="about-design-swatches">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>

              <div className="about-design-poster-tools">
                {role.tools.map((tool) => (
                  <span key={tool} className="about-design-chip">
                    <ToolMark name={tool} />
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <span aria-hidden="true" data-design-sheen className="about-design-sheen" />
          </div>
        </div>

        <aside aria-hidden="true" className="about-design-layers">
          <p className="about-design-layers-title">Layers</p>
          <ul>
            {[role.label, ...role.tools].map((layer) => (
              <li key={layer} data-design-layer className="about-design-layer">
                <span className="about-design-layer-thumb" />
                <span>{layer}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

type VideoArtifactProps = {
  role: Role;
  motion: RefObject<{ value: number }>;
  timecodeRef: RefObject<HTMLSpanElement | null>;
};

function VideoArtifact({ role, timecodeRef }: VideoArtifactProps) {
  const ticks = Array.from({ length: 8 }, (_, index) =>
    String(index).padStart(2, "0"),
  );
  const stills = [role.label, ...role.tools, role.label];

  return (
    <div className="about-film">
      <div className="about-film-viewer">
        <div className="about-film-monitor">
          <div aria-hidden="true" className="about-film-still" data-film-still>
            <span className="about-film-still-glow" />
            <span className="about-film-still-ridge about-film-still-ridge--far" />
            <span className="about-film-still-ridge about-film-still-ridge--near" />
            <span className="about-film-still-grain" />
          </div>
          <div aria-hidden="true" className="about-film-monitor-guides">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="about-film-hud">
            <span className="about-film-hud-label">Program / {role.label}</span>
            <span ref={timecodeRef} className="about-film-timecode">
              00:00:00:00
            </span>
          </div>
          <div aria-hidden="true" className="about-film-monitor-meta">
            <span>1920 x 1080</span>
            <span>24 fps</span>
          </div>
        </div>

        <div aria-hidden="true" className="about-film-strip">
          <div data-film-strip className="about-film-strip-track">
            {stills.map((tool, index) => (
              <span key={`${tool}-${index}`} className="about-film-frame">
                <span className="about-film-frame-image" />
                <span className="about-film-frame-caption">{tool}</span>
              </span>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="about-film-transport">
          <span className="about-film-transport-controls">
            <SkipBack />
            <Play />
            <SkipForward />
          </span>
          <span className="about-film-transport-line">
            <span data-film-progress className="about-film-progress" />
          </span>
          <span className="about-film-transport-label">Preview</span>
        </div>
      </div>

      <div aria-hidden="true" className="about-timeline">
        <div className="about-timeline-toolbar">
          <span>Sequence</span>
          <span className="about-timeline-toolbar-meta">24 fps / stereo</span>
        </div>
        <div className="about-timeline-ruler">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="about-timeline-rows">
          {role.tools.map((tool, index) => (
            <div key={tool} className="about-timeline-row">
              <span className="about-timeline-label">
                <ToolMark name={tool} />
                {tool}
              </span>
              <div className="about-timeline-lane">
                <span
                  data-timeline-clip
                  className={`about-timeline-clip about-timeline-clip--${(index % 3) + 1}${
                    index === 0 ? " about-timeline-clip--selected" : ""
                  }`}
                >
                  <span className="about-timeline-clip-head">
                    <span>{tool}</span>
                  </span>
                  <span className="about-timeline-clip-wave">
                    {Array.from({ length: 26 }, (_, bar) => (
                      <i
                        key={bar}
                        style={{
                          height: `${16 + ((tool.charCodeAt(bar % tool.length) + bar * 11) % 68)}%`,
                        }}
                      />
                    ))}
                  </span>
                  <span className="about-timeline-clip-cut" />
                </span>
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
  const filmMotion = useRef({ value: 0 });
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const roles = about.about.roles;

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
          const designArtboard = stage.querySelector<HTMLElement>("[data-design-artboard]");
          const designTools = gsap.utils.toArray<HTMLElement>("[data-design-tool]", stage);
          const designWords = gsap.utils.toArray<HTMLElement>("[data-design-word]", stage);
          const designLayers = gsap.utils.toArray<HTMLElement>("[data-design-layer]", stage);
          const designFrame = stage.querySelector<HTMLElement>("[data-design-frame]");
          const designHandles = gsap.utils.toArray<HTMLElement>(
            "[data-design-handle]",
            stage,
          );
          const designCursor = stage.querySelector<HTMLElement>("[data-design-cursor]");
          const designSheen = stage.querySelector<HTMLElement>("[data-design-sheen]");
          const timelineClips = gsap.utils.toArray<HTMLElement>("[data-timeline-clip]", stage);
          const playhead = stage.querySelector<HTMLElement>("[data-timeline-playhead]");
          const filmProgress = stage.querySelector<HTMLElement>("[data-film-progress]");
          const filmStrip = stage.querySelector<HTMLElement>("[data-film-strip]");
          const filmStill = stage.querySelector<HTMLElement>("[data-film-still]");
          const lane = stage.querySelector<HTMLElement>(".about-timeline-lane");

          if (
            scenes.length !== 3 ||
            !designArtboard ||
            !designFrame ||
            !designCursor ||
            !designSheen ||
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
          gsap.set(designArtboard, {
            autoAlpha: 0,
            y: 34,
            rotateX: 5,
            rotateY: -9,
            scale: 0.97,
          });
          gsap.set(designTools, { autoAlpha: 0, x: -10 });
          gsap.set(designWords, { yPercent: 115, opacity: 0 });
          gsap.set(designLayers, { autoAlpha: 0, x: 16 });
          gsap.set(designFrame, {
            scaleX: 0.22,
            scaleY: 0.22,
            autoAlpha: 0,
            transformOrigin: "top left",
          });
          gsap.set(designHandles, { autoAlpha: 0, scale: 0 });
          gsap.set(designCursor, { autoAlpha: 0, x: 28, y: 28 });
          gsap.set(designSheen, { autoAlpha: 0, xPercent: -110 });
          gsap.set(timelineClips, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(playhead, { autoAlpha: 0, x: 0 });
          if (filmProgress) {
            gsap.set(filmProgress, { scaleX: 0, transformOrigin: "left center" });
          }
          if (filmStrip) {
            gsap.set(filmStrip, { xPercent: 0 });
          }
          if (filmStill) {
            gsap.set(filmStill, { scale: 1.08, xPercent: 1.5 });
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: "top top+=88",
              end: () => `+=${window.innerHeight * 2.8}`,
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
            .to(
              designArtboard,
              {
                autoAlpha: 1,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: "power3.out",
              },
              1.04,
            )
            .to(
              designTools,
              { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.07 },
              1.12,
            )
            .to(
              designWords,
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.32,
                stagger: 0.045,
                ease: "power2.out",
              },
              1.2,
            )
            .to(
              designLayers,
              { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.06 },
              1.3,
            )
            .to(
              designFrame,
              { scaleX: 1, scaleY: 1, autoAlpha: 1, duration: 0.34 },
              1.42,
            )
            .to(
              designHandles,
              { autoAlpha: 1, scale: 1, duration: 0.18, stagger: 0.04 },
              1.58,
            )
            .to(
              designCursor,
              { autoAlpha: 1, x: 0, y: 0, duration: 0.34 },
              1.6,
            )
            .fromTo(
              designSheen,
              { xPercent: -110, autoAlpha: 0 },
              { xPercent: 110, autoAlpha: 1, duration: 0.38, ease: "power1.inOut" },
              1.64,
            )
            .to(designSheen, { autoAlpha: 0, duration: 0.12 }, 2.02)
            .to(scenes[1], { autoAlpha: 0, yPercent: -4, duration: 0.35 }, 1.9)
            .to(scenes[2], { autoAlpha: 1, yPercent: 0, duration: 0.35 }, 2.0)
            .to(
              filmStill,
              { scale: 1, xPercent: 0, duration: 0.8, ease: "power2.out" },
              2.02,
            )
            .to(
              timelineClips,
              { scaleX: 1, duration: 0.3, stagger: 0.08 },
              2.12,
            )
            .to(playhead, { autoAlpha: 1, duration: 0.01 }, 2.08)
            .fromTo(
              playhead,
              { x: 0 },
              { x: () => lane.offsetWidth, duration: 0.85, ease: "none" },
              2.12,
            );

          if (filmProgress) {
            timeline.to(
              filmProgress,
              { scaleX: 1, duration: 0.85, ease: "none" },
              2.12,
            );
          }
          if (filmStrip) {
            timeline.to(
              filmStrip,
              { xPercent: -20, duration: 0.85, ease: "none" },
              2.12,
            );
          }

          timeline.to(
            filmMotion.current,
            {
              value: 1,
              duration: 0.85,
              ease: "none",
              onUpdate: () => {
                const readout = timecodeRef.current;
                if (!readout) return;
                const frames = Math.round(filmMotion.current.value * 72);
                readout.textContent = `00:00:${String(Math.floor(frames / 24)).padStart(2, "0")}:${String(frames % 24).padStart(2, "0")}`;
              },
            },
            2.12,
          );

          return () => {
            stage.removeAttribute("data-about-mode");
            timeline.kill();
            filmMotion.current.value = 0;
            if (timecodeRef.current) {
              timecodeRef.current.textContent = "00:00:00:00";
            }
          };
        },
      );

      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [roles.length],
      revertOnUpdate: true,
    },
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
                    motion={filmMotion}
                    timecodeRef={timecodeRef}
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
