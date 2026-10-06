import React, { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("https://riyanportfolio.site.je/server/skills/getSkills.php")
      .then((res) => res.json())
      .then((data) => {
        const liveSkills = (data.skills || []).filter(
          (skill) => skill.is_live == 1
        );

        setSkills(liveSkills);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="skills" id="skills">
      <div className="skills-aurora"></div>

      <div className="container">
        <Reveal as="div" className="skills-head">
          <div className="skills-label-wrap">
            <span className="skills-label-line"></span>
            <span className="skills-label">Skills</span>
            <span className="skills-label-line skills-label-line-right"></span>
          </div>

          <h2 className="skills-title">Technical Skills</h2>

          <p className="skills-text">
            Technologies and tools I use to build modern web applications,
            scalable backend systems and efficient digital products.
          </p>
        </Reveal>

        <div className="skills-grid">
          {skills.length > 0 ? (
            skills.map((skill, i) => (
              <Reveal
                as="div"
                className="skill-card"
                key={skill.id}
                delay={(i % 4) * 0.08}
              >
                <div className="skill-top">
                  <h3>{skill.name}</h3>
                  <span>{skill.percentage}</span>
                </div>

                <SkillBar percentage={skill.percentage} />
              </Reveal>
            ))
          ) : (
            <p className="skills-empty">No Skills Found</p>
          )}
        </div>
      </div>
    </section>
  );
};

/**
 * Progress bar that grows from 0 up to its target width the first
 * time it scrolls into view, instead of already appearing full.
 */
const SkillBar = ({ percentage }) => {
  const ref = useRef(null);
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          requestAnimationFrame(() => setWidth(percentage || "0%"));
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div className="skill-bar" ref={ref}>
      <div className="skill-progress" style={{ width }}></div>
    </div>
  );
};

export default Skills;