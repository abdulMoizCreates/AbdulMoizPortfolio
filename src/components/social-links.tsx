import {
  BriefcaseBusiness,
  Camera,
  CirclePlay,
  GitBranch,
  type LucideIcon,
} from "lucide-react";

import type { Social } from "@/lib/about";
import { cn } from "@/lib/utils";

const platformIcons: Record<string, LucideIcon> = {
  GitHub: GitBranch,
  LinkedIn: BriefcaseBusiness,
  Instagram: Camera,
  YouTube: CirclePlay,
};

type SocialLinksProps = {
  socials: Social[];
  orientation?: "horizontal" | "vertical";
  labels?: boolean;
  className?: string;
};

export function SocialLinks({
  socials,
  orientation = "horizontal",
  labels = false,
  className,
}: SocialLinksProps) {
  const availableSocials = socials.filter((social) => social.url);

  if (availableSocials.length === 0) return null;

  return (
    <ul
      aria-label="Social links"
      className={cn(
        "flex flex-wrap items-center",
        orientation === "vertical" ? "flex-col items-start gap-1" : "gap-x-5 gap-y-1",
        className,
      )}
    >
      {availableSocials.map((social) => {
        const Icon = platformIcons[social.platform];
        if (!Icon || !social.url) return null;

        return (
          <li key={social.platform}>
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${social.platform} (opens in a new tab)`}
              className="social-link"
            >
              <Icon aria-hidden="true" strokeWidth={1.65} />
              <span className={labels ? "social-link-text" : "social-link-label"}>
                {social.platform}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
