import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";

export default function Education() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetch("https://riyanportfolio.site.je/server/education/getEducation.php")
      .then((res) => res.json())
      .then((data) => {
        const liveEducation = (data.education || []).filter(
          (item) => item.is_live == 1
        );

        setEducation(liveEducation);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="education" id="education">
      <div className="container">
        <Reveal as="div" className="education-head">
          <span className="education-label">EDUCATION</span>

          <h2 className="education-title">Academic Background</h2>

          <p className="education-text">
            My academic journey built the technical foundation that
            supports my work in modern web development and software
            engineering.
          </p>
        </Reveal>

        <div className="education-timeline">
          {education.length > 0 ? (
            education.map((item, i) => (
              <Reveal
                as="div"
                className="education-item"
                delay={i * 0.12}
                key={item.id}
              >
                <div className="education-dot"></div>

                <div className="education-year">{item.year}</div>

                <div className="education-content">
                  <h3>{item.title}</h3>

                  <h4>{item.institute}</h4>

                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))
          ) : (
            <p className="education-empty">No Education Found</p>
          )}
        </div>
      </div>
    </section>
  );
}