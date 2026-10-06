import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/hero", label: "Hero" },
  { to: "/admin/about", label: "About" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/experience", label: "Experience" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/education", label: "Education" },
  { to: "/admin/certifications", label: "Certifications" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/contacts", label: "Contact" },
  { to: "/admin/maintenance", label: "Maintenance" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <header className="admin-sidebar">
      <div className="admin-sidebar-top">
        <Link to="/admin" className="admin-logo">
          <span className="admin-logo-mark"></span>
          Admin Panel
        </Link>

        <div className="admin-sidebar-actions">
          <Link to="/" className="admin-view-site-btn" target="_blank">
            View Site
          </Link>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={
              location.pathname === item.to ? "active" : undefined
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default AdminSidebar;