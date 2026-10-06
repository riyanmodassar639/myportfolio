import React, { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openCardId, setOpenCardId] = useState(null);
  const scrollerRef = useRef(null);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    fetch(
      "https://riyanportfolio.site.je/server/certifications/getCertifications.php"
    )
      .then((res) => res.json())
      .then((data) => {
        const liveCertificates = (data.certifications || []).filter(
          (item) => item.is_live == 1
        );

        setCertifications(liveCertificates);
      })
      .catch((err) => console.log(err));
  }, []);

  // Scrolls the carousel (mobile only — on desktop the grid doesn't
  // scroll horizontally, so this is a no-op there) to a given slide.
  const goToSlide = (index) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const clamped = Math.max(0, Math.min(index, certifications.length - 1));
    const card = scroller.children[clamped];

    if (card) {
      scroller.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }

    setActiveIndex(clamped);
  };

  // Keeps activeIndex (and therefore the arrow enabled/disabled
  // state) in sync when the user swipes by hand instead of tapping
  // the arrows.
  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const cardWidth = scroller.children[0]?.offsetWidth || 1;
      const index = Math.round(scroller.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(index, certifications.length - 1)));
    }, 100);
  };

  // Tapping the image reveals its info overlay — desktop already
  // shows this on ":hover", but touch devices have no hover, so a
  // tap toggles the same overlay open/closed instead.
  const toggleCard = (id) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="certifications" id="certifications">
      <div className="container">
        <Reveal as="div" className="certifications-head">
          <span className="certifications-label">CERTIFICATIONS</span>

          <h2 className="certifications-title">
            Professional Certifications
          </h2>

          <p className="certifications-text">
            Certifications and professional achievements earned
            throughout my learning journey.
          </p>
        </Reveal>

        <div className="certifications-carousel">
          {certifications.length > 1 && (
            <button
              type="button"
              className="cert-arrow cert-arrow-left"
              aria-label="Previous certificate"
              onClick={() => goToSlide(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              ‹
            </button>
          )}

          {certifications.length > 0 ? (
            <div
              className="certifications-grid"
              ref={scrollerRef}
              onScroll={handleScroll}
            >
              {certifications.map((certificate, i) => (
                <Reveal
                  as="div"
                  className={
                    "certificate-card" +
                    (openCardId === certificate.id ? " show-overlay" : "")
                  }
                  delay={i * 0.1}
                  key={certificate.id}
                >
                  <div
                    className="certificate-image"
                    onClick={() => toggleCard(certificate.id)}
                  >
                    <img
                      src={`https://riyanportfolio.site.je/server/${certificate.certificate_image}`}
                      alt={certificate.certificate_name}
                    />

                    <div
                      className="certificate-overlay"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="certificate-year">
                        {certificate.year}
                      </span>

                      <h3>{certificate.certificate_name}</h3>

                      <h4>{certificate.organization}</h4>

                      <p>{certificate.description}</p>

                      {certificate.credential_link && (
                        <a
                          href={certificate.credential_link}
                          target="_blank"
                          rel="noreferrer"
                          className="certificate-btn"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p>No Certifications Found</p>
          )}

          {certifications.length > 1 && (
            <button
              type="button"
              className="cert-arrow cert-arrow-right"
              aria-label="Next certificate"
              onClick={() => goToSlide(activeIndex + 1)}
              disabled={activeIndex === certifications.length - 1}
            >
              ›
            </button>
          )}
        </div>

        {certifications.length > 1 && (
          <div className="cert-dots">
            {certifications.map((certificate, i) => (
              <button
                type="button"
                key={certificate.id}
                className={
                  "cert-dot" + (i === activeIndex ? " active" : "")
                }
                aria-label={`Go to certificate ${i + 1}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;