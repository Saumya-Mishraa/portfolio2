import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MagneticButton from "../components/MagneticButton";

import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

const resumeSections = ["Summary", "Skills", "Projects", "Internship", "Education"];

export default function Resume() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".resume-panel",
        { opacity: 0, y: 30, rotateX: 4 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="resume" className="section resume" ref={sectionRef}>
      <div className="section-inner resume-inner">
        <div className="resume-copy">
          <span className="eyebrow">Resume</span>
          <h2 className="section-title">Everything <em>on paper.</em></h2>
          <p>The complete overview — summary, skills, projects, internship and education — in one document.</p>
          <div className="resume-actions">
            <MagneticButton as="a" href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
              View Resume <span className="arrow">↗</span>
            </MagneticButton>
            <MagneticButton as="a" href="/resume.pdf" download="Saumya-Mishra-Resume.pdf" className="btn btn-outline">
              Download PDF <span className="arrow">↓</span>
            </MagneticButton>
          </div>
        </div>

        <a href="/resume.pdf" target="_blank" rel="noreferrer" className="resume-panel" data-cursor="project">
          <div className="resume-panel-header">
            <span>Saumya Mishra</span>
            <span>Resume.pdf</span>
          </div>
          <p className="resume-panel-role">Full-Stack Developer | UI/UX Designer</p>
          <div className="resume-panel-lines">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={{ width: `${100 - i * 6}%` }} />
            ))}
          </div>
          <ul className="resume-panel-sections" aria-label="Resume sections">
            {resumeSections.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </a>
      </div>
    </section>
  );
}
