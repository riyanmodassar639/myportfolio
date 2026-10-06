import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/admin/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );

        localStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        alert("Login Successful");

        navigate("/admin");
      } else {
        setError(data.message || "Invalid Email or Password");
      }
    } catch (err) {
      console.log(err);
      setError("Unable to connect to server.");
    }

    setLoading(false);
  };

  return (
    <section className="admin-login-page">
      <div className="admin-login-aurora"></div>
      <div className="admin-login-grid-overlay"></div>

      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <FaLock />
          </div>

          <h2>Portfolio Admin</h2>

          <p>Login to access your admin dashboard.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="admin-login-group">
            <label>Email</label>

            <div className="admin-input-box">
              <MdEmail className="input-icon" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-login-group">
            <label>Password</label>

            <div className="admin-input-box">
              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error">{error}</div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;