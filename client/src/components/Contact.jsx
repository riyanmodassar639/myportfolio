import React, { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

// Get this from https://www.google.com/recaptcha/admin/create
// (reCAPTCHA v2 -> "I'm not a robot" Checkbox, domain: riyanportfolio.site.je)
const RECAPTCHA_SITE_KEY = "6LfFbFotAAAAAHRj2zWTOICLqm3JcDTyPsnAWydX";

/* ---------- Small inline icons (stroke/fill = currentColor, no external deps) ---------- */

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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

/* Fiverr = generic "gig / service" mark, Upwork = generic "briefcase" mark
   (kept simple + monochrome — swap for the real brand SVGs any time). */
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

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24H4a1 1 0 0 0-1 1v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.83z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ---------- Contact info shown in the "Let's Connect" card ---------- */
/* Static placeholders — edit the text directly below with your real details. */
const CONTACT_INFO = {
  email: "riyanmodassar639@gmail.com",
  phone: "+92 347 0758060",
  location: "Lahore, Pakistan",
};

/* Social / freelance profile links — only the comment marks where to paste your link. */
const SOCIAL_LINKS = [
  {
    name: "GitHub",
    icon: <GithubIcon />,
    href: "https://github.com/riyanmodassar639", // TODO: paste your GitHub profile link here
  },
  {
    name: "LinkedIn",
    icon: <LinkedinIcon />,
    href: "https://www.linkedin.com/in/riyan-modassar-35904b373?utm_source=share_via&utm_content=profile&utm_medium=member_ios", // TODO: paste your LinkedIn profile link here
  },
  {
    name: "Fiverr",
    icon: <FiverrIcon />,
    href: "https://www.fiverr.com/s/m5pKp58", // TODO: paste your Fiverr profile link here
  },
  {
    name: "Upwork",
    icon: <UpworkIcon />,
    href: "https://www.upwork.com/freelancers/~018215660511572604?mp_source=share", // TODO: paste your Upwork profile link here
  },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // reCAPTCHA is rendered explicitly (not via the auto-scan div) because
  // this div doesn't exist in the DOM until React mounts it — the
  // widget ID it returns is what we use to read/reset its response.
  const recaptchaBoxRef = useRef(null);
  const recaptchaWidgetId = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const tryRender = (attemptsLeft) => {
      if (cancelled) return;

      if (
        window.grecaptcha &&
        window.grecaptcha.render &&
        recaptchaBoxRef.current &&
        recaptchaWidgetId.current === null
      ) {
        recaptchaWidgetId.current = window.grecaptcha.render(
          recaptchaBoxRef.current,
          { sitekey: RECAPTCHA_SITE_KEY }
        );
        return;
      }

      if (attemptsLeft > 0) {
        setTimeout(() => tryRender(attemptsLeft - 1), 250);
      }
    };

    tryRender(40); // ~10 seconds of retrying while the script loads

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      alert("Please fill all fields");
      return;
    }

    const recaptchaToken =
      window.grecaptcha &&
      window.grecaptcha.getResponse &&
      recaptchaWidgetId.current !== null
        ? window.grecaptcha.getResponse(recaptchaWidgetId.current)
        : "";

    if (!recaptchaToken) {
      alert("Please verify you're not a robot.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/contact/addMessage.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            recaptcha_token: recaptchaToken,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Message Sent Successfully");

        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log(error);
      alert("Could not send message. Please check your connection and try again.");
    } finally {
      setSending(false);

      if (
        window.grecaptcha &&
        window.grecaptcha.reset &&
        recaptchaWidgetId.current !== null
      ) {
        window.grecaptcha.reset(recaptchaWidgetId.current);
      }
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <Reveal as="div" className="contact-head">
          <span className="contact-label">CONTACT</span>

          <h2 className="contact-title">Let's Connect</h2>

          <p className="contact-text">
            Feel free to reach out for collaborations or just a friendly hello
          </p>
        </Reveal>

        {/* ---- Let's Connect card: email / phone / location + social buttons ---- */}
        <Reveal as="div" className="connect-card" delay={0.1}>
          <div className="connect-grid">
            <div className="connect-item">
              <span className="connect-icon">
                <MailIcon />
              </span>
              <h4>Email</h4>
              <p>{CONTACT_INFO.email}</p>
            </div>

            <div className="connect-item">
              <span className="connect-icon">
                <PhoneIcon />
              </span>
              <h4>Phone</h4>
              <p>{CONTACT_INFO.phone}</p>
            </div>

            <div className="connect-item">
              <span className="connect-icon">
                <PinIcon />
              </span>
              <h4>Location</h4>
              <p>{CONTACT_INFO.location}</p>
            </div>
          </div>

          <div className="connect-divider" />

          <div className="connect-social">
            <h4 className="connect-social-title">Connect with me</h4>

            <div className="connect-buttons">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="connect-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---- Existing working message form (sends to PHP backend) ---- */}
        <Reveal
          as="form"
          className="contact-form"
          delay={0.2}
          onSubmit={handleSubmit}
        >
          <div className="form-card-head">
            <h3>Send a Message</h3>
            <p>Fill out the form below and I'll get back to you soon.</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Your Name</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <UserIcon />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <div className="input-wrap">
              <span className="input-icon">
                <TagIcon />
              </span>
              <input
                type="text"
                placeholder="What's this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Message</label>
            <div className="input-wrap input-wrap-textarea">
              <span className="input-icon input-icon-top">
                <MessageIcon />
              </span>
              <textarea
                rows="6"
                placeholder="Tell me about your project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group form-recaptcha">
            <div ref={recaptchaBoxRef}></div>
          </div>

          <button
            type="submit"
            className={sending ? "btn-sending" : ""}
            disabled={sending}
          >
            {sending ? (
              "Sending..."
            ) : (
              <>
                <SendIcon />
                <span>Send Message</span>
              </>
            )}
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;