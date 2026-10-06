import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BASE = "https://riyanportfolio.site.je/server";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    fetch(`${BASE}/blog/getPost.php?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    window.scrollTo({ top: 0 });
  }, [slug]);

  return (
    <>
      <Navbar />

      <section className="blog-post-page">
        <div className="container blog-post-container">
          <Link to="/blog" className="back-to-home-btn">
            <span className="link-icon">←</span> Back to Blog
          </Link>

          {loading ? (
            <p className="blog-empty-state">Loading...</p>
          ) : notFound || !post ? (
            <p className="blog-empty-state">
              This post couldn't be found — it may have been removed.
            </p>
          ) : (
            <article>
              <span className="blog-card-date">{formatDate(post.created_at)}</span>
              <h1>{post.title}</h1>

              {post.cover_image && (
                <div className="blog-post-cover">
                  <img src={post.cover_image} alt={post.title} />
                </div>
              )}

              <div className="blog-post-content">
                {(post.content || "")
                  .split(/\n{2,}/)
                  .filter((p) => p.trim().length > 0)
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default BlogPostPage;