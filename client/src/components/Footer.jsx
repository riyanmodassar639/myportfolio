import React from "react";
import Reveal from "./Reveal";

/* ---------- Small inline icons (stroke/fill = currentColor, no external deps) ---------- */

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 19 19" fill="currentColor">
    <path fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.94 5.00002C6.94 6.10002 6.06 7.00002 4.97 7.00002C3.88 7.00002 3 6.10002 3 5.00002C3 3.90002 3.88 3.00002 4.97 3.00002C6.06 3.00002 6.94 3.90002 6.94 5.00002ZM7 8.48002H3V21H7V8.48002ZM13.5 8.48002H9.71V21H13.5V14.72C13.5 11.07 18.15 10.79 18.15 14.72V21H21.95V13.54C21.95 6.99002 15.32 7.23002 13.5 10.46V8.48002Z" />
  </svg>
);

const FiverrIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UpworkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/* Static placeholders — edit with your real email / phone number. */
const CONTACT_INFO = {
  email: "riyanmodassar639@gmail.com", // TODO: paste your real Gmail here
  phone: "+92 347 0758060", // TODO: paste your real phone number here
};

/* Same profile links used in the Contact section, kept in sync here. */
const SOCIAL_LINKS = [
  {
    name: "GitHub",
    icon: <GithubIcon />,
    href: "https://github.com/riyanmodassar639",
  },
  {
    name: "LinkedIn",
    icon: <LinkedinIcon />,
    href: "https://www.linkedin.com/in/riyan-modassar-35904b373?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Fiverr",
    icon: <FiverrIcon />,
    href: "https://www.fiverr.com/s/m5pKp58",
  },
  {
    name: "Upwork",
    icon: <UpworkIcon />,
    href: "https://www.upwork.com/freelancers/~018215660511572604?mp_source=share",
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Reveal as="div" className="footer-left">
          <h3>Riyan Modassar</h3>
          <p>
            Full Stack Web Developer building modern web applications,
            ecommerce platforms and automation solutions.
          </p>

          <div className="footer-contact-info">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="footer-contact-link"
            >
              <MailIcon />
              <span>{CONTACT_INFO.email}</span>
            </a>

            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
              className="footer-contact-link"
            >
              <PhoneIcon />
              <span>{CONTACT_INFO.phone}</span>
            </a>
          </div>

          <div className="footer-social">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal as="nav" className="footer-right" delay={0.15}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </Reveal>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Riyan Modassar Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;