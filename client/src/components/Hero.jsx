import React, { useEffect, useRef, useState } from "react";
import fallbackProfileImage from "../assets/images/profile.png";

const defaultHero = {
  greeting: "Hello,",
  title: "Building modern digital experiences for the web",
  role: "Full Stack Web Developer",
  description:
    "I create clean, modern and user-friendly websites with React, JavaScript, PHP and backend technologies.",
  skills: "HTML,CSS,JavaScript,React,Node.js,PHP",
  profile_image: "",
  resume_link: "",
  btn1_text: "View Projects",
  btn1_link: "#projects",
  btn2_text: "Contact Me",
  btn2_link: "#contact",
  is_available_for_hire: false,
};

const Hero = () => {
  const [hero, setHero] = useState(defaultHero);
  const heroRef = useRef(null);
  const imageWrapRef = useRef(null);

  useEffect(() => {
    fetch("https://riyanportfolio.site.je/server/hero/getHero.php")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setHero({
            greeting: data.greeting || defaultHero.greeting,
            title: data.title || defaultHero.title,
            role: data.role || defaultHero.role,
            description: data.description || defaultHero.description,
            skills: data.skills || defaultHero.skills,
            profile_image: data.profile_image || "",
            resume_link: data.resume_link || "",
            btn1_text: data.btn1_text || defaultHero.btn1_text,
            btn1_link: data.btn1_link || defaultHero.btn1_link,
            btn2_text: data.btn2_text || defaultHero.btn2_text,
            btn2_link: data.btn2_link || defaultHero.btn2_link,
            is_available_for_hire: Number(data.is_available_for_hire) === 1,
          });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // cursor-follow spotlight across the whole hero + subtle image parallax
  useEffect(() => {
    const heroEl = heroRef.current;
    const imageWrap = imageWrapRef.current;
    if (!heroEl) return;

    const handleMove = (e) => {
      const rect = heroEl.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      heroEl.style.setProperty("--spot-x", `${px}%`);
      heroEl.style.setProperty("--spot-y", `${py}%`);

      if (imageWrap) {
        const irect = imageWrap.getBoundingClientRect();
        const relX = (e.clientX - irect.left - irect.width / 2) / irect.width;
        const relY = (e.clientY - irect.top - irect.height / 2) / irect.height;
        imageWrap.style.setProperty("--parallax-x", `${relX * 14}px`);
        imageWrap.style.setProperty("--parallax-y", `${relY * 14}px`);
      }
    };

    const resetMove = () => {
      if (imageWrap) {
        imageWrap.style.setProperty("--parallax-x", `0px`);
        imageWrap.style.setProperty("--parallax-y", `0px`);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", resetMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", resetMove);
    };
  }, []);

  const skillTags = (hero.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const heroImageSrc = hero.profile_image
    ? `https://riyanportfolio.site.je/server/${encodeURI(hero.profile_image)}`
    : fallbackProfileImage;

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-aurora"></div>
      <div className="hero-bg-gradient"></div>
      <div className="hero-blob hero-blob-1"></div>
      <div className="hero-blob hero-blob-2"></div>
      <div className="hero-blob hero-blob-3"></div>
      <div className="hero-grid-overlay"></div>
      <div className="hero-noise"></div>
      <div className="hero-spotlight"></div>

      <div className="container hero-inner">
        <div className="hero-content">
          {hero.is_available_for_hire && (
            <div className="hero-availability-badge hero-anim hero-anim-1">
              <span className="hero-availability-dot" aria-hidden="true"></span>
              Available for Hire
            </div>
          )}

          <p className="hero-greeting hero-anim hero-anim-1">
            {hero.greeting}
          </p>

          <h1 className="hero-title hero-anim hero-anim-2">
            {hero.title}
          </h1>

          <h2 className="hero-role hero-anim hero-anim-3">{hero.role}</h2>

          <p className="hero-text hero-anim hero-anim-4">
            {hero.description}
          </p>

          <div className="hero-buttons hero-anim hero-anim-5">
            {hero.btn1_text && (
              <a href={hero.btn1_link || "#"} className="btn btn-dark">
                {hero.btn1_text}
              </a>
            )}

            {hero.btn2_text && (
              <a href={hero.btn2_link || "#"} className="btn btn-light">
                {hero.btn2_text}
              </a>
            )}

            {hero.resume_link && (
              <a
                href={`https://riyanportfolio.site.je/server/${encodeURI(
                  hero.resume_link
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-resume"
              >
                Download Resume
              </a>
            )}
          </div>

          <div className="hero-bottom hero-anim hero-anim-6">
            <div className="hero-divider"></div>

            {skillTags.length > 0 && (
              <div className="hero-skills">
                {skillTags.map((skill, i) => (
                  <span key={i}>{skill}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className="hero-image-wrap hero-anim hero-anim-3"
          ref={imageWrapRef}
        >
          <div className="hero-image-frame">
            <div className="hero-image-ring"></div>
            <div className="hero-image-orbit-dot hero-image-orbit-dot-1"></div>
            <div className="hero-image-orbit-dot hero-image-orbit-dot-2"></div>
            <div className="hero-image">
              <img src={heroImageSrc} alt="Profile" />
            </div>
          </div>
        </div>

        <span className="hero-shape hero-shape-left"></span>
        <span className="hero-shape hero-shape-right"></span>
      </div>

      <a href="#about" className="hero-scroll-cue" aria-label="Scroll to About section">
        Scroll
        <span className="hero-scroll-cue-line"></span>
      </a>
    </section>
  );
};

export default Hero;