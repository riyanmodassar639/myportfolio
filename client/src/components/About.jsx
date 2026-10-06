import React, { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const About = () => {
  const [section, setSection] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("https://riyanportfolio.site.je/server/about/getAbout.php")
      .then((res) => res.json())
      .then((data) => {
        setSection(data.section || null);

        const liveServices = (data.services || []).filter(
          (service) => service.is_live == 1
        );

        setServices(liveServices);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="about" id="about">
      <div className="about-aurora"></div>
      <div className="about-grid-overlay"></div>

      <div className="container about-inner">
        <div className="about-left">
          {services.length > 0 ? (
            services.map((service, i) => (
              <Reveal
                as="div"
                className="about-service"
                key={service.id}
                delay={i * 0.08}
              >
                <span className="about-dot"></span>
                <div className="about-icon"></div>

                <div>
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </div>
              </Reveal>
            ))
          ) : (
            <p className="about-empty">No services found</p>
          )}
        </div>

        <div className="about-right">
          <Reveal className="about-label-wrap">
            <span className="about-label-line"></span>
            <p className="about-label">About Me</p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="about-title">
              {section?.heading || "No Heading"}
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="about-text">
              {section?.description || "No Description"}
            </p>
          </Reveal>

          <div className="about-stats">
            <Reveal className="about-stat" delay={0.24}>
              <StatNumber value={section?.projects_completed} />
              <span>Projects Completed</span>
            </Reveal>

            <Reveal className="about-stat" delay={0.32}>
              <StatNumber value={section?.client_satisfaction} />
              <span>Client Satisfaction</span>
            </Reveal>

            <Reveal className="about-stat" delay={0.4}>
              <StatNumber value={section?.years_experience} />
              <span>Years Experience</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Renders a stat like "100%" or "10+" and counts the numeric part up
 * from 0 the first time it scrolls into view, keeping any trailing
 * symbol (%, +) intact.
 */
const StatNumber = ({ value }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!value) return;

    const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2] || "";
    const el = ref.current;
    if (!el) return;

    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const duration = 1200;
          const startTime = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            setDisplay(`${current}${suffix}`);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <h3 ref={ref}>{display}</h3>;
};

export default About;