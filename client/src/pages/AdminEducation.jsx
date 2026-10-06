import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminEducation = () => {

  const [year, setYear] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [institute, setInstitute] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [education, setEducation] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  const fetchEducation = async () => {

    try {

      const response = await fetch(
        "https://riyanportfolio.site.je/server/education/getEducation.php"
      );

      const data =
        await response.json();

      setEducation(
        data.education || []
      );

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchEducation();

  }, []);

  const saveEducation = async () => {

    if (
      !year ||
      !title ||
      !institute ||
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
          "https://riyanportfolio.site.je/server/education/updateEducation.php",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: editId,
              year,
              title,
              institute,
              description,
            }),
          }
        );

        alert(
          "Education Updated Successfully"
        );

      } else {

        await fetch(
          "https://riyanportfolio.site.je/server/education/addEducation.php",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              year,
              title,
              institute,
              description,
            }),
          }
        );

        alert(
          "Education Added Successfully"
        );
      }

      // RESET

      setYear("");

      setTitle("");

      setInstitute("");

      setDescription("");

      setEditId(null);

      fetchEducation();

    } catch (error) {

      console.log(error);

    }
  };

  const editEducation = (
    item
  ) => {

    setYear(item.year);

    setTitle(item.title);

    setInstitute(
      item.institute
    );

    setDescription(
      item.description
    );

    setEditId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteEducation =
    async (id) => {

      try {

        await fetch(
          "https://riyanportfolio.site.je/server/education/deleteEducation.php",
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

        fetchEducation();

      } catch (error) {

        console.log(error);

      }
    };

  const toggleEducation =
    async (id) => {

      try {

        await fetch(
          "https://riyanportfolio.site.je/server/education/toggleEducation.php",
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

        fetchEducation();

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
            Education Section
          </h1>

          <p>
            Manage all education
            records here.
          </p>

        </div>

        <div className="admin-section-card">

          <h2>
            {editId
              ? "Edit Education"
              : "Add Education"}
          </h2>

          <label>
            Duration
          </label>

          <input
            type="text"
            placeholder="2025 — Present"
            value={year}
            onChange={(e) =>
              setYear(
                e.target.value
              )
            }
          />

          <label>
            Degree Title
          </label>

          <input
            type="text"
            placeholder="Bachelor of Computer Science"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <label>
            Institute Name
          </label>

          <input
            type="text"
            placeholder="Lahore Garrison University"
            value={institute}
            onChange={(e) =>
              setInstitute(
                e.target.value
              )
            }
          />

          <label>
            Description
          </label>

          <textarea
            rows="6"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <button
            onClick={
              saveEducation
            }
          >
            {editId
              ? "Update Education"
              : "Save Education"}
          </button>

        </div>

        <div className="admin-section-card">

          <h2>
            Education Records
          </h2>

          <div className="admin-table-wrap">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Year</th>

                  <th>Title</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {education.length > 0 ? (

                  education.map(
                    (item) => (

                      <tr
                        key={item.id}
                      >

                        <td>
                          {item.id}
                        </td>

                        <td>
                          {item.year}
                        </td>

                        <td>
                          {item.title}
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
                              toggleEducation(
                                item.id
                              )
                            }
                          >
                            {item.is_live ==
                            1
                              ? "LIVE"
                              : "UNLIVE"}
                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editEducation(
                                item
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteEducation(
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
                      No Education Found
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

export default AdminEducation;