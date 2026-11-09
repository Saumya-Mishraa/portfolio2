import { useRef } from "react";
import { projects } from "../data/content";
import ProjectRow from "../components/ProjectRow";
import useReveal from "../hooks/useReveal";

export default function Work() {
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section id="work" className="section work" ref={sectionRef}>
      <div className="section-inner">
        <div className="work-heading">
          <span className="eyebrow" data-reveal>Selected Projects</span>
          <h2 className="section-title" data-reveal data-reveal-delay="0.08">
            {projects.length} projects, <em>built with care.</em>
          </h2>
        </div>
      </div>

      <div className="section-inner work-list">
        {projects.map((p, i) => (
          <ProjectRow key={p.number} project={p} total={projects.length} priority={i === 0} />
        ))}
      </div>
    </section>
  );
}
