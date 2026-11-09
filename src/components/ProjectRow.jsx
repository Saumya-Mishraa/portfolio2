import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitWords from "./SplitWords";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

// Data keeps its original labels; the UI shows the editorial wording.
const linkLabel = (label) => (label === "GitHub" ? "View Code" : "View Project");

export default function ProjectRow({ project, total, priority = false }) {
  const rowRef = useRef(null);
  const [imgW, imgH] = project.imageSize;
  // Phones show a compact card (4-line description, no feature list) with an optional expand toggle.
  const [expanded, setExpanded] = useState(false);
  const detailsId = `proj-details-${project.number}`;

  // Card height changes when expanded, so scroll-linked positions further down the page need re-measuring.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [expanded]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const row = rowRef.current;
    const ctx = gsap.context(() => {
      // Card rises in; once only so scrolling back never replays it.
      gsap.fromTo(
        row,
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: row, start: "top 88%", once: true } }
      );
      gsap.fromTo(
        row.querySelectorAll(".proj-title .split-word > span"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.035, ease: "power4.out", scrollTrigger: { trigger: row, start: "top 80%", once: true } }
      );
      // Screenshot is unveiled with a soft wipe while the image settles from a slight zoom.
      gsap.fromTo(
        row.querySelector(".proj-media"),
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.out",
          clearProps: "clipPath",
          scrollTrigger: { trigger: row, start: "top 80%", once: true },
        }
      );
      gsap.fromTo(
        row.querySelector(".proj-media img"),
        { scale: 1.12 },
        { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: row, start: "top 80%", once: true } }
      );
      // Supporting copy follows the title in a gentle cascade.
      gsap.fromTo(
        row.querySelectorAll(".proj-number, .proj-desc, .proj-features, .proj-stack, .proj-links"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          delay: 0.25,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: row, start: "top 78%", once: true },
        }
      );
    }, row);
    return () => ctx.revert();
  }, []);

  const isReverse = project.layout === "large-right";
  const primary = project.links[0];

  return (
    <article ref={rowRef} className={`project-row ${isReverse ? "is-reverse" : ""} ${expanded ? "is-expanded" : ""}`}>
      <span className="proj-bignum" aria-hidden="true">{project.number}</span>

      <div className="proj-media" data-cursor="project" style={{ aspectRatio: `${imgW} / ${imgH}` }}>
        <span className="proj-tag">{project.category}</span>
        <a href={primary.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            width={imgW}
            height={imgH}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        </a>
      </div>

      <div className="proj-copy">
        {/* Card-style category pill: shown above the preview on tablet/phone (the overlay pill is desktop-only) */}
        <span className="proj-tag proj-tag--card">{project.category}</span>
        <span className="proj-number">
          {project.number} / {String(total).padStart(2, "0")}
        </span>
        <h3 className="proj-title">
          <SplitWords text={project.title} />
        </h3>
        <p className="proj-desc" id={detailsId}>{project.description}</p>
        {project.features && (
          <button
            type="button"
            className="proj-more"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setExpanded((v) => !v)}
          >
            <span aria-hidden="true">{expanded ? "−" : "+"}</span> {expanded ? "Less details" : "More details"}
          </button>
        )}
        {project.features && (
          <ul className="proj-features">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        <ul className="proj-stack" aria-label="Technology stack">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="proj-links">
          {project.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`proj-link ${i === 0 ? "proj-link--primary" : ""}`}
              data-cursor="button"
            >
              {linkLabel(l.label)} <span className="arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
