import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionHeading } from "@/components/motion/section-heading";
import { about } from "@/lib/about";

const groups = [
  { key: "development", label: "Development" },
  { key: "creativeTools", label: "Creative tools" },
  { key: "disciplines", label: "Disciplines" },
] as const;

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section-shell skills-section">
      <div className="page-container">
        <SectionHeading id="skills-title" text="Skills" kicker="What I use" />

        <ScrollReveal className="skills-index" stagger={0.12}>
          {groups.map(({ key, label }) => (
            <div key={key} data-reveal className="skills-row">
              <h3>{label}</h3>
              <ul>
                {about.skills[key].map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
