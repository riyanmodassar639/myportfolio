import React,
{
  useEffect,
  useState,
} from "react";

import AdminSidebar from "../components/AdminSidebar";

const AdminContact = () => {

  const [messages,
    setMessages] =
    useState([]);

  const loadMessages =
    async () => {

      try {

        const response =
          await fetch(
            "https://riyanportfolio.site.je/server/contact/getMessages.php"
          );

        const data =
          await response.json();

        setMessages(
          data.messages || []
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    loadMessages();

  }, []);

  const deleteMessage =
    async (id) => {

      if (
        !window.confirm(
          "Delete this message?"
        )
      ) {
        return;
      }

      try {

        await fetch(
          "https://riyanportfolio.site.je/server/contact/deleteMessage.php",
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

        loadMessages();

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
            Contact Messages
          </h1>

          <p>
            Messages received
            from website visitors.
          </p>

        </div>

        <div className="admin-section-card">

          <h2>
            Inbox
          </h2>

          <div className="admin-table-wrap">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Subject</th>

                  <th>Message</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {messages.length >
                0 ? (

                  messages.map(
                    (item) => (

                      <tr
                        key={item.id}
                      >

                        <td>
                          {item.id}
                        </td>

                        <td>
                          {item.name}
                        </td>

                        <td>
                          {item.email}
                        </td>

                        <td>
                          {item.subject}
                        </td>

                        <td>
                          {item.message}
                        </td>

                        <td>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteMessage(
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
                      No Messages
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

export default AdminContact;