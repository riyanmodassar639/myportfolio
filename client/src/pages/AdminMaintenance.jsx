import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const BASE = "https://riyanportfolio.site.je/server";

function AdminMaintenance() {
  const [isMaintenance, setIsMaintenance] = useState(null); // null = loading
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadStatus = () => {
    fetch(`${BASE}/maintenance/getMaintenance.php`)
      .then((res) => res.json())
      .then((data) => {
        setIsMaintenance(!!Number(data.is_maintenance));
        setUpdatedAt(data.updated_at || null);
      })
      .catch(() => setIsMaintenance(false));
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleToggle = () => {
    if (saving || isMaintenance === null) return;

    setSaving(true);

    fetch(`${BASE}/maintenance/toggleMaintenance.php`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsMaintenance(!!Number(data.is_maintenance));
          setUpdatedAt(new Date().toISOString());
        }
      })
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Maintenance Mode</h1>
          <p>
            Take the public website offline for visitors while you make
            changes — the admin panel stays accessible the whole time.
          </p>
        </div>

        <div className="admin-section-card maintenance-control-card">
          <h2>Public Website Status</h2>

          <div className="maintenance-toggle-row">
            <div className="maintenance-toggle-info">
              <span
                className={
                  "maintenance-status-pill" +
                  (isMaintenance ? " is-off" : " is-on")
                }
              >
                {isMaintenance === null
                  ? "Checking..."
                  : isMaintenance
                  ? "Under Maintenance"
                  : "Live"}
              </span>

              <p>
                {isMaintenance === null
                  ? "Loading current status..."
                  : isMaintenance
                  ? "Visitors currently see the maintenance page instead of your portfolio."
                  : "Your portfolio is live and visible to everyone."}
              </p>
            </div>

            <button
              type="button"
              className={
                "maintenance-switch" + (isMaintenance ? " active" : "")
              }
              onClick={handleToggle}
              disabled={saving || isMaintenance === null}
              aria-pressed={!!isMaintenance}
              aria-label="Toggle maintenance mode"
            >
              <span className="maintenance-switch-knob" />
            </button>
          </div>

          {updatedAt && (
            <p className="admin-section-hint">
              Last changed:{" "}
              {new Date(
                /[zZ]|[+-]\d{2}:?\d{2}$/.test(updatedAt.trim())
                  ? updatedAt.trim().replace(" ", "T")
                  : updatedAt.trim().replace(" ", "T") + "Z"
              ).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminMaintenance;