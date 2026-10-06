import React, { useState } from "react";
import Reveal from "./Reveal";

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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

const TestimonialForm = () => {
  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientName || !designation || !message) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      await fetch(
        "https://riyanportfolio.site.je/server/testimonials/addTestimonial.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_name: clientName,
            designation,
            message,
            rating,
          }),
        }
      );

      alert("Thank you! Your testimonial has been submitted for review.");

      setClientName("");
      setDesignation("");
      setMessage("");
      setRating(0);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="testimonial-form-section" id="testimonial-form">
      <div className="container">
        <Reveal as="div" className="contact-head">
          <span className="contact-label">TESTIMONIAL</span>

          <h2 className="contact-title">Leave Your Feedback</h2>

          <p className="contact-text">
            Share your experience working with me.
          </p>
        </Reveal>

        <Reveal
          as="form"
          className="testimonial-form"
          delay={0.15}
          onSubmit={handleSubmit}
        >
          <div className="form-card-head">
            <h3>Write a Testimonial</h3>
            <p>Your feedback helps others know what it's like to work with me.</p>
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
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Your Designation</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <BriefcaseIcon />
                </span>
                <input
                  type="text"
                  placeholder="e.g. CEO at Company"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Your Testimonial</label>
            <div className="input-wrap input-wrap-textarea">
              <span className="input-icon input-icon-top">
                <MessageIcon />
              </span>
              <textarea
                rows="6"
                placeholder="Write your testimonial here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="rating-box">
            <p className="rating-label">
              <b>Rate My Portfolio</b>
            </p>

            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setRating(star)}
                  className={
                    star <= rating ? "rating-star active" : "rating-star"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={submitting ? "btn-sending" : ""}
            disabled={submitting}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                <SendIcon />
                <span>Submit Testimonial</span>
              </>
            )}
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default TestimonialForm;