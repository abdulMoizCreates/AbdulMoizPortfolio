import { BriefcaseBusiness, GraduationCap } from "lucide-react";

import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { about } from "@/lib/about";

export function Journey() {
  const { experience, education } = about;

  if (experience.length === 0 && education.length === 0) return null;

  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="section-shell journey-section"
    >
      <div className="page-container">
        <ScrollReveal className="section-heading journey-heading">
          <p className="section-kicker" data-reveal>Background</p>
          <h2
            id="journey-title"
            className="font-heading text-h1"
            aria-label="The path so far."
          >
            <MaskReveal text="The path so far." emphasis={["path"]} />
          </h2>
        </ScrollReveal>

        <ScrollReveal className="journey-grid" stagger={0.1}>
          {experience.length > 0 ? (
            <div className="journey-panel" data-reveal>
              <div className="journey-panel-head">
                <span aria-hidden="true" className="journey-icon">
                  <BriefcaseBusiness className="size-4" strokeWidth={1.65} />
                </span>
                <h3>Experience</h3>
              </div>

              <ol className="journey-list">
                {experience.map((item, index) => {
                  const period = item.end ? `${item.start} — ${item.end}` : item.start;

                  return (
                    <li
                      key={`${item.role}-${item.start}-${index}`}
                      className="journey-item"
                    >
                      <div className="journey-item-meta">
                        <span className="journey-period">{period}</span>
                        <span className="journey-type">{item.type}</span>
                      </div>
                      <h4>{item.role}</h4>
                      {item.summary ? <p>{item.summary}</p> : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : null}

          {education.length > 0 ? (
            <div className="journey-panel" data-reveal>
              <div className="journey-panel-head">
                <span aria-hidden="true" className="journey-icon">
                  <GraduationCap className="size-4" strokeWidth={1.65} />
                </span>
                <h3>Education</h3>
              </div>

              <ol className="journey-list">
                {education.map((item, index) => (
                  <li
                    key={`${item.institution}-${index}`}
                    className="journey-item"
                  >
                    <div className="journey-item-meta">
                      {item.status ? (
                        <span className="journey-status">
                          {item.status === "current" ? "Current" : item.status}
                        </span>
                      ) : null}
                    </div>
                    <h4>{item.institution}</h4>
                    {item.detail ? <p>{item.detail}</p> : null}
                    {item.program ? <p>{item.program}</p> : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  );
}
