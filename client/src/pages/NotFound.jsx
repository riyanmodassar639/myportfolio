import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-aurora"></div>
      <div className="not-found-grid-overlay"></div>

      <div className="not-found-inner">
        <span className="not-found-label">ERROR</span>

        <h1 className="not-found-code">404</h1>

        <h2 className="not-found-title">This page wandered off.</h2>

        <p className="not-found-text">
          The page you're looking for doesn't exist, may have been
          moved, or the link might be broken. Let's get you back on
          track.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn-dark">
            Back to Home
          </Link>
          <Link to="/projects" className="btn-light">
            View Projects
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;