import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Testimonials from "./components/Testimonials";
import TestimonialForm from "./components/TestimonialForm";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";

import ProjectsPage from "./pages/ProjectsPage";
import MaintenancePage from "./pages/MaintenancePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";

import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminHero from "./pages/AdminHero";
import AdminAbout from "./pages/AdminAbout";
import AdminSkills from "./pages/AdminSkills";
import AdminExperience from "./pages/AdminExperience";
import AdminProjects from "./pages/AdminProjects";
import AdminEducation from "./pages/AdminEducation";
import AdminCertifications from "./pages/AdminCertifications";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminBlog from "./pages/AdminBlog";
import AdminContact from "./pages/AdminContact";
import AdminMaintenance from "./pages/AdminMaintenance";
import NotFound from "./pages/NotFound";

import "./styles/style.css";

function Portfolio() {
  return (
    <>
      <Navbar />

      <Hero />

      <About />

      <Skills />

      <Experience />

      <Projects />

      <Education />

      <Certifications />

      <Testimonials />

      <TestimonialForm />

      <Contact />

      <Footer />
    </>
  );
}

// wraps every public-facing route (home, /projects, etc). Checks the
// site's maintenance flag once on load — if it's on, visitors see the
// maintenance page instead of the real content. The admin panel is not
// wrapped by this, so it's always reachable to turn maintenance off.
function PublicGate() {
  const [isMaintenance, setIsMaintenance] = useState(null);

  useEffect(() => {
    fetch("https://riyanportfolio.site.je/server/maintenance/getMaintenance.php")
      .then((res) => res.json())
      .then((data) => setIsMaintenance(!!Number(data.is_maintenance)))
      .catch(() => setIsMaintenance(false));
  }, []);

  if (isMaintenance === null) return null;
  if (isMaintenance) return <MaintenancePage />;

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= Portfolio (gated by maintenance mode) ================= */}

        <Route element={<PublicGate />}>
          <Route
            path="/"
            element={<Portfolio />}
          />

          <Route
            path="/projects"
            element={
              <>
                <ProjectsPage />
                <Footer />
              </>
            }
          />

          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Route>

        {/* ================= Admin Login ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ================= Protected Admin ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/hero"
          element={
            <ProtectedRoute>
              <AdminHero />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              <AdminAbout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <AdminSkills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/experience"
          element={
            <ProtectedRoute>
              <AdminExperience />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/education"
          element={
            <ProtectedRoute>
              <AdminEducation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/certifications"
          element={
            <ProtectedRoute>
              <AdminCertifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <AdminTestimonials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute>
              <AdminBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute>
              <AdminContact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/maintenance"
          element={
            <ProtectedRoute>
              <AdminMaintenance />
            </ProtectedRoute>
          }
        />
<Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;