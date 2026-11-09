import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

// Fades + lifts every [data-reveal] element inside `ref` once it scrolls into view.
// Content is fully visible by default; the hidden state only exists while GSAP runs,
// so reduced-motion users (and a failed script) always see everything.
export default function useReveal(ref) {
  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        const delay = Number(el.dataset.revealDelay) || 0;
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [ref]);
}
