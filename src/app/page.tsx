import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Journey } from "@/components/sections/journey";
import { Skills } from "@/components/sections/skills";
import { SiteHeader } from "@/components/sections/site-header";
import { ToolsMarquee } from "@/components/sections/tools-marquee";
import { Work } from "@/components/sections/work";
import { about } from "@/lib/about";

export default function Home() {
  return (
    <>
      <SiteHeader
        brand={about.identity.fullName}
        socials={about.contact.socials}
        location={about.identity.location}
      />
      <main id="main">
        <Hero />
        <ToolsMarquee items={about.marquee} />
        <About />
        <Journey />
        <Work />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
