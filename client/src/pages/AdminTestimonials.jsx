import React, {
  useEffect,
  useState,
} from "react";

import AdminSidebar from "../components/AdminSidebar";

const AdminTestimonials = () => {

  const [testimonials, setTestimonials] =
    useState([]);

  const loadTestimonials =
    async () => {

      try {

        const response =
          await fetch(
            "https://riyanportfolio.site.je/server/testimonials/getTestimonials.php"
          );

        const data =
          await response.json();

        setTestimonials(
          data.testimonials || []
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    loadTestimonials();

  }, []);

  const toggleTestimonial =
    async (id) => {

      try {

        const response =
          await fetch(
            "https://riyanportfolio.site.je/server/testimonials/toggleTestimonial.php",
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

        const data =
          await response.json();

        if (data.success) {

          loadTestimonials();

        } else {

          alert(
            "Failed to update testimonial status"
          );

        }

      } catch (error) {

        console.log(error);

      }
    };

  const deleteTestimonial =
    async (id) => {

      if (
        !window.confirm(
          "Delete this testimonial?"
        )
      ) {
        return;
      }

      try {

        await fetch(
          "https://riyanportfolio.site.je/server/testimonials/deleteTestimonial.php",
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

        loadTestimonials();

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
            Testimonials Section
          </h1>

          <p>
            Review, approve and
            manage testimonials.
          </p>

        </div>

        <div className="admin-section-card">

          <h2>
            All Testimonials
          </h2>

          <div className="admin-table-wrap">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>
                    Client Name
                  </th>

                  <th>
                    Designation
                  </th>

                  <th>
                    Message
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {testimonials.length >
                0 ? (

                  testimonials.map(
                    (item) => (

                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>
                          {item.id}
                        </td>

                        <td>
                          {
                            item.client_name
                          }
                        </td>

                        <td>
                          {
                            item.designation
                          }
                        </td>

                        <td>
                          {
                            item.message
                          }
                        </td>

                        <td>

                          <span
                            className={
                              item.is_live ==
                              1
                                ? "status-live"
                                : "status-pending"
                            }
                          >
                            {item.is_live ==
                            1
                              ? "LIVE"
                              : "PENDING"}
                          </span>

                        </td>

                        <td className="admin-actions-btns">

                          <button
                            className="live-btn"
                            onClick={() =>
                              toggleTestimonial(
                                item.id
                              )
                            }
                          >
                            {item.is_live ==
                            1
                              ? "UNLIVE"
                              : "APPROVE"}
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteTestimonial(
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

                    <td
                      colSpan="6"
                    >
                      No Testimonials
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

export default AdminTestimonials;