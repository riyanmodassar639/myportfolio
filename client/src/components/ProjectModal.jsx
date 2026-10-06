import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

// Get this from https://console.cloud.google.com/apis/credentials
// (OAuth Client ID -> Web application, origin: https://riyanportfolio.site.je)
const GOOGLE_CLIENT_ID = "695691534347-oj5nag7v99thpl9pln87tg20vmlj01sk.apps.googleusercontent.com";

// Decodes the payload of a Google ID token (JWT) client-side, purely
// to read the account's sub/email/name for the UI. This is NOT how
// duplicate ratings are enforced — the backend independently verifies
// the token's signature with Google before accepting a vote.
function decodeGoogleToken(token) {
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function cleanUrl(url) {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectModal({ project, onClose, onRatingUpdated }) {
  // the project currently being displayed inside the modal — starts
  // as the one the user clicked, but can be swapped internally when
  // they pick something from the "More by Riyan" strip, without
  // closing/reopening the modal
  const [viewingProject, setViewingProject] = useState(project);

  const [copied, setCopied] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [userStars, setUserStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rateMessage, setRateMessage] = useState("");
  const [googleUser, setGoogleUser] = useState(null); // { sub, email, name, picture, credential }
  const [checkingRating, setCheckingRating] = useState(false);
  const googleButtonRef = useRef(null);

  const [screenshots, setScreenshots] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [moreProjects, setMoreProjects] = useState([]);
  const moreScrollerRef = useRef(null);
  const scrollBodyRef = useRef(null);
  const dialogRef = useRef(null);

  // sync internal viewing project whenever a *new* project is opened
  // from outside (clicking a different card on the page)
  useEffect(() => {
    setViewingProject(project);
  }, [project]);

  useEffect(() => {
    if (!viewingProject) return;

    setCurrentRating(parseFloat(viewingProject.rating) || 0);
    setCurrentCount(parseInt(viewingProject.rating_count, 10) || 0);
    setViewCount(parseInt(viewingProject.view_count, 10) || 0);
    setUserStars(0);
    setHoverStars(0);
    setRateMessage("");

    // count this as a view once per project per browser session (not
    // on every re-open / re-render) so refreshing doesn't inflate it
    const viewedKey = `viewed_project_${viewingProject.id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      sessionStorage.setItem(viewedKey, "1");

      fetch("https://riyanportfolio.site.je/server/projects/incrementView.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: viewingProject.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setViewCount(data.view_count);
        })
        .catch(() => {});
    }

    if (googleUser) {
      checkAlreadyRated(viewingProject.id, googleUser.sub);
    } else {
      setHasRated(false);
    }

    // fetch this project's screenshot gallery
    fetch(
      `https://riyanportfolio.site.je/server/projects/getProjectsScreenshots.php?project_id=${viewingProject.id}`
    )
      .then((res) => res.json())
      .then((data) => setScreenshots(data.success ? data.screenshots : []))
      .catch(() => setScreenshots([]));

    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTo({ top: 0 });
    }
  }, [viewingProject, googleUser]);

  // fetch the "more projects" list once when the modal first opens
  useEffect(() => {
    if (!project) return;

    fetch("https://riyanportfolio.site.je/server/projects/getProjects.php")
      .then((res) => res.json())
      .then((data) => setMoreProjects(Array.isArray(data) ? data : []))
      .catch(() => setMoreProjects([]));
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // move keyboard focus into the dialog so screen reader / keyboard
    // users land inside it instead of it opening silently in the
    // background, and give it back to whatever they were on before
    // once the dialog closes
    const previouslyFocused = document.activeElement;
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";

      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [project, onClose]);

  // sets up the "Sign in with Google" button used by the rating
  // widget. Re-runs whenever a different project is being viewed (or
  // the modal reopens) since the button div gets re-rendered each time.
  useEffect(() => {
    if (!project || !viewingProject || googleUser) return;

    let cancelled = false;

    const tryInit = (attemptsLeft) => {
      if (cancelled) return;

      if (window.google && window.google.accounts && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "medium",
          text: "signin",
        });
        return;
      }

      if (attemptsLeft > 0) {
        setTimeout(() => tryInit(attemptsLeft - 1), 250);
      }
    };

    tryInit(40);

    return () => {
      cancelled = true;
    };
  }, [project, viewingProject, googleUser]);

  const handleGoogleCredential = (response) => {
    const payload = decodeGoogleToken(response.credential);
    if (!payload) return;

    setGoogleUser({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      credential: response.credential,
    });
  };

  const checkAlreadyRated = (projectId, googleSub) => {
    setCheckingRating(true);

    fetch(
      `https://riyanportfolio.site.je/server/projects/checkRating.php?project_id=${projectId}&google_sub=${encodeURIComponent(googleSub)}`
    )
      .then((res) => res.json())
      .then((data) => setHasRated(!!data.already_rated))
      .catch(() => setHasRated(false))
      .finally(() => setCheckingRating(false));
  };

  if (!project || !viewingProject) return null;

  const techList = (viewingProject.technologies || "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const showLive =
    Number(viewingProject.show_live_demo) === 1 && viewingProject.live_link;

  const showGithub =
    Number(viewingProject.show_github) === 1 && viewingProject.github_link;

  const otherProjects = moreProjects.filter(
    (p) => p.id !== viewingProject.id
  );

  // the screenshot marked as the thumbnail (by the admin) leads the
  // right column; everything else in the gallery follows it. if none
  // is marked yet, fall back to the project's main card image.
  const thumbnailShot = screenshots.find((s) => Number(s.is_thumbnail) === 1);
  const thumbnailSrc = thumbnailShot ? thumbnailShot.image : viewingProject.image;
  const thumbnailPosition = thumbnailShot
    ? `${thumbnailShot.focal_x ?? 50}% ${thumbnailShot.focal_y ?? 50}%`
    : viewingProject.image_position || "50% 50%";
  const gallerySlots = screenshots.filter(
    (s) => !thumbnailShot || s.id !== thumbnailShot.id
  );

  const handleCopyLink = () => {
    const link = viewingProject.live_link || window.location.href;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  const submitRating = () => {
    if (!userStars || submitting || hasRated || !googleUser) return;

    setSubmitting(true);
    setRateMessage("");

    fetch("https://riyanportfolio.site.je/server/projects/rateProject.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: viewingProject.id,
        rating: userStars,
        id_token: googleUser.credential,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrentRating(data.rating);
          setCurrentCount(data.rating_count);
          setHasRated(true);
          setRateMessage("Thanks for rating this project!");

          if (onRatingUpdated) {
            onRatingUpdated(viewingProject.id, data.rating, data.rating_count);
          }
        } else if (data.already_rated) {
          setHasRated(true);
          setRateMessage("You've already rated this project with this Google account.");
        } else {
          setRateMessage(data.error || "Something went wrong. Please try again.");
        }
      })
      .catch(() => {
        setRateMessage("Something went wrong. Please try again.");
      })
      .finally(() => setSubmitting(false));
  };

  const scrollMore = (direction) => {
    const scroller = moreScrollerRef.current;
    if (!scroller) return;

    const cardWidth = scroller.children[0]?.offsetWidth || 200;
    scroller.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  };

  // groups consecutive gallery screenshots that share the same
  // heading, so a heading label only renders once above its batch of
  // images instead of repeating above every single image
  let lastHeading = null;

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div
        className="project-modal project-modal-wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="project-modal-scroll" ref={scrollBodyRef}>
          <div className="project-modal-topbar">
            <h2 id="project-modal-title">{viewingProject.title}</h2>

            <div className="project-modal-topbar-actions">
              {showLive && (
                <a
                  className="modal-action-btn modal-action-live"
                  href={viewingProject.live_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo <span className="link-icon">→</span>
                </a>
              )}

              {showGithub && (
                <a
                  className="modal-action-btn modal-action-code"
                  href={viewingProject.github_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Code
                </a>
              )}

              {showLive && (
                <button
                  type="button"
                  className="copy-link-btn"
                  onClick={handleCopyLink}
                >
                  <span className="copy-link-text">
                    {copied ? "Copied!" : "Copy link"}
                  </span>
                  <span className="link-icon">⛓</span>
                </button>
              )}

              <button
                className="project-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="project-modal-columns">
            {/* ---------------- LEFT: category, rating, description, skills ---------------- */}
            <div className="project-modal-col-left">
              {viewingProject.category && (
                <p className="project-modal-meta">
                  <span>Category.</span> {viewingProject.category}
                </p>
              )}

              {(currentCount > 0 || currentRating > 0) && (
                <div className="project-modal-meta project-modal-rating">
                  <StarRating
                    rating={currentRating}
                    count={currentCount}
                    size="md"
                  />
                </div>
              )}

              {viewCount > 0 && (
                <p className="project-modal-views">
                  👁 {viewCount.toLocaleString()} {viewCount === 1 ? "view" : "views"}
                </p>
              )}

              {viewingProject.description && (
                <div className="project-modal-block">
                  <h5>Project description.</h5>
                  <p>{viewingProject.description}</p>
                </div>
              )}

              {techList.length > 0 && (
                <div className="project-modal-block">
                  <h5>Skills and deliverables</h5>
                  <div className="project-tech">
                    {techList.map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {formatDate(viewingProject.created_at) && (
                <p className="project-modal-published">
                  Published on {formatDate(viewingProject.created_at)}
                </p>
              )}
            </div>

            {/* ---------------- RIGHT: thumbnail, gallery, resources, live/github links ---------------- */}
            <div className="project-modal-col-right">
              {thumbnailSrc && (
                <div className="project-modal-thumbnail">
                  <img
                    src={thumbnailSrc}
                    alt={viewingProject.title}
                    style={{ objectPosition: thumbnailPosition }}
                  />
                </div>
              )}

              {gallerySlots.length > 0 && (
                <div className="project-modal-gallery">
                  {gallerySlots.map((shot) => {
                    const showHeading =
                      shot.heading && shot.heading !== lastHeading;
                    lastHeading = shot.heading || lastHeading;

                    return (
                      <div className="gallery-shot" key={shot.id}>
                        {showHeading && (
                          <span className="gallery-shot-heading">
                            {shot.heading}
                          </span>
                        )}
                        <img src={shot.image} alt={shot.heading || viewingProject.title} />
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="project-modal-share">
                <span className="project-modal-share-label">Share:</span>

                <a
                  className="project-modal-share-btn share-whatsapp"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Check out "${viewingProject.title}" on Riyan Modassar's portfolio: https://riyanportfolio.site.je/projects`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Share ${viewingProject.title} on WhatsApp`}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.08c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.97s.74-2.11 1-2.4c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.05.17-.18.71-.83.9-1.11.19-.29.38-.24.64-.15.26.1 1.66.78 1.94.93.29.15.48.22.55.34.07.13.07.72-.17 1.4z" />
                  </svg>
                </a>

                <a
                  className="project-modal-share-btn share-linkedin"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    "https://riyanportfolio.site.je/projects"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Share ${viewingProject.title} on LinkedIn`}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                </a>
              </div>

              {(viewingProject.documentation ||
                viewingProject.presentation ||
                viewingProject.video_link) && (
                <div className="project-modal-block">
                  <h5>Resources</h5>

                  {viewingProject.documentation && (
                    <a
                      className="project-modal-link-box"
                      href={viewingProject.documentation}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="project-modal-link-label">
                        📄 Documentation
                      </span>
                      <span className="project-modal-link-url">
                        {viewingProject.documentation.split("/").pop()}
                      </span>
                      <span className="project-modal-link-icon">↗</span>
                    </a>
                  )}

                  {viewingProject.presentation && (
                    <a
                      className="project-modal-link-box"
                      href={viewingProject.presentation}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="project-modal-link-label">
                        🖥 Presentation
                      </span>
                      <span className="project-modal-link-url">
                        {viewingProject.presentation.split("/").pop()}
                      </span>
                      <span className="project-modal-link-icon">↗</span>
                    </a>
                  )}

                  {viewingProject.video_link && (
                    <a
                      className="project-modal-link-box"
                      href={viewingProject.video_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="project-modal-link-label">
                        ▶ Video / Recording
                      </span>
                      <span className="project-modal-link-url">
                        {viewingProject.video_link.split("/").pop()}
                      </span>
                      <span className="project-modal-link-icon">↗</span>
                    </a>
                  )}
                </div>
              )}

              {showLive && (
                <a
                  className="project-modal-link-box"
                  href={viewingProject.live_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="project-modal-link-label">
                    Live project
                  </span>
                  <span className="project-modal-link-url">
                    {cleanUrl(viewingProject.live_link)}
                  </span>
                  <span className="project-modal-link-icon">↗</span>
                </a>
              )}

              {showGithub && (
                <a
                  className="project-modal-link-box"
                  href={viewingProject.github_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="project-modal-link-label">
                    GitHub repository
                  </span>
                  <span className="project-modal-link-url">
                    {cleanUrl(viewingProject.github_link)}
                  </span>
                  <span className="project-modal-link-icon">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* ---------------- Rate this project: full-width, below everything else ---------------- */}
          <div className="rate-project-section rate-project-section-full">
            <h5>Rate this project</h5>

            {!googleUser ? (
              <>
                <p className="rate-project-hint">
                  Sign in with Google to rate this project — one rating
                  per account.
                </p>
                <div ref={googleButtonRef} className="google-signin-btn"></div>
              </>
            ) : checkingRating ? (
              <p className="rate-project-hint">Checking...</p>
            ) : hasRated ? (
              <p className="rate-project-thanks">
                Thanks — you've already rated this project as{" "}
                {googleUser.email}.
              </p>
            ) : (
              <>
                <p className="rate-project-hint">
                  Signed in as {googleUser.email}
                </p>

                <div
                  className="rate-stars-input"
                  role="radiogroup"
                  aria-label="Rate this project from 1 to 5 stars"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      role="radio"
                      aria-checked={userStars === n}
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                      tabIndex={0}
                      className={
                        "rate-star" +
                        (n <= (hoverStars || userStars) ? " active" : "")
                      }
                      onMouseEnter={() => setHoverStars(n)}
                      onMouseLeave={() => setHoverStars(0)}
                      onFocus={() => setHoverStars(n)}
                      onBlur={() => setHoverStars(0)}
                      onClick={() => setUserStars(n)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setUserStars(n);
                        } else if (e.key === "ArrowRight" && n < 5) {
                          e.target.nextSibling?.focus();
                        } else if (e.key === "ArrowLeft" && n > 1) {
                          e.target.previousSibling?.focus();
                        }
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="rate-submit-btn"
                  disabled={!userStars || submitting}
                  onClick={submitRating}
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </button>
              </>
            )}

            {rateMessage && (
              <p className="rate-project-message">{rateMessage}</p>
            )}
          </div>

          {/* ---------------- MORE BY RIYAN MODASSAR ---------------- */}
          {otherProjects.length > 0 && (
            <div className="project-modal-more">
              <h5>More by Riyan Modassar</h5>

              <div className="project-modal-more-carousel">
                <button
                  type="button"
                  className="more-arrow more-arrow-left"
                  aria-label="Previous projects"
                  onClick={() => scrollMore(-1)}
                >
                  ‹
                </button>

                <div className="project-modal-more-grid" ref={moreScrollerRef}>
                  {otherProjects.map((p) => (
                    <div
                      className="more-project-card"
                      key={p.id}
                      onClick={() => setViewingProject(p)}
                    >
                      <div className="more-project-image">
                        <img
                          src={p.image || "https://picsum.photos/300/200"}
                          alt={p.title}
                        />
                      </div>
                      <p>{p.title}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="more-arrow more-arrow-right"
                  aria-label="Next projects"
                  onClick={() => scrollMore(1)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;