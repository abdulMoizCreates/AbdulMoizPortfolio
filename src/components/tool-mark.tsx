import Image from "next/image";
import {
  Box,
  Camera,
  Clapperboard,
  FileSpreadsheet,
  Film,
  KeyRound,
  Palette,
  Video,
  type LucideIcon,
} from "lucide-react";

const brandMarks: Record<string, string> = {
  html: "html5",
  css: "css3",
  js: "javascript",
  javascript: "javascript",
  react: "react",
  "next.js": "nextjs",
  next: "nextjs",
  "node.js": "nodejs",
  node: "nodejs",
  express: "express",
  mongodb: "mongodb",
  "tailwind css": "tailwindcss",
  tailwind: "tailwindcss",
  supabase: "supabase",
  git: "git",
  github: "github",
  vercel: "vercel",
  docker: "docker",
  redis: "redis",
  "socket.io": "socketio",
  "premiere pro": "premierepro",
  "adobe premiere pro": "premierepro",
  "after effects": "aftereffects",
  "adobe after effects": "aftereffects",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  blender: "blender",
  canva: "canva",
};

const disciplineMarks: Record<string, LucideIcon> = {
  videography: Video,
  "video editing": Film,
  "graphic design": Palette,
  filmmaking: Clapperboard,
  photography: Camera,
  "3d animation": Box,
  "ms office and computer productivity": FileSpreadsheet,
  "jwt authentication": KeyRound,
  jwt: KeyRound,
};

type ToolMarkProps = {
  name: string;
  className?: string;
};

export function ToolMark({ name, className }: ToolMarkProps) {
  const normalized = name.trim().toLowerCase();
  const brand = brandMarks[normalized];

  if (brand) {
    return (
      <Image
        src={`/media/tool-icons/${brand}.svg`}
        alt=""
        aria-hidden="true"
        data-brand={brand}
        width={20}
        height={20}
        unoptimized
        className={`tool-mark ${className ?? ""}`}
      />
    );
  }

  const Icon = disciplineMarks[normalized];
  return Icon ? <Icon aria-hidden="true" className={`tool-mark ${className ?? ""}`} /> : null;
}
