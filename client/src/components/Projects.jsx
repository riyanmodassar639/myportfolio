import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import Reveal from "./Reveal";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch(
      "https://riyanportfolio.site.je/server/projects/getProjects.php"
    )
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err));
  }, []);

  const filters = ["All"];

  projects.forEach((project) => {
    (project.technologies || "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .forEach((tech) => {
        if (!filters.includes(tech)) filters.push(tech);
      });
  });

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) =>
          (project.technologies || "")
            .split(",")
            .map((t) => t.trim())
            .includes(activeFilter)
        );

  const topProjects = filteredProjects.slice(0, 3);

  const handleRatingUpdated = (projectId, newRating, newCount) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, rating: newRating, rating_count: newCount }
          : p
      )
    );
  };

  return (
    <section className="projects" id="projects">
      <div className="container">

        <Reveal as="div" className="projects-head">
          <span className="projects-label">PROJECTS</span>

          <h2 className="projects-title">Featured Projects</h2>

          <p className="projects-text">
            A showcase of my recent work, covering full-stack
            web apps, dashboards and tools built with modern
            technologies.
          </p>
        </Reveal>

        {filters.length > 1 && (
          <div className="projects-filter-bar">
            {filters.map((filter) => (
              <button
                key={filter}
                className={
                  "filter-btn" +
                  (activeFilter === filter ? " active" : "")
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {topProjects.length > 0 ? (
          <div className="projects-grid">
            {topProjects.map((project, i) => (
              <Reveal as="div" delay={i * 0.08} key={project.id}>
                <ProjectCard
                  project={project}
                  onViewDetails={setSelectedProject}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="projects-empty">
            {activeFilter === "All"
              ? "No projects to show yet."
              : "No projects found for this filter."}
          </p>
        )}

        <Reveal as="div" className="projects-view-all" delay={0.1}>
          <Link to="/projects" className="view-projects-btn">
            View All Projects
          </Link>
        </Reveal>

      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onRatingUpdated={handleRatingUpdated}
      />
    </section>
  );
}

export default Projects;