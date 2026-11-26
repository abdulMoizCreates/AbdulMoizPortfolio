import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type SectionHeadingProps = {
  id: string;
  text: string;
  kicker?: string;
  emphasis?: string[];
};

/**
 * A masked, bottom-to-top heading reveal consistent across the editorial
 * sections. The About reel keeps its own heading and motion.
 */
export function SectionHeading({ id, text, kicker, emphasis }: SectionHeadingProps) {
  return (
    <ScrollReveal className="section-head">
      {kicker ? (
        <p className="section-kicker" data-reveal>
          {kicker}
        </p>
      ) : null}
      <h2 id={id} aria-label={text}>
        <MaskReveal text={text} emphasis={emphasis} />
      </h2>
    </ScrollReveal>
  );
}
