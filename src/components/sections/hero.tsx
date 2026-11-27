import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { HeroEntrance } from "@/components/motion/hero-entrance";
import { HeroRoles } from "@/components/motion/hero-roles";
import { SocialLinks } from "@/components/social-links";
import { about } from "@/lib/about";

export function Hero() {
  const { identity, about: aboutContent, contact } = about;
  const photo = identity.photo;

  return (
    <section aria-labelledby="hero-title" data-hero>
      <HeroEntrance className="page-container hero-inner">
        {photo ? (
          <figure data-hero-portrait className="hero-portrait">
            <div className="hero-portrait-media">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 900px) 17rem, 64vw"
                className="hero-portrait-image"
              />
            </div>
          </figure>
        ) : null}

        <h1
          id="hero-title"
          data-hero-name
          aria-label={identity.fullName}
          className="hero-name"
        >
          <span className="hero-name-mask">
            <span data-hero-name-text className="hero-name-text">
              {identity.fullName}
            </span>
          </span>
        </h1>

        <div className="hero-baseline">
          <div data-hero-column className="hero-bio">
            {aboutContent.short ? (
              <p className="hero-bio-text">{aboutContent.short}</p>
            ) : null}
          </div>

          <div data-hero-column className="hero-actions">
            <a href="#work" className="hero-primary">
              View work
              <ArrowUpRight aria-hidden="true" />
            </a>
            <SocialLinks socials={contact.socials} labels className="hero-socials" />
          </div>

          <div data-hero-column className="hero-roles">
            <HeroRoles roles={identity.heroRoles} />
          </div>
        </div>
      </HeroEntrance>
    </section>
  );
}
