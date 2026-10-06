import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import FocalPointPicker from "../components/FocalPointPicker";

const initialForm = {
  title: "",
  category: "",
  description: "",
  github: "",
  live: "",
  show_github: 1,
  show_live_demo: 1,
  show_view_detail: 1,
};

function FileDropZone({ label, file, existingPath, accept, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const pickFile = (fileList) => {
    if (fileList && fileList[0]) {
      onChange(fileList[0]);
    }
  };

  const existingName = existingPath
    ? existingPath.split("/").pop()
    : "";

  return (
    <div className="file-drop-field">
      <label>{label}</label>

      <div
        className={
          "file-drop-zone" + (dragOver ? " drag-over" : "")
        }
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
            <span className="file-drop-hint">
              {" "}
              — click or drop to replace
            </span>
          </p>
        ) : existingName ? (
          <p className="file-drop-text">
            Current file: <strong>{existingName}</strong>
            <span className="file-drop-hint">
              {" "}
              — click or drop to replace
            </span>
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

// Same drag/drop zone, but accepts and reports back MULTIPLE files at
// once — used for the merged "Add Thumbnail or Screenshot" uploader,
// so the admin can select several images in a single go instead of
// adding them one at a time.
function MultiFileDropZone({ label, files, accept, onChange, onClear }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const pickFiles = (fileList) => {
    if (fileList && fileList.length > 0) {
      onChange(Array.from(fileList));
    }
  };

  const removeAt = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
  };

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
          pickFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          ref={inputRef}
          accept={accept}
          multiple
          hidden
          onChange={(e) => pickFiles(e.target.files)}
        />

        <div className="file-drop-icon">⇪</div>

        {files && files.length > 0 ? (
          <p className="file-drop-text">
            <strong>
              {files.length} image{files.length > 1 ? "s" : ""} selected
            </strong>
            <span className="file-drop-hint">
              {" "}
              — click or drop to add more
            </span>
          </p>
        ) : (
          <p className="file-drop-text">
            Drag &amp; drop one or more images here, or click to browse
            (you can select multiple at once)
          </p>
        )}
      </div>

      {files && files.length > 0 && (
        <div className="multi-file-preview-list">
          {files.map((f, i) => (
            <span
              className="multi-file-preview-chip"
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                removeAt(i);
              }}
              title="Click to remove"
            >
              {f.name} ✕
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const AdminProjects = () => {
  const [form, setForm] = useState(initialForm);
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  // set only when screenshots are uploaded *before* the user has
  // clicked "Save Project" — the project gets silently created in the
  // background so screenshots have somewhere to attach to, but the
  // form should keep showing "Add Project" until they actually save
  const [draftProjectId, setDraftProjectId] = useState(null);

  // true only when the admin explicitly clicked "Edit" on an existing
  // project in the table below. Adding screenshots while still on
  // "Add Project" silently creates a draft (sets editId) but should
  // NOT flip the heading/button over to "Edit"/"Update" — this flag
  // keeps that visual distinction separate from editId itself.
  const [isExplicitEdit, setIsExplicitEdit] = useState(false);


const [documentationFile, setDocumentationFile] = useState(null);
const [presentationFile, setPresentationFile] = useState(null);
const [videoFile, setVideoFile] = useState(null);


const [existingDocumentation, setExistingDocumentation] = useState("");
const [existingPresentation, setExistingPresentation] = useState("");
const [existingVideo, setExistingVideo] = useState("");

  // ---- skills master list ----
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  // ---- project screenshot gallery (only usable once a project exists) ----
  const [screenshots, setScreenshots] = useState([]);
  const [newScreenshotFiles, setNewScreenshotFiles] = useState([]);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [pickerShot, setPickerShot] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/projects/getAllProjects.php"
      );

      const data = await response.json();

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/projects/getProjectSkills.php"
      );

      const data = await response.json();

      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  // ---- project screenshot gallery actions ----

  const fetchScreenshots = async (projectId) => {
    if (!projectId) {
      setScreenshots([]);
      return;
    }

    try {
      const response = await fetch(
        `https://riyanportfolio.site.je/server/projects/getProjectsScreenshots.php?project_id=${projectId}`
      );

      const data = await response.json();

      setScreenshots(data.success ? data.screenshots : []);
    } catch (error) {
      console.log(error);
    }
  };

  // Uploads every selected file in ONE request to the bulk endpoint,
  // instead of the old one-image-at-a-time flow with a heading field.
  const addScreenshots = async () => {
    if (!newScreenshotFiles || newScreenshotFiles.length === 0) {
      alert("Please choose at least one image to upload.");
      return;
    }

    setUploadingScreenshots(true);

    try {
      let projectId = editId || draftProjectId;

      // No project saved yet (still on "Add Project") — silently
      // create it now, using whatever fields are filled in so far, so
      // there's an ID to attach these screenshots to. We store this as
      // draftProjectId (not editId) so the form keeps showing "Add
      // Project" / "Save Project" until the user actually saves.
      if (!projectId) {
        if (!form.title || !form.category) {
          alert("Please fill in Title and Category first.");
          setUploadingScreenshots(false);
          return;
        }

        const createFormData = new FormData();
        createFormData.append("title", form.title);
        createFormData.append("category", form.category);
        createFormData.append("description", form.description);
        createFormData.append("technologies", selectedSkills.join(", "));
        createFormData.append("github", form.github);
        createFormData.append("live", form.live);
        createFormData.append("show_github", form.show_github);
        createFormData.append("show_live_demo", form.show_live_demo);
        createFormData.append("show_view_detail", form.show_view_detail);

        const createResponse = await fetch(
          "https://riyanportfolio.site.je/server/projects/addProject.php",
          { method: "POST", body: createFormData }
        );

        const createData = await createResponse.json();

        if (!createData.success) {
          alert(
            "Could not create the project: " +
              (createData.error || "Unknown server error.")
          );
          setUploadingScreenshots(false);
          return;
        }

        projectId = createData.id;
        setDraftProjectId(projectId);
        fetchProjects();
      }

      const formData = new FormData();
      formData.append("project_id", projectId);

      newScreenshotFiles.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await fetch(
        "https://riyanportfolio.site.je/server/projects/addProjectScreenshotsBulk.php",
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.success) {
        setNewScreenshotFiles([]);
        fetchScreenshots(projectId);
        fetchProjects();
      } else {
        alert(data.error || "Could not upload these images.");
      }
    } catch (error) {
      console.log(error);
      alert("Could not upload these images. Please check your connection and try again.");
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const deleteScreenshot = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await fetch(
        "https://riyanportfolio.site.je/server/projects/deleteProjectsScreenshot.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      fetchScreenshots(editId || draftProjectId);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmThumbnail = async (focalX, focalY) => {
    if (!pickerShot) return;

    const projectId = editId || draftProjectId;

    try {
      await fetch(
        "https://riyanportfolio.site.je/server/projects/setProjectThumbnail.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: pickerShot.id,
            project_id: projectId,
            focal_x: focalX,
            focal_y: focalY,
          }),
        }
      );

      setPickerShot(null);
      fetchScreenshots(projectId);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setDraftProjectId(null);
    setIsExplicitEdit(false);
    setDocumentationFile(null);
    setPresentationFile(null);
    setVideoFile(null);
    setExistingDocumentation("");
    setExistingPresentation("");
    setExistingVideo("");
    setSelectedSkills([]);
    setScreenshots([]);
    setNewScreenshotFiles([]);
  };

  // ---- skills master list actions ----

  const addSkill = async () => {
    const name = newSkillName.trim();

    if (!name) return;

    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/projects/addProjectSkill.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setNewSkillName("");
        fetchSkills();
      } else {
        alert(data.error || "Could not add this skill.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSkill = async (id) => {
    if (
      !window.confirm(
        "Delete this skill? Projects already using it will keep it in their list until you edit and re-save them."
      )
    ) {
      return;
    }

    try {
      await fetch(
        "https://riyanportfolio.site.je/server/projects/deleteProjectSkill.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      fetchSkills();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSkillSelection = (name) => {
    setSelectedSkills((prev) =>
      prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name]
    );
  };

  // ---- project actions ----

  const saveProject = async () => {
   if (!form.title || !form.category) {
  alert("Please fill in Title and Category.");
  return;
}

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("technologies", selectedSkills.join(", "));
    formData.append("github", form.github);
    formData.append("live", form.live);
    formData.append("show_github", form.show_github);
    formData.append("show_live_demo", form.show_live_demo);
    formData.append("show_view_detail", form.show_view_detail);

    if (documentationFile) {
      formData.append("documentation", documentationFile);
    }

    if (presentationFile) {
      formData.append("presentation", presentationFile);
    }

    if (videoFile) {
      formData.append("video_link", videoFile);
    }

    const targetId = editId || draftProjectId;

    try {
      let response;

      if (targetId) {
        formData.append("id", targetId);

        response = await fetch(
          "https://riyanportfolio.site.je/server/projects/updateProject.php",
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        response = await fetch(
          "https://riyanportfolio.site.je/server/projects/addProject.php",
          {
            method: "POST",
            body: formData,
          }
        );
      }

      const data = await response.json();

      if (!data.success) {
        alert(
          "Could not save the project: " +
            (data.error || "Unknown server error.")
        );
        return;
      }

      if (data.uploadErrors && data.uploadErrors.length > 0) {
        alert(
          (editId
            ? "Project updated, but some files were not uploaded:\n\n"
            : "Project added, but some files were not uploaded:\n\n") +
            data.uploadErrors.join("\n")
        );
      } else {
        alert(editId ? "Project Updated Successfully" : "Project Added Successfully");
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      console.log(error);
      alert("Something went wrong while saving the project. Check the console for details.");
    }
  };

  const editProject = (project) => {
    setForm({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      github: project.github_link || "",
      live: project.live_link || "",
      show_github: Number(project.show_github),
      show_live_demo: Number(project.show_live_demo),
      show_view_detail: Number(project.show_view_detail),
    });

    setEditId(project.id);
    setDraftProjectId(null);
    setIsExplicitEdit(true);
    setDocumentationFile(null);
    setPresentationFile(null);
    setVideoFile(null);

    fetchScreenshots(project.id);
    setNewScreenshotFiles([]);

    setExistingDocumentation(project.documentation || "");
    setExistingPresentation(project.presentation || "");
    setExistingVideo(project.video_link || "");

    const existingSkills = (project.technologies || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setSelectedSkills(existingSkills);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await fetch(
        "https://riyanportfolio.site.je/server/projects/deleteProject.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLive = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/projects/toggleProject.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/projects/featureProject.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Projects Section</h1>
          <p>Manage all portfolio projects here.</p>
        </div>

        {/* ---------------- SKILLS MASTER LIST ---------------- */}
        <div className="admin-section-card">
          <h2>Manage Skills</h2>
          <p className="admin-section-hint">
            Add each skill once here. It'll stay in this list for every
            future project — you won't need to type it again — until
            you delete it.
          </p>

          <div className="skill-add-row">
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />

            <button type="button" onClick={addSkill}>
              Add Skill
            </button>
          </div>

          <div className="skill-chip-list">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span className="skill-chip" key={skill.id}>
                  {skill.name}
                  <button
                    type="button"
                    className="skill-chip-remove"
                    onClick={() => deleteSkill(skill.id)}
                    aria-label={`Delete ${skill.name}`}
                  >
                    &times;
                  </button>
                </span>
              ))
            ) : (
              <p className="admin-section-hint">
                No skills added yet — add your first one above.
              </p>
            )}
          </div>
        </div>

        {/* ---------------- ADD / EDIT PROJECT ---------------- */}
        <div className="admin-section-card">
          <h2>{isExplicitEdit ? "Edit Project" : "Add Project"}</h2>

          <label>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <label>Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            rows="4"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Skills used in this project</label>

          {skills.length > 0 ? (
            <div className="skill-select-grid">
              {skills.map((skill) => (
                <label
                  className="skill-select-option"
                  key={skill.id}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill.name)}
                    onChange={() => toggleSkillSelection(skill.name)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="admin-section-hint">
              Add some skills above first, then select the ones that
              apply to this project.
            </p>
          )}

          <label>GitHub Link</label>
          <input
            type="text"
            name="github"
            value={form.github}
            onChange={handleChange}
          />

          <label>Live Project Link</label>
          <input
            type="text"
            name="live"
            value={form.live}
            onChange={handleChange}
          />

          <label>Show these on the project card</label>
          <div className="admin-checkbox-row">
            <label className="admin-checkbox-option">
              <input
                type="checkbox"
                name="show_github"
                checked={Number(form.show_github) === 1}
                onChange={handleChange}
              />
              Show GitHub button
            </label>

            <label className="admin-checkbox-option">
              <input
                type="checkbox"
                name="show_live_demo"
                checked={Number(form.show_live_demo) === 1}
                onChange={handleChange}
              />
              Show Live Demo button
            </label>

            <label className="admin-checkbox-option">
              <input
                type="checkbox"
                name="show_view_detail"
                checked={Number(form.show_view_detail) === 1}
                onChange={handleChange}
              />
              Show View Details button
            </label>
          </div>

          <h3 className="admin-form-subtitle">Project Files</h3>

          <FileDropZone
            label="Documentation (PDF, DOC, etc.)"
            file={documentationFile}
            existingPath={existingDocumentation}
            accept=".pdf,.doc,.docx,.txt"
            onChange={setDocumentationFile}
          />

          <FileDropZone
            label="Presentation (PPT, PDF, etc.)"
            file={presentationFile}
            existingPath={existingPresentation}
            accept=".pdf,.ppt,.pptx"
            onChange={setPresentationFile}
          />

          <FileDropZone
            label="Video / Recording"
            file={videoFile}
            existingPath={existingVideo}
            accept="video/*"
            onChange={setVideoFile}
          />

          <h3 className="admin-form-subtitle">
            Add Thumbnail or Screenshot
          </h3>
          <p className="admin-section-hint">
            Select as many images as you like — they'll all upload
            together{(editId || draftProjectId) ? "" : " (this saves the project right away using the Title and Category above, so make sure those are filled in first)"}.
            Once uploaded, click <strong>"Set as Thumbnail"</strong> on
            any image, then drag the movable frame over the part of it
            you want visible — that becomes this project's card image
            and the main image shown at the top of View Details. Every
            other uploaded image stays in the screenshot gallery.
          </p>

          <div className="screenshot-gallery-manager">
            {screenshots.length > 0 && (
              <div className="screenshot-gallery-list">
                {screenshots.map((shot) => (
                  <div className="screenshot-gallery-item" key={shot.id}>
                    <img src={shot.image} alt="" />

                    <div className="screenshot-gallery-item-info">
                      <div className="screenshot-gallery-item-actions">
                        {Number(shot.is_thumbnail) === 1 ? (
                          <span className="thumbnail-badge">
                            ★ Thumbnail
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="thumbnail-btn"
                            onClick={() => setPickerShot(shot)}
                          >
                            Set as Thumbnail
                          </button>
                        )}

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteScreenshot(shot.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="screenshot-gallery-add">
              <MultiFileDropZone
                label="Images (thumbnail + screenshots)"
                files={newScreenshotFiles}
                accept="image/*"
                onChange={setNewScreenshotFiles}
              />

              <button
                type="button"
                onClick={addScreenshots}
                disabled={uploadingScreenshots}
              >
                {uploadingScreenshots
                  ? "Uploading..."
                  : newScreenshotFiles.length > 1
                  ? `Upload ${newScreenshotFiles.length} Images`
                  : "Upload Image"}
              </button>
            </div>
          </div>

          <button onClick={saveProject}>
            {isExplicitEdit ? "Update Project" : "Save Project"}
          </button>

          {isExplicitEdit && (
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* ---------------- PROJECTS TABLE ---------------- */}
        <div className="admin-section-card">
          <h2>All Projects</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Skills</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.id}</td>

                      <td>
                        <img
                          src={
                            project.image ||
                            "https://picsum.photos/60/40"
                          }
                          alt=""
                          width="60"
                        />
                      </td>

                      <td>{project.title}</td>
                      <td>{project.category}</td>
                      <td>{project.technologies}</td>

                      <td>
                        {parseFloat(project.rating || 0).toFixed(1)} (
                        {project.rating_count || 0})
                      </td>

                      <td>
                        {Number(project.is_live) === 1
                          ? "LIVE"
                          : "NOT LIVE"}
                      </td>

                      <td>
                        {Number(project.is_featured) === 1
                          ? "YES"
                          : "NO"}
                      </td>

                      <td className="admin-actions-btns">
                        <button
                          className="live-btn"
                          onClick={() => toggleLive(project.id)}
                        >
                          {Number(project.is_live) === 1
                            ? "LIVE"
                            : "UNLIVE"}
                        </button>

                        <button
                          className="feature-btn"
                          onClick={() => toggleFeatured(project.id)}
                        >
                          {Number(project.is_featured) === 1
                            ? "FEATURED"
                            : "UNFEATURED"}
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() => editProject(project)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteProject(project.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No Projects Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {pickerShot && (
        <FocalPointPicker
          imageSrc={pickerShot.image}
          initialX={pickerShot.focal_x ?? 50}
          initialY={pickerShot.focal_y ?? 50}
          onConfirm={confirmThumbnail}
          onCancel={() => setPickerShot(null)}
        />
      )}
    </section>
  );
};

export default AdminProjects;