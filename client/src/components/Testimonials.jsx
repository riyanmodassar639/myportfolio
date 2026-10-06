import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const getInitial = (name) => (name?.trim()?.charAt(0) || "?").toUpperCase();

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    fetch("https://riyanportfolio.site.je/server/testimonials/getTestimonials.php")
      .then((res) => res.json())
      .then((data) => {
        const live = (data.testimonials || []).filter(
          (item) => item.is_live == 1
        );

        setTestimonials(live);
      });
  }, []);

  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + 3 >= testimonials.length;

  const nextSlide = () => {
    if (startIndex + 3 < testimonials.length) {
      setStartIndex(startIndex + 3);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 3);
    }
  };

  const visibleTestimonials = testimonials.slice(startIndex, startIndex + 3);

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <Reveal as="div" className="skills-head">
          <span className="skills-label">TESTIMONIALS</span>

          <h2 className="skills-title">What People Say</h2>
        </Reveal>

        {testimonials.length === 0 ? (
          <p className="testimonials-empty">
            No testimonials yet — be the first to share your feedback.
          </p>
        ) : (
          <div className="testimonial-slider">
            <button
              className="slider-btn"
              onClick={prevSlide}
              disabled={isPrevDisabled}
              aria-label="Previous testimonials"
            >
              <ChevronLeft />
            </button>

            <div className="testimonials-grid">
              {visibleTestimonials.map((item, i) => (
                <Reveal
                  as="div"
                  className="testimonial-card"
                  delay={i * 0.1}
                  key={item.id}
                >
                  <span className="quote">&ldquo;</span>

                  <div className="testimonial-message-wrap">
                    <p className="testimonial-message">{item.message}</p>
                  </div>

                  <div className="testimonial-footer">
                    <div className="testimonial-avatar">
                      {getInitial(item.client_name)}
                    </div>

                    <div className="testimonial-person">
                      <h3>{item.client_name}</h3>
                      <span>{item.designation}</span>
                    </div>
                  </div>

                  <div className="rating-display">
                    {"★".repeat(item.rating || 5)}
                  </div>
                </Reveal>
              ))}
            </div>

            <button
              className="slider-btn"
              onClick={nextSlide}
              disabled={isNextDisabled}
              aria-label="Next testimonials"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;