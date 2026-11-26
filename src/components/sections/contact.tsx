import { ArrowUpRight } from "lucide-react";

import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SocialLinks } from "@/components/social-links";
import { about } from "@/lib/about";

export function Contact() {
  const { contact } = about;
  const socials = contact.socials.filter((social) => social.url);
  const primarySocial = socials[0];

  const primaryHref = contact.email
    ? `mailto:${contact.email}`
    : contact.phone
      ? `tel:${contact.phone}`
      : primarySocial?.url;

  const primaryLabel = contact.email
    ? "Email me"
    : contact.phone
      ? "Call me"
      : primarySocial?.platform;

  const primaryIsExternal = !contact.email && !contact.phone && Boolean(primarySocial);

  const secondarySocials =
    primaryIsExternal && primarySocial
      ? socials.filter((social) => social.platform !== primarySocial.platform)
      : socials;

  if (!primaryHref && !contact.resume.src) return null;

  return (
    <section id="contact" aria-labelledby="contact-title" className="contact-section">
      <div className="page-container">
        <ScrollReveal className="contact-inner" stagger={0.12}>
          <h2 id="contact-title" aria-label="Have something in mind?" className="contact-heading">
            <MaskReveal text="Have something in mind?" />
          </h2>

          <div data-reveal className="contact-side">
            {contact.availability ? (
              <p className="contact-availability">{contact.availability}</p>
            ) : null}

            <div className="contact-actions">
              {primaryHref && primaryLabel ? (
                <a
                  className="contact-primary"
                  href={primaryHref}
                  {...(primaryIsExternal
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                >
                  {primaryLabel}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : null}

              {contact.resume.src ? (
                <a className="contact-link" href={contact.resume.src}>
                  View resume
                </a>
              ) : null}
            </div>

            {secondarySocials.length > 0 ? (
              <SocialLinks socials={secondarySocials} labels className="contact-links" />
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
