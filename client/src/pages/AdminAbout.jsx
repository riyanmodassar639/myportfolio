import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminAbout = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");

  const [projects, setProjects] = useState("");
  const [satisfaction, setSatisfaction] = useState("");
  const [experience, setExperience] = useState("");

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] =
    useState("");

  const [aboutData, setAboutData] = useState([]);
  const [services, setServices] = useState([]);

  const [activeTab, setActiveTab] = useState("");

  const [editAboutId, setEditAboutId] = useState(null);
  const [editServiceId, setEditServiceId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/about/getAbout.php"
      );

      const data = await response.json();

      setAboutData(data.sections || []);
      setServices(data.services || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveContent = async () => {
    if (
      !heading ||
      !description ||
      !projects ||
      !satisfaction ||
      !experience
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editAboutId) {
        await fetch(
          "https://riyanportfolio.site.je/server/about/updateAbout.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              id: editAboutId,
              heading,
              description,
              projects,
              satisfaction,
              experience,
            }),
          }
        );

        alert("Content Updated Successfully");
      } else {
        await fetch(
          "https://riyanportfolio.site.je/server/about/addAbout.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              heading,
              description,
              projects,
              satisfaction,
              experience,
            }),
          }
        );

        alert("Content Added Successfully");
      }

      setHeading("");
      setDescription("");

      setProjects("");
      setSatisfaction("");
      setExperience("");

      setEditAboutId(null);

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const saveService = async () => {
    if (!serviceTitle || !serviceDescription) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editServiceId) {
        await fetch(
          "https://riyanportfolio.site.je/server/about/updateService.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              id: editServiceId,
              title: serviceTitle,
              description: serviceDescription,
            }),
          }
        );

        alert("Service Updated Successfully");
      } else {
        await fetch(
          "https://riyanportfolio.site.je/server/about/addService.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              title: serviceTitle,
              description: serviceDescription,
            }),
          }
        );

        alert("Service Added Successfully");
      }

      setServiceTitle("");
      setServiceDescription("");

      setEditServiceId(null);

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const editAbout = (item) => {
    setHeading(item.heading);
    setDescription(item.description);

    setProjects(item.projects_completed);
    setSatisfaction(item.client_satisfaction);
    setExperience(item.years_experience);

    setEditAboutId(item.id);

    setActiveTab("content");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const editService = (service) => {
    setServiceTitle(service.title);
    setServiceDescription(service.description);

    setEditServiceId(service.id);

    setActiveTab("services");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteAbout = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/about/deleteAbout.php",
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

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteService = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/about/deleteService.php",
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

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const makeLive = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/about/liveAbout.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ id }),
        }
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleService = async (id) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/about/toggleService.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ id }),
        }
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="admin">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>About Section</h1>
          <p>Manage your About content from here.</p>
        </div>

        <div className="admin-actions">
          <button
            className={`admin-toggle-btn ${
              activeTab === "content" ? "active" : ""
            }`}
            onClick={() =>
              setActiveTab(
                activeTab === "content" ? "" : "content"
              )
            }
          >
            Add Content
          </button>

          <button
            className={`admin-toggle-btn ${
              activeTab === "services" ? "active" : ""
            }`}
            onClick={() =>
              setActiveTab(
                activeTab === "services" ? "" : "services"
              )
            }
          >
            Add Service
          </button>
        </div>

        {activeTab === "content" && (
          <div className="admin-section-card">
            <h2>
              {editAboutId
                ? "Edit About Content"
                : "About Content"}
            </h2>

            <label>Heading</label>

            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
            />

            <label>Description</label>

            <textarea
              rows="6"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <label>Projects Completed</label>

            <input
              type="text"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
            />

            <label>Client Satisfaction</label>

            <input
              type="text"
              value={satisfaction}
              onChange={(e) =>
                setSatisfaction(e.target.value)
              }
            />

            <label>Years Experience</label>

            <input
              type="text"
              value={experience}
              onChange={(e) =>
                setExperience(e.target.value)
              }
            />

            <button onClick={saveContent}>
              {editAboutId
                ? "Update Content"
                : "Save Content"}
            </button>
          </div>
        )}

        {activeTab === "services" && (
          <div className="admin-section-card">
            <h2>
              {editServiceId
                ? "Edit Service"
                : "Service Headings"}
            </h2>

            <input
              type="text"
              placeholder="Service Title"
              value={serviceTitle}
              onChange={(e) =>
                setServiceTitle(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Service Description"
              value={serviceDescription}
              onChange={(e) =>
                setServiceDescription(e.target.value)
              }
            />

            <button onClick={saveService}>
              {editServiceId
                ? "Update Service"
                : "Save Service"}
            </button>
          </div>
        )}

        <div className="admin-section-card">
          <h2>Recent Content</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Heading</th>
                  <th>Projects</th>
                  <th>Satisfaction</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {aboutData.length > 0 ? (
                  aboutData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>

                      <td>{item.heading}</td>

                      <td>
                        {item.projects_completed}
                      </td>

                      <td>
                        {item.client_satisfaction}
                      </td>

                      <td>
                        {item.years_experience}
                      </td>

                      <td>
                        {item.is_live == 1
                          ? "LIVE"
                          : "NOT LIVE"}
                      </td>

                      <td className="admin-actions-btns">
                        <button
                          className="live-btn"
                          onClick={() =>
                            makeLive(item.id)
                          }
                        >
                          {item.is_live == 1
                            ? "LIVE"
                            : "Make Live"}
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editAbout(item)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteAbout(item.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      No content found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section-card">
          <h2>Recent Services</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.id}</td>

                      <td>{service.title}</td>

                      <td>{service.description}</td>

                      <td>
                        {service.is_live == 1
                          ? "LIVE"
                          : "NOT LIVE"}
                      </td>

                      <td className="admin-actions-btns">
                        <button
                          className="live-btn"
                          onClick={() =>
                            toggleService(service.id)
                          }
                        >
                          {service.is_live == 1
                            ? "LIVE"
                            : "UNLIVE"}
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editService(service)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteService(service.id)
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
                      No services found
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

export default AdminAbout;