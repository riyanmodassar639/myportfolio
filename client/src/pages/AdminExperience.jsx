import React, {
  useEffect,
  useState,
} from "react";

import AdminSidebar from "../components/AdminSidebar";

const AdminExperience = () => {
  const [duration, setDuration] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [experience, setExperience] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  const fetchExperience = async () => {
    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/experience/getExperience.php"
      );

      // Read as text first so a bad/empty response doesn't crash the app
      const text = await response.text();

      if (!text) {
        console.error(
          "getExperience.php returned an empty response"
        );
        setExperience([]);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error(
          "getExperience.php returned invalid JSON:",
          text
        );
        setExperience([]);
        return;
      }

      console.log("Experience API:", data);

      setExperience(data.experience || []);
    } catch (error) {
      console.log(error);
      setExperience([]);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const saveExperience =
    async () => {
      if (
        !duration ||
        !jobTitle ||
        !company ||
        !description
      ) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      try {
        if (editId) {
          await fetch(
            "https://riyanportfolio.site.je/server/experience/updateExperience.php",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                id: editId,
                duration,
                job_title:
                  jobTitle,
                company,
                description,
              }),
            }
          );

          alert(
            "Experience Updated Successfully"
          );
        } else {
          await fetch(
            "https://riyanportfolio.site.je/server/experience/addExperience.php",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                duration,
                job_title:
                  jobTitle,
                company,
                description,
              }),
            }
          );

          alert(
            "Experience Added Successfully"
          );
        }

        setDuration("");
        setJobTitle("");
        setCompany("");
        setDescription("");
        setEditId(null);

        fetchExperience();
      } catch (error) {
        console.log(error);
      }
    };

  const editExperience = (
    item
  ) => {
    setDuration(item.duration);

    setJobTitle(
      item.job_title
    );

    setCompany(item.company);

    setDescription(
      item.description
    );

    setEditId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteExperience =
    async (id) => {
      try {
        await fetch(
          "https://riyanportfolio.site.je/server/experience/deleteExperience.php",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
            }),
          }
        );

        fetchExperience();
      } catch (error) {
        console.log(error);
      }
    };

  const toggleExperience =
    async (id) => {
      try {
        await fetch(
          "https://riyanportfolio.site.je/server/experience/toggleExperience.php",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
            }),
          }
        );

        fetchExperience();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>
            Experience Section
          </h1>

          <p>
            Manage your
            experience here.
          </p>
        </div>

        <div className="admin-section-card">

          <h2>
            {editId
              ? "Edit Experience"
              : "Add Experience"}
          </h2>

          <label>
            Duration
          </label>

          <input
            type="text"
            value={duration}
            onChange={(e) =>
              setDuration(
                e.target.value
              )
            }
          />

          <label>
            Job Title
          </label>

          <input
            type="text"
            value={jobTitle}
            onChange={(e) =>
              setJobTitle(
                e.target.value
              )
            }
          />

          <label>
            Company
          </label>

          <input
            type="text"
            value={company}
            onChange={(e) =>
              setCompany(
                e.target.value
              )
            }
          />

          <label>
            Description
          </label>

          <textarea
            rows="5"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <button
            onClick={
              saveExperience
            }
          >
            {editId
              ? "Update Experience"
              : "Save Experience"}
          </button>

        </div>

        <div className="admin-section-card">

          <h2>
            Recent Experience
          </h2>

          <div className="admin-table-wrap">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Duration</th>
                  <th>Job Title</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {experience.length >
                0 ? (
                  experience.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td>
                          {
                            item.id
                          }
                        </td>

                        <td>
                          {
                            item.duration
                          }
                        </td>

                        <td>
                          {
                            item.job_title
                          }
                        </td>

                        <td>
                          {item.is_live ==
                          1
                            ? "LIVE"
                            : "NOT LIVE"}
                        </td>

                        <td className="admin-actions-btns">

                          <button
                            className="live-btn"
                            onClick={() =>
                              toggleExperience(
                                item.id
                              )
                            }
                          >
                            Toggle
                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editExperience(
                                item
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteExperience(
                                item.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="5">
                      No Experience
                      Found
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

export default AdminExperience;