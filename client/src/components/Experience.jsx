import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";

export default function Experience() {
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    fetch(
      "https://riyanportfolio.site.je/server/experience/getExperience.php"
    )
      .then((res) => res.json())
      .then((data) => {
        const liveExperience = (
          data.experience || []
        ).filter((item) => item.is_live == 1);

        setExperience(liveExperience);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="education" id="experience">
      <div className="container">
        <Reveal as="div" className="education-head">
          <span className="education-label">Experience</span>

          <h2 className="education-title">
            Professional Experience
          </h2>

          <p className="education-text">
            My practical experience in web
            development and software
            engineering projects.
          </p>
        </Reveal>

        <div className="education-timeline">
          {experience.length > 0 ? (
            experience.map((item, i) => (
              <Reveal
                as="div"
                className="education-item"
                delay={i * 0.12}
                key={item.id}
              >
                <div className="education-dot"></div>

                <div className="education-year">
                  {item.duration}
                </div>

                <div className="education-content">
                  <h3>{item.job_title}</h3>

                  <h4>{item.company}</h4>

                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))
          ) : (
            <p className="education-empty">No Experience Found</p>
          )}
        </div>
      </div>
    </section>
  );
}