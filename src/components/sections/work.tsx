import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionHeading } from "@/components/motion/section-heading";
import { about } from "@/lib/about";

export function Work() {
  const { showreel, websites, videos, inProgress } = about.work;
  const visibleProgress = inProgress.filter((item) => item.showInWork);

  if (
    !showreel.src &&
    websites.length === 0 &&
    videos.length === 0 &&
    visibleProgress.length === 0
  ) {
    return null;
  }

  return (
    <section id="work" aria-labelledby="work-title" className="section-shell work-section">
      <div className="page-container">
        <SectionHeading id="work-title" text="My work" kicker="Selected work" />

        {showreel.src ? (
          <div className="work-media">
            <video
              controls
              preload="none"
              poster={showreel.poster ?? undefined}
              aria-label="Showreel"
            >
              <source src={showreel.src} />
            </video>
          </div>
        ) : null}

        <ScrollReveal className="work-list" stagger={0.12}>
          {websites.map((project) => (
            <article key={project.id} className="work-item">
              {project.image ? (
                <div data-reveal className="work-media">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(min-width: 900px) 100vw, 100vw"
                  />
                </div>
              ) : null}

              <h3 data-reveal className="work-title">{project.title}</h3>

              {project.description ? (
                <p data-reveal className="work-description">{project.description}</p>
              ) : null}

              <div data-reveal className="work-meta">
                {project.stack.length > 0 ? (
                  <ul className="work-stack" aria-label={`${project.title} technologies`}>
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="work-links">
                  {project.live ? (
                    <a
                      className="work-link"
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit website
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ) : null}
                  {project.repo ? (
                    <a
                      className="work-link"
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source
                      <ExternalLink aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </ScrollReveal>

        {videos.length > 0 ? (
          <ScrollReveal className="work-list" stagger={0.12}>
            {videos.map((video) => (
              <article key={video.id ?? video.title} className="work-item">
                <h3 className="work-title">{video.title}</h3>
                {video.description ? (
                  <p className="work-description">{video.description}</p>
                ) : null}
                <div className="work-meta">
                  {video.url ? (
                    <div className="work-links">
                      <a
                        className="work-link"
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch video
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </ScrollReveal>
        ) : null}

        {visibleProgress.length > 0 ? (
          <div className="work-progress">
            <h3>In progress</h3>
            {visibleProgress.map((item) => (
              <article key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <span>{item.status}</span>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
