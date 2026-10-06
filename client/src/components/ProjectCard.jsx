import StarRating from "./StarRating";

function ProjectCard({ project, onViewDetails }) {
  const rating = parseFloat(project.rating);
  const hasRating = !isNaN(rating) && rating > 0;
  const ratingCount = parseInt(project.rating_count, 10) || 0;

  const showGithub =
    Number(project.show_github) === 1 && project.github_link;

  const showLive =
    Number(project.show_live_demo) === 1 && project.live_link;

  const showDetails = Number(project.show_view_detail) === 1;

  const openDetails = () => {
    if (showDetails) onViewDetails(project);
  };

  return (
    <div className="project-card">
      <div
        className="project-image"
        onClick={openDetails}
        style={{ cursor: showDetails ? "pointer" : "default" }}
      >
        <img
          src={project.image || "https://picsum.photos/600/400"}
          alt={project.title}
          style={{ objectPosition: project.image_position || "50% 50%" }}
        />
      </div>

      <div className="project-content">
        <h3
          onClick={openDetails}
          style={{ cursor: showDetails ? "pointer" : "default" }}
        >
          {project.title}
        </h3>

        {(hasRating || Number(project.view_count) > 0) && (
          <div className="project-card-rating">
            {hasRating && (
              <StarRating rating={rating} count={ratingCount} size="sm" />
            )}

            {Number(project.view_count) > 0 && (
              <span className="project-card-views">
                👁 {Number(project.view_count).toLocaleString()}
              </span>
            )}
          </div>
        )}

        <div className="project-links">
          {showLive && (
            <a href={project.live_link} target="_blank" rel="noreferrer">
              View Project
              <span className="link-icon">↗</span>
            </a>
          )}

          {showGithub && (
            <a href={project.github_link} target="_blank" rel="noreferrer">
              <span className="link-icon github-icon">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                    0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                    -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52
                    .28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
                    0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44
                    1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54
                    1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </span>
              View Code
            </a>
          )}

          {showDetails && (
            <button
              type="button"
              className="view-details-link"
              onClick={openDetails}
            >
              View Details
              <span className="link-icon">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;