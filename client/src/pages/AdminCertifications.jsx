import React, { useEffect, useState, useRef } from "react";
import AdminSidebar from "../components/AdminSidebar";

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
              {" "}— click or drop to replace
            </span>
          </p>
        ) : existingName ? (
          <p className="file-drop-text">
            Current file: <strong>{existingName}</strong>
            <span className="file-drop-hint">
              {" "}— click or drop to replace
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
const AdminCertifications = () => {
  const [year, setYear] = useState("");
  const [certificateName, setCertificateName] =
    useState("");

  const [organization, setOrganization] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [credentialLink, setCredentialLink] =
    useState("");

  const [certificateImage, setCertificateImage] =
    useState(null);
const [existingImage, setExistingImage] =
  useState("");
  const [certifications, setCertifications] =
    useState([]);

  const [editId, setEditId] = useState(null);

  const fetchCertifications = async () => {
    try {
      const response = await fetch(
        "https://riyanportfolio.site.je/server/certifications/getCertifications.php"
      );

      const data = await response.json();

      setCertifications(
        data.certifications || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const saveCertification = async () => {
    if (
      !year ||
      !certificateName ||
      !organization ||
      !description
    ) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("year", year);

    formData.append(
      "certificate_name",
      certificateName
    );

    formData.append(
      "organization",
      organization
    );

    formData.append(
      "description",
      description
    );

    formData.append(
      "credential_link",
      credentialLink
    );

    if (certificateImage) {
      formData.append(
        "certificate_image",
        certificateImage
      );
    }

    try {
      if (editId) {
        formData.append("id", editId);

        await fetch(
          "https://riyanportfolio.site.je/server/certifications/updateCertification.php",
          {
            method: "POST",
            body: formData,
          }
        );

        alert(
          "Certification Updated Successfully"
        );
      } else {
        await fetch(
          "https://riyanportfolio.site.je/server/certifications/addCertification.php",
          {
            method: "POST",
            body: formData,
          }
        );

        alert(
          "Certification Added Successfully"
        );
      }

      setYear("");
      setCertificateName("");
      setOrganization("");
      setDescription("");
      setCredentialLink("");
      setCertificateImage(null);
setExistingImage("");
      setEditId(null);

      fetchCertifications();
    } catch (error) {
      console.log(error);
    }
  };

  const editCertification = (
    certification
  ) => {
    setYear(certification.year);

    setCertificateName(
      certification.certificate_name
    );

    setOrganization(
      certification.organization
    );

    setDescription(
      certification.description
    );

    setCredentialLink(
      certification.credential_link || ""
    );

    setEditId(certification.id);
setCertificateImage(null);
setExistingImage(
  certification.certificate_image || ""
);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteCertification = async (
    id
  ) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/certifications/deleteCertification.php",
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

      fetchCertifications();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCertification = async (
    id
  ) => {
    try {
      await fetch(
        "https://riyanportfolio.site.je/server/certifications/toggleCertification.php",
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

      fetchCertifications();
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
            Certifications Section
          </h1>

          <p>
            Manage all certifications
            here.
          </p>
        </div>

        <div className="admin-section-card">
          <h2>
            {editId
              ? "Edit Certification"
              : "Add Certification"}
          </h2>

          <label>Year</label>

          <input
            type="text"
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
          />

          <label>
            Certificate Name
          </label>

          <input
            type="text"
            value={certificateName}
            onChange={(e) =>
              setCertificateName(
                e.target.value
              )
            }
          />

          <label>
            Organization
          </label>

          <input
            type="text"
            value={organization}
            onChange={(e) =>
              setOrganization(
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

          <FileDropZone
            label="Certificate Image"
            file={certificateImage}
            existingPath={existingImage}
            accept="image/*"
            onChange={setCertificateImage}
          />

          <label>
            Credential Link
          </label>

          <input
            type="text"
            value={credentialLink}
            onChange={(e) =>
              setCredentialLink(
                e.target.value
              )
            }
          />

          <button
            onClick={saveCertification}
          >
            {editId
              ? "Update Certification"
              : "Save Certification"}
          </button>
        </div>

        <div className="admin-section-card">
          <h2>
            Recent Certifications
          </h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Image</th>

                  <th>Name</th>

                  <th>Organization</th>

                  <th>Status</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {certifications.length >
                0 ? (
                  certifications.map(
                    (
                      certification
                    ) => (
                      <tr
                        key={
                          certification.id
                        }
                      >
                        <td>
                          {
                            certification.id
                          }
                        </td>

                        <td>
                          <img
                            src={`https://riyanportfolio.site.je/server/${certification.certificate_image}`}
                            alt=""
                            width="70"
                          />
                        </td>

                        <td>
                          {
                            certification.certificate_name
                          }
                        </td>

                        <td>
                          {
                            certification.organization
                          }
                        </td>

                        <td>
                          {certification.is_live ==
                          1
                            ? "LIVE"
                            : "NOT LIVE"}
                        </td>

                        <td className="admin-actions-btns">
                          <button
                            className="live-btn"
                            onClick={() =>
                              toggleCertification(
                                certification.id
                              )
                            }
                          >
                            {certification.is_live ==
                            1
                              ? "LIVE"
                              : "UNLIVE"}
                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editCertification(
                                certification
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteCertification(
                                certification.id
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
                    <td colSpan="6">
                      No Certifications
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

export default AdminCertifications;