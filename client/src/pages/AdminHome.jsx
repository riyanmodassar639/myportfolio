import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const CARDS = [
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "messages", label: "Messages" },
  { key: "education", label: "Education" },
];

const BASE = "https://riyanportfolio.site.je/server";

// how each content type should render inside the Recent Activity feed
const ACTIVITY_CONFIG = {
  project: { icon: "🗂", verb: "New project added" },
  skill: { icon: "🛠", verb: "New skill added" },
  education: { icon: "🎓", verb: "New education added" },
  experience: { icon: "💼", verb: "New experience added" },
  certification: { icon: "📜", verb: "New certification added" },
  testimonial: { icon: "💬", verb: "New testimonial received" },
  message: { icon: "✉️", verb: "New message received" },
};

// turns a MySQL "YYYY-MM-DD HH:MM:SS" (or ISO) string into a real Date.
// The database stores this in UTC, so we explicitly mark it as UTC
// ("Z" suffix) before parsing — otherwise JS treats the naive string as
// local browser time, which throws every "time ago" off by however far
// the visitor's timezone is from UTC (e.g. ~5 hours for Pakistan).
function parseDate(value) {
  if (!value) return null;

  let iso = value.trim().replace(" ", "T");
  if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso)) {
    iso += "Z"; // no timezone info in the string — treat it as UTC
  }

  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

// "just now" / "5 minutes ago" / "3 hours ago" / "2 days ago" / date
function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 45) return "Just now";
  if (seconds < 90) return "A minute ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AdminHome = () => {
  const [counts, setCounts] = useState({
    projects: null,
    skills: null,
    messages: null,
    education: null,
  });

  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const loadCount = async (url, key) => {
      try {
        const res = await fetch(url);
        const data = await res.json();

        const list = Array.isArray(data) ? data : data[key] || [];

        setCounts((prev) => ({ ...prev, [key]: list.length }));
      } catch (err) {
        console.log(err);
        setCounts((prev) => ({ ...prev, [key]: 0 }));
      }
    };

    loadCount(`${BASE}/projects/getAllProjects.php`, "projects");
    loadCount(`${BASE}/skills/getSkills.php`, "skills");
    loadCount(`${BASE}/contact/getMessages.php`, "messages");
    loadCount(`${BASE}/education/getEducation.php`, "education");
  }, []);

  useEffect(() => {
    // fetches every content endpoint that carries a created_at
    // timestamp, turns each row into a normalized activity entry, then
    // merges + sorts everything into a single "what happened recently"
    // feed for the dashboard.
    const endpoints = [
      { url: `${BASE}/projects/getAllProjects.php`, key: "projects", type: "project" },
      { url: `${BASE}/skills/getSkills.php`, key: "skills", type: "skill" },
      { url: `${BASE}/education/getEducation.php`, key: "education", type: "education" },
      { url: `${BASE}/experience/getExperience.php`, key: "experience", type: "experience" },
      { url: `${BASE}/certifications/getCertifications.php`, key: "certifications", type: "certification" },
      { url: `${BASE}/testimonials/getTestimonials.php`, key: "testimonials", type: "testimonial" },
      { url: `${BASE}/contact/getMessages.php`, key: "messages", type: "message" },
    ];

    const titleFor = (type, row) => {
      switch (type) {
        case "project":
          return row.title;
        case "skill":
          return row.name;
        case "education":
          return row.title;
        case "experience":
          return row.job_title;
        case "certification":
          return row.certificate_name;
        case "testimonial":
          return row.client_name;
        case "message":
          return row.name;
        default:
          return "";
      }
    };

    let cancelled = false;

    Promise.all(
      endpoints.map(({ url, key, type }) =>
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const list = Array.isArray(data) ? data : data[key] || [];

            return list
              .map((row) => {
                const date = parseDate(row.created_at);
                if (!date) return null;

                return {
                  id: `${type}-${row.id}`,
                  type,
                  date,
                  title: titleFor(type, row),
                };
              })
              .filter(Boolean);
          })
          .catch(() => [])
      )
    ).then((results) => {
      if (cancelled) return;

      const merged = results
        .flat()
        .sort((a, b) => b.date - a.date)
        .slice(0, 20);

      setActivity(merged);
      setActivityLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Dashboard</h1>
          <p>Manage your portfolio content from here.</p>
        </div>

        <div className="admin-cards">
          {CARDS.map((card) => (
            <div className="admin-card" key={card.key}>
              <h3>{card.label}</h3>
              <span>
                {counts[card.key] === null
                  ? "—"
                  : String(counts[card.key]).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        <div className="admin-section">
          <h2>Recent Activity</h2>

          {activityLoading ? (
            <p>Loading recent activity...</p>
          ) : activity.length === 0 ? (
            <p>
              Portfolio content management, updates and latest messages
              will appear here.
            </p>
          ) : (
            <ul className="admin-activity-list">
              {activity.map((item) => {
                const config = ACTIVITY_CONFIG[item.type];

                return (
                  <li className="admin-activity-item" key={item.id}>
                    <span className="admin-activity-icon">
                      {config.icon}
                    </span>

                    <div className="admin-activity-body">
                      <p className="admin-activity-text">
                        {config.verb}
                        {item.title ? (
                          <>
                            : <span>{item.title}</span>
                          </>
                        ) : null}
                      </p>
                      <span className="admin-activity-time">
                        {timeAgo(item.date)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminHome;