/**
 * Section order is a design decision from PRD.md, not portfolio content.
 * Shared by the header and footer so both stay in sync.
 */
export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
] as const;
