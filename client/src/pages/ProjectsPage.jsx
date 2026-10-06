import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import Reveal from "../components/Reveal";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

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
    <section className="all-projects-page">
      <div className="container">

        <Link to="/" className="back-to-home-btn">
          <span className="link-icon">←</span> Back to Home
        </Link>

        <Reveal as="div" className="projects-page-head">
          <h1>All Projects</h1>
          <p>
            A complete collection of my work — explore, filter by
            technology, and dive into the details of each build.
          </p>
        </Reveal>

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

        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project, i) => (
              <Reveal as="div" delay={(i % 6) * 0.08} key={project.id}>
                <ProjectCard
                  project={project}
                  onViewDetails={setSelectedProject}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="projects-empty">
            No projects found for this filter.
          </p>
        )}

      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onRatingUpdated={handleRatingUpdated}
      />
    </section>
  );
}

export default ProjectsPage;