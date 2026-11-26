import { ArrowUp } from "lucide-react";

import { SocialLinks } from "@/components/social-links";
import { about } from "@/lib/about";
import { navLinks } from "@/lib/navigation";

export function Footer() {
  const { identity, contact } = about;

  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-glass">
          <div className="footer-primary">
            <a href="#top" className="footer-brand">
              {identity.fullName}
            </a>
            <p className="footer-role">{identity.title}</p>
            <p className="footer-location">
              {identity.location.city}, {identity.location.country}
            </p>
          </div>

          <nav aria-label="Footer" className="footer-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer-socials">
            <SocialLinks socials={contact.socials} labels />
          </div>
        </div>

        <div className="footer-bottom">
          <a href="#top" className="footer-back">
            Back to top
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
