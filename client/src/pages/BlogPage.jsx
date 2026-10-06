import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Reveal from "../components/Reveal";

const BASE = "https://riyanportfolio.site.je/server";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function excerptOf(post) {
  if (post.excerpt) return post.excerpt;
  const text = (post.content || "").replace(/\s+/g, " ").trim();
  return text.length > 160 ? text.slice(0, 160) + "…" : text;
}

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/blog/getPosts.php?published_only=1`)
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <section className="blog-page">
        <div className="container">
          <Link to="/" className="back-to-home-btn">
            <span className="link-icon">←</span> Back to Home
          </Link>

          <Reveal as="div" className="blog-page-head">
            <h1>From the Blog</h1>
            <p>Notes on projects, tools, and things I've learned along the way.</p>
          </Reveal>

          {loading ? (
            <p className="blog-empty-state">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty-state">No posts yet — check back soon.</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Reveal as="div" className="blog-card" key={post.id}>
                  <Link to={`/blog/${post.slug}`} className="blog-card-link">
                    {post.cover_image && (
                      <div className="blog-card-image">
                        <img src={post.cover_image} alt={post.title} />
                      </div>
                    )}

                    <div className="blog-card-body">
                      <span className="blog-card-date">
                        {formatDate(post.created_at)}
                      </span>
                      <h3>{post.title}</h3>
                      <p>{excerptOf(post)}</p>
                      <span className="blog-card-readmore">
                        Read more <span className="link-icon">→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BlogPage;