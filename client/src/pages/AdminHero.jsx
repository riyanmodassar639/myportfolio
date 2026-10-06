import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const initialForm = {
  greeting: "Hello,",
  title: "",
  role: "",
  description: "",
  skills: "",
  btn1_text: "View Projects",
  btn1_link: "#projects",
  btn2_text: "Contact Me",
  btn2_link: "#contact",
  is_available_for_hire: false,
};

function FileDropZone({ label, file, existingPath, accept, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const pickFile = (fileList) => {
    if (fileList && fileList[0]) {
      onChange(fileList[0]);
    }
  };

  const existingName = existingPath ? existingPath.split("/").pop() : "";

  return (
    <div className="file-drop-field">
      <label>{label}</label>

      <div
        className={"file-drop-zone" + (dragOver ? " drag-over" : "")}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          pickFile(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          ref={inputRef}
          accept={accept}
          hidden
          onChange={(e) => pickFile(e.target.files)}
        />

        <div className="file-drop-icon">⇪</div>

        {file ? (
          <p className="file-drop-text">
            <strong>{file.name}</strong>
            <span className="file-drop-hint"> — click or drop to replace</span>
          </p>
        ) : existingName ? (
          <p className="file-drop-text">
            Current file: <strong>{existingName}</strong>
            <span className="file-drop-hint"> — click or drop to replace</span>
          </p>
        ) : (
          <p className="file-drop-text">
            Drag &amp; drop a file here, or click to browse
          </p>
        )}
      </div>
    </div>
  );
}

const AdminHero = () => {
  const [form, setForm] = useState(initialForm);
  const [heroId, setHeroId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [existingResume, setExistingResume] = useState("");
  const [loaded, setLoaded] = useState(false);

  const fetchHero = async () => {
    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/hero/getHero.php"
      );

      const data = await response.json();

      if (data && !data.error && data.id) {
        setForm({
          greeting: data.greeting || "Hello,",
          title: data.title || "",
          role: data.role || "",
          description: data.description || "",
          skills: data.skills || "",
          btn1_text: data.btn1_text || "View Projects",
          btn1_link: data.btn1_link || "#projects",
          btn2_text: data.btn2_text || "Contact Me",
          btn2_link: data.btn2_link || "#contact",
          is_available_for_hire: Number(data.is_available_for_hire) === 1,
        });

        setHeroId(data.id);
        setExistingImage(data.profile_image || "");
        setExistingResume(data.resume_link || "");
      }

      setLoaded(true);
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const saveHero = async () => {
    if (!form.title) {
      alert("Please fill in at least the Main Heading.");
      return;
    }

    const formData = new FormData();

    formData.append("greeting", form.greeting);
    formData.append("title", form.title);
    formData.append("role", form.role);
    formData.append("description", form.description);
    formData.append("skills", form.skills);
    formData.append("btn1_text", form.btn1_text);
    formData.append("btn1_link", form.btn1_link);
    formData.append("btn2_text", form.btn2_text);
    formData.append("btn2_link", form.btn2_link);
    formData.append("is_available_for_hire", form.is_available_for_hire ? 1 : 0);

    if (heroId) {
      formData.append("id", heroId);
    }

    if (imageFile) {
      formData.append("profile_image", imageFile);
    }

    if (resumeFile) {
      formData.append("resume_link", resumeFile);
    }

    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/hero/saveHero.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.log("Raw server response:", text);
        alert(
          "The server didn't return valid JSON — check the browser " +
            "console for the raw response (usually a PHP error)."
        );
        return;
      }

      if (data.success) {
        alert("Hero Section Updated Successfully");
        setImageFile(null);
        setResumeFile(null);
        fetchHero();
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.log(error);
      alert(
        "Could not reach the server. Check that your local server " +
          "(XAMPP/WAMP etc.) is running and the URL is correct."
      );
    }
  };

  if (!loaded) return null;

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Hero Section</h1>
          <p>
            This is the first thing visitors see — control your greeting,
            headline, role, description, profile picture, buttons and
            skill tags here.
          </p>
        </div>

        <div className="admin-section-card">
          <h2>Edit Hero Content</h2>

          <label>Greeting</label>
          <input
            type="text"
            name="greeting"
            placeholder="e.g. Hello, / Hi there,"
            value={form.greeting}
            onChange={handleChange}
          />

          <label>Main Heading</label>
          <textarea
            rows="3"
            name="title"
            placeholder="e.g. Building modern digital experiences for the web"
            value={form.title}
            onChange={handleChange}
          />

          <label>Role / Job Title</label>
          <input
            type="text"
            name="role"
            placeholder="e.g. Full Stack Web Developer"
            value={form.role}
            onChange={handleChange}
          />

          <label>Short Description</label>
          <textarea
            rows="4"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Skill Tags (comma separated)</label>
          <input
            type="text"
            name="skills"
            placeholder="HTML,CSS,JavaScript,React,Node.js,PHP,SQL"
            value={form.skills}
            onChange={handleChange}
          />

          <h3 className="admin-form-subtitle">Buttons</h3>

          <div className="admin-two-col">
            <div>
              <label>Button 1 Text</label>
              <input
                type="text"
                name="btn1_text"
                value={form.btn1_text}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Button 1 Link</label>
              <input
                type="text"
                name="btn1_link"
                value={form.btn1_link}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-two-col">
            <div>
              <label>Button 2 Text</label>
              <input
                type="text"
                name="btn2_text"
                value={form.btn2_text}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Button 2 Link</label>
              <input
                type="text"
                name="btn2_link"
                value={form.btn2_link}
                onChange={handleChange}
              />
            </div>
          </div>

          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              checked={form.is_available_for_hire}
              onChange={(e) =>
                setForm({ ...form, is_available_for_hire: e.target.checked })
              }
            />
            {" "}Show "Available for Hire" badge on the site</label>

          <h3 className="admin-form-subtitle">Profile Picture</h3>

          <FileDropZone
            label="Upload profile picture"
            file={imageFile}
            existingPath={existingImage}
            accept="image/*"
            onChange={setImageFile}
          />

          <h3 className="admin-form-subtitle">Resume (optional)</h3>

          <FileDropZone
            label="Upload resume — shows a 'Download Resume' button on the site"
            file={resumeFile}
            existingPath={existingResume}
            accept=".pdf,.doc,.docx"
            onChange={setResumeFile}
          />

          <button onClick={saveHero}>Save Hero Section</button>
        </div>
      </div>
    </section>
  );
};

export default AdminHero;