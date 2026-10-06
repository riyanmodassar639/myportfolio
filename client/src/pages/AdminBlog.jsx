import React, { useEffect, useState, useRef } from "react";
import AdminSidebar from "../components/AdminSidebar";

const BASE = "https://riyanportfolio.site.je/server";

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
            Drag &amp; drop a cover image here, or click to browse
          </p>
        )}
      </div>
    </div>
  );
}

const AdminBlog = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE}/blog/getPosts.php`);
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setIsPublished(true);
    setCoverImage(null);
    setExistingImage("");
    setEditId(null);
  };

  const savePost = async () => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("is_published", isPublished ? 1 : 0);

    if (coverImage) {
      formData.append("cover_image", coverImage);
    }

    setSaving(true);

    try {
      if (editId) {
        formData.append("id", editId);

        const res = await fetch(`${BASE}/blog/updatePost.php`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          alert("Post Updated Successfully");
        } else {
          alert(data.error || "Could not update this post.");
        }
      } else {
        const res = await fetch(`${BASE}/blog/addPost.php`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          alert("Post Added Successfully");
        } else {
          alert(data.error || "Could not add this post.");
        }
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const editPost = (post) => {
    setTitle(post.title);
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setIsPublished(Number(post.is_published) === 1);
    setCoverImage(null);
    setExistingImage(post.cover_image || "");
    setEditId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;

    try {
      await fetch(`${BASE}/blog/deletePost.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const togglePost = async (id) => {
    try {
      await fetch(`${BASE}/blog/togglePost.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Blog</h1>
          <p>Write and manage your blog posts here.</p>
        </div>

        <div className="admin-section-card">
          <h2>{editId ? "Edit Post" : "Add Post"}</h2>

          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Excerpt (short summary shown on the blog list)</label>
          <textarea
            rows="2"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Leave blank to auto-generate from the content"
          />

          <FileDropZone
            label="Cover Image"
            file={coverImage}
            existingPath={existingImage}
            accept="image/*"
            onChange={setCoverImage}
          />

          <label>Content</label>
          <textarea
            rows="14"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here. Leave a blank line between paragraphs."
          />

          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            {" "}Published (visible on the public blog)
          </label>

          <button onClick={savePost} disabled={saving}>
            {saving
              ? "Saving..."
              : editId
              ? "Update Post"
              : "Save Post"}
          </button>

          {editId && (
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="admin-section-card">
          <h2>All Posts</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" width="70" />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{post.title}</td>
                      <td>
                        {Number(post.is_published) === 1
                          ? "PUBLISHED"
                          : "DRAFT"}
                      </td>
                      <td className="admin-actions-btns">
                        <button
                          className="live-btn"
                          onClick={() => togglePost(post.id)}
                        >
                          {Number(post.is_published) === 1
                            ? "PUBLISHED"
                            : "DRAFT"}
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() => editPost(post)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deletePost(post.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No posts yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminBlog;