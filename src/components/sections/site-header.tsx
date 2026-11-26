"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Location, Social } from "@/lib/about";
import { navLinks } from "@/lib/navigation";

type SiteHeaderProps = {
  brand: string;
  socials: Social[];
  location: Location;
};

export function SiteHeader({ brand, socials, location }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleChange = () => {
      if (media.matches) {
        setMenuOpen(false);
      }
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (menuOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }

      dialog.querySelector<HTMLAnchorElement>(".mobile-menu-nav a")?.focus();
      document.documentElement.style.overflow = "hidden";
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header data-scrolled={scrolled} className="site-header">
      <div className="page-container">
        <Link href="/" aria-label={`${brand}, home`} className="site-brand">
          {brand}
        </Link>

        <nav aria-label="Primary" className="site-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle />

          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="header-button md:hidden"
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Site menu"
        onClose={() => {
          setMenuOpen(false);
          menuButtonRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setMenuOpen(false);
          }
        }}
        className="mobile-menu"
      >
        <div className="page-container mobile-menu-inner">
          <div className="mobile-menu-top">
            <Link href="/" className="mobile-menu-brand" onClick={() => setMenuOpen(false)}>
              {brand}
            </Link>

            <div className="header-actions">
              <ThemeToggle />

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="header-button"
              >
                <X aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav aria-label="Mobile navigation" className="mobile-menu-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>

          <p className="mobile-menu-location">
            {location.city}, {location.country}
          </p>

          <div className="mobile-menu-socials">
            <SocialLinks socials={socials} labels />
          </div>
        </div>
      </dialog>
    </header>
  );
}
