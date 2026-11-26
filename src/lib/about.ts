import { z } from "zod";

import rawAbout from "@/data/about.json";

const text = z.string().min(1);
const nullableText = z.string().nullable();

const locationSchema = z.object({
  city: text,
  country: text,
});

const photoSchema = z.object({
  src: text,
  alt: text,
  note: z.string().optional(),
});

const roleSchema = z.object({
  id: text,
  label: text,
  statement: text,
  description: text,
  tools: z.array(text).default([]),
});

const experienceSchema = z.object({
  role: text,
  type: text,
  start: z.string(),
  end: z.string().nullable().optional(),
  summary: z.string().optional(),
  clients: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  institution: text,
  detail: z.string().optional(),
  status: z.string().optional(),
  program: z.string().nullable().optional(),
});

const skillsSchema = z.object({
  development: z.array(text).default([]),
  creativeTools: z.array(text).default([]),
  disciplines: z.array(text).default([]),
  note: z.string().optional(),
});

const showreelSchema = z.object({
  src: nullableText,
  poster: nullableText,
  note: z.string().optional(),
});

const websiteSchema = z.object({
  id: text,
  title: text,
  description: z.string().default(""),
  stack: z.array(text).default([]),
  repo: z.url().nullable().optional(),
  live: z.url().nullable().optional(),
  image: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional(),
});

const videoSchema = z
  .object({
    id: z.string().optional(),
    title: text,
    description: z.string().optional(),
    src: nullableText.optional(),
    poster: nullableText.optional(),
    thumbnail: nullableText.optional(),
    url: z.url().nullable().optional(),
  })
  .loose();

const inProgressSchema = z.object({
  title: text,
  description: z.string().default(""),
  status: z.string().default("planned"),
  showInWork: z.boolean().default(false),
});

const socialSchema = z.object({
  platform: text,
  handle: z.string().nullable(),
  url: z.url().nullable(),
});

const contactSchema = z.object({
  email: z.email().nullable(),
  phone: z.string().nullable(),
  availability: z.string().nullable(),
  socials: z.array(socialSchema).default([]),
  resume: z
    .object({
      src: z.string().nullable(),
    })
    .default({ src: null }),
});

const seoSchema = z.object({
  title: text,
  description: text,
  ogImage: z.string().nullable().optional(),
});

const privateSchema = z.object({
  display: z.boolean().default(false),
  note: z.string().optional(),
  age: z.number().nullable().optional(),
  background: z.string().optional(),
  tone: z.string().optional(),
});

const aboutSchema = z.object({
  meta: z.object({
    version: z.number().int(),
    brand: text,
    note: z.string().optional(),
  }),
  identity: z.object({
    firstName: text,
    lastName: text,
    fullName: text,
    location: locationSchema,
    title: text,
    heroRoles: z.array(text).default([]),
    photo: photoSchema.nullable().default(null),
  }),
  about: z.object({
    short: z.string().default(""),
    long: z.string().default(""),
    roles: z.array(roleSchema).default([]),
  }),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: skillsSchema,
  marquee: z.array(text).default([]),
  work: z.object({
    showreel: showreelSchema.default({ src: null, poster: null }),
    websites: z.array(websiteSchema).default([]),
    videos: z.array(videoSchema).default([]),
    inProgress: z.array(inProgressSchema).default([]),
    note: z.string().optional(),
  }),
  // Entries are added by the owner. The schema is intentionally permissive
  // until the first real certification exists; never invent one.
  certifications: z.array(z.record(z.string(), z.unknown())).default([]),
  contact: contactSchema,
  seo: seoSchema,
  private: privateSchema.optional(),
});

const publicAboutSchema = aboutSchema.omit({ private: true });

export type About = z.infer<typeof publicAboutSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Website = z.infer<typeof websiteSchema>;
export type Video = z.infer<typeof videoSchema>;
export type Social = z.infer<typeof socialSchema>;

const parsedAbout = publicAboutSchema.safeParse(rawAbout);

if (!parsedAbout.success) {
  throw new Error(
    `docs/about.json does not match the schema:\n${z.prettifyError(parsedAbout.error)}`,
  );
}

/**
 * Validated, typed portfolio content.
 *
 * The `private` block is stripped here and never reaches the UI.
 * Components must read content through this module, never the raw JSON.
 */
export const about: About = parsedAbout.data;

export function getAbout(): About {
  return about;
}

export function getIdentity() {
  return about.identity;
}

export function getAboutContent() {
  return about.about;
}

export function getExperience() {
  return about.experience;
}

export function getEducation() {
  return about.education;
}

export function getSkills() {
  return about.skills;
}

export function getMarquee() {
  return about.marquee;
}

export function getWork() {
  return about.work;
}

export function getCertifications() {
  return about.certifications;
}

export function getContact() {
  return about.contact;
}

export function getSeo() {
  return about.seo;
}
