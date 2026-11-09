import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

// Taken from the portfolio README ("I enjoy combining…")
const combine = [
  "Frontend Development",
  "Backend Development",
  "Database Integration",
  "UI / UX Design",
  "Animation & Interaction",
];

const facts = [
  {
    label: "Focus",
    text: "Web & full-stack application development, database-driven systems, UI/UX and API integration.",
  },
  {
    label: "Currently",
    text: "Pursuing a Bachelor of Computer Applications at MAIMS, Delhi, India (2024 – Present).",
  },
  {
    label: "Approach",
    text: "Comfortable moving from CRUD-driven backends to polished, responsive frontends — and everything in between.",
  },
];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-title .split-word > span, .about-reveal",
        { yPercent: 0, opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".about-card, .about-combine li",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-right", start: "top 78%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section about" ref={sectionRef}>
      <div className="about-orb about-orb--a" aria-hidden="true" />
      <div className="about-orb about-orb--b" aria-hidden="true" />

      <div className="section-inner about-grid">
        <div className="about-left">
          <span className="eyebrow about-reveal">About Me</span>
          <h2 className="section-title about-title">
            Creative <em>designer</em> &amp; developer.
          </h2>
          <p className="about-lede about-reveal">
            I&rsquo;m Saumya Mishra — a Full Stack Developer and BCA student passionate about
            building modern, responsive and interactive web applications.
          </p>
          <p className="about-copy about-reveal">
            My goal is to create digital experiences that are not only functional, but also
            beautiful, intuitive and memorable — with hands-on experience across the stack,
            from responsive React interfaces to REST APIs backed by Node.js, Express and MongoDB.
          </p>

          <div className="about-combine-wrap about-reveal">
            <span className="about-mini-label">I enjoy combining</span>
            <ol className="about-combine">
              {combine.map((c, i) => (
                <li key={c}>
                  <span className="about-combine-num">{String(i + 1).padStart(2, "0")}</span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="about-right">
          {facts.map((f) => (
            <article className="about-card" key={f.label}>
              <h3 className="about-card-label">{f.label}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
