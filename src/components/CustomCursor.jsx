import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Desktop-only (fine pointer, wide screen). Uses delegated listeners so it never
// needs to re-scan the DOM or stack duplicate handlers as React re-renders.
const query = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  window.innerWidth > 860;

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [enabled] = useState(query);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const tag = labelRef.current;

    gsap.set([dot, ring, tag], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const tagX = gsap.quickTo(tag, "x", { duration: 0.45, ease: "power3.out" });
    const tagY = gsap.quickTo(tag, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e) => {
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
      tagX(e.clientX); tagY(e.clientY);
    };
    const onDown = () => gsap.to(ring, { scale: "-=0.2", duration: 0.2, overwrite: "auto" });
    const onUp = () => gsap.to(ring, { scale: "+=0.2", duration: 0.2, overwrite: "auto" });

    let current = null;
    const activate = (el) => {
      current = el;
      if (el.getAttribute("data-cursor") === "project") {
        setLabel("VIEW PROJECT ↗");
        gsap.to(ring, { scale: 2.8, duration: 0.4, ease: "power3.out", overwrite: "auto" });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      } else {
        setLabel("");
        gsap.to(ring, { scale: 1.8, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      }
    };
    const deactivate = () => {
      current = null;
      setLabel("");
      gsap.to(ring, { scale: 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };
    const onOver = (e) => {
      const el = e.target.closest?.("[data-cursor]");
      if (el && el !== current) activate(el);
      else if (!el && current) deactivate();
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.body.classList.remove("cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-label" ref={labelRef} aria-hidden="true">{label}</div>
    </>
  );
}
