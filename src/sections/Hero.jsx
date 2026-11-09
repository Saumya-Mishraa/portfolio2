import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MagneticButton from "../components/MagneticButton";
import portrait from "../assets/images/portrait-cutout.webp";
import { social } from "../data/content";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

const specialties = ["UI/UX", "Web Design", "Full Stack Developer"];

export default function Hero() {
  const heroRef = useRef(null);
  const portraitImgRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Oversized wordmark rises out of a mask; clip-path is cleared afterwards so
      // the serif ascenders are never cropped.
      tl.from(".hero-portfolio", { opacity: 0, y: 80, clipPath: "inset(0 0 100% 0)", duration: 1.5, clearProps: "clipPath" })
        .from(".hero-portrait", { opacity: 0, y: 70, duration: 1.4 }, "-=1.15")
        .from(portraitImgRef.current, { scale: 1.07, duration: 1.8, ease: "power3.out", clearProps: "scale" }, "<")
        .from(".hero-specialty", { opacity: 0, x: -24, duration: 0.8, stagger: 0.1 }, "-=1.1")
        .from(".hero-name", { opacity: 0, x: -16, duration: 0.8 }, "-=0.95")
        .from(".hero-big-line", { opacity: 0, y: 48, clipPath: "inset(0 0 100% 0)", duration: 1, stagger: 0.13, clearProps: "clipPath" }, "-=0.75")
        .from(".hero-intro, .hero-cta", { opacity: 0, y: 18, duration: 0.7, stagger: 0.1 }, "-=0.55")
        .from(".hero-social-item", { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, "-=0.5");

      const mm = gsap.matchMedia();

      // Pointer-only polish: gentle mouse parallax + the wordmark drifting slower than the page.
      mm.add("(hover: hover) and (pointer: fine) and (min-width: 861px)", () => {
        const imgX = gsap.quickTo(portraitImgRef.current, "x", { duration: 0.9, ease: "power2.out" });
        const imgY = gsap.quickTo(portraitImgRef.current, "y", { duration: 0.9, ease: "power2.out" });
        const wordX = gsap.quickTo(".hero-portfolio", "x", { duration: 1.1, ease: "power2.out" });
        const onMove = (e) => {
          const relX = (e.clientX / window.innerWidth - 0.5) * 2;
          const relY = (e.clientY / window.innerHeight - 0.5) * 2;
          imgX(relX * 12); imgY(relY * 8); wordX(relX * -10);
        };
        window.addEventListener("mousemove", onMove, { passive: true });

        gsap.to(".hero-portfolio", {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-portrait", {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        });
        return () => window.removeEventListener("mousemove", onMove);
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-glow" aria-hidden="true" />

      {/* Draws a clean outline of solid text (solid minus an eroded copy). Unlike
          -webkit-text-stroke it never exposes the font's internal overlapping contours. */}
      <svg className="hero-filters" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="hero-outline" x="-4%" y="-8%" width="108%" height="116%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" operator="erode" radius="1.4" result="eroded" />
            <feComposite in="SourceGraphic" in2="eroded" operator="out" />
          </filter>
        </defs>
      </svg>

      <div className="hero-stage">
        <h1 className="hero-portfolio">
          <span className="visually-hidden">Saumya Mishra — </span>
          Portfolio
        </h1>

        <div className="hero-portrait">
          <div className="hero-portrait-frame">
            <img
              ref={portraitImgRef}
              src={portrait}
              alt="Portrait of Saumya Mishra"
              className="hero-portrait-img"
              width="868"
              height="1158"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <ul className="hero-specialties" aria-label="Specialties">
          {specialties.map((s) => (
            <li className="hero-specialty" key={s}>{s}</li>
          ))}
        </ul>

        <div className="hero-right">
          <p className="hero-name">Saumya Mishra</p>
          <p className="hero-big hero-big-line hero-big--solid" aria-hidden="true">Developer</p>
          <p className="hero-big hero-big-line hero-big--outline" aria-hidden="true">
            <span className="hero-amp">&amp;</span> <span className="hero-outline-word">Designer</span>
          </p>
          <p className="visually-hidden">Web Developer &amp; Designer</p>

          <p className="hero-intro">
            I design and build modern, responsive web experiences — from considered
            interfaces in React to Node.js and MongoDB-backed APIs.
          </p>

          <div className="hero-actions">
            <MagneticButton as="button" className="btn btn-primary hero-cta" onClick={() => scrollTo("#work")}>
              Explore My Work <span className="arrow">↗</span>
            </MagneticButton>
            <MagneticButton as="button" className="btn btn-outline hero-cta" onClick={() => scrollTo("#contact")}>
              Contact Me <span className="arrow">↗</span>
            </MagneticButton>
          </div>
        </div>

        <div className="hero-social">
          <a className="hero-social-item" href={social.github} target="_blank" rel="noreferrer">
            <span className="hero-social-label">github</span>
            <span className="hero-social-handle">Saumya-Mishraa</span>
            <span className="hero-social-bar" aria-hidden="true" />
          </a>
          <a className="hero-social-item" href={social.linkedin} target="_blank" rel="noreferrer">
            <span className="hero-social-label">linkedin</span>
            <span className="hero-social-handle">Saumya Mishra</span>
            <span className="hero-social-bar" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
