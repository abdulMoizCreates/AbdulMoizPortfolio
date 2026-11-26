import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionHeading } from "@/components/motion/section-heading";
import { about } from "@/lib/about";

export function Certifications() {
  if (about.certifications.length === 0) return null;

  return (
    <section id="certifications" aria-labelledby="certifications-title" className="section-shell">
      <div className="page-container">
        <SectionHeading id="certifications-title" text="Certifications" />

        <ScrollReveal className="certification-list" stagger={0.08}>
          {about.certifications.map((entry, index) => {
            const name =
              typeof entry.name === "string"
                ? entry.name
                : typeof entry.title === "string"
                  ? entry.title
                  : null;

            if (!name) return null;

            const issuer = typeof entry.issuer === "string" ? entry.issuer : null;
            const date = typeof entry.date === "string" ? entry.date : null;

            return (
              <li key={`${name}-${index}`} data-reveal>
                <strong>{name}</strong>
                {issuer ? <span>{issuer}</span> : null}
                {date ? <span>{date}</span> : null}
              </li>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
