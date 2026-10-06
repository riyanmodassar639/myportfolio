import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminSkills = () => {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");

  const [skills, setSkills] = useState([]);

  const [editId, setEditId] = useState(null);

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/skills/getSkills.php"
      );

      const data = await response.json();

      setSkills(data.skills || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const saveSkill = async () => {
    if (!name || !percentage) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await fetch(
          "https://riyanportfolio.site.je/server/skills/updateSkill.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: editId,
              name,
              percentage,
            }),
          }
        );

        alert("Skill Updated Successfully");
      } else {
        await fetch(
          "https://riyanportfolio.site.je/server/skills/addSkill.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              percentage,
            }),
          }
        );

        alert("Skill Added Successfully");
      }

      setName("");
      setPercentage("");

      setEditId(null);

      fetchSkills();
    } catch (error) {
      console.log(error);
    }
  };

  const editSkill = (skill) => {
    setName(skill.name);
    setPercentage(skill.percentage);

    setEditId(skill.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteSkill = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/skills/deleteSkill.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      fetchSkills();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSkill = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/skills/toggleSkill.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id,
          }),
        }
      );

      fetchSkills();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Skills Section</h1>
          <p>Manage your skills from here.</p>
        </div>

        <div className="admin-section-card">
          <h2>
            {editId ? "Edit Skill" : "Add Skill"}
          </h2>

          <label>Skill Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Percentage</label>

          <input
            type="text"
            value={percentage}
            onChange={(e) =>
              setPercentage(e.target.value)
            }
          />

          <button onClick={saveSkill}>
            {editId
              ? "Update Skill"
              : "Save Skill"}
          </button>
        </div>

        <div className="admin-section-card">
          <h2>Recent Skills</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Skill</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <tr key={skill.id}>
                      <td>{skill.id}</td>

                      <td>{skill.name}</td>

                      <td>{skill.percentage}</td>

                      <td>
                        {skill.is_live == 1
                          ? "LIVE"
                          : "NOT LIVE"}
                      </td>

                      <td className="admin-actions-btns">
                        <button
                          className="live-btn"
                          onClick={() =>
                            toggleSkill(skill.id)
                          }
                        >
                          {skill.is_live == 1
                            ? "LIVE"
                            : "UNLIVE"}
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editSkill(skill)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteSkill(skill.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      No skills found
                    </td>
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

export default AdminSkills;