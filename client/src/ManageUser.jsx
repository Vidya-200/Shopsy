import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageUser.css";

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios.get("${baseUrl}/users")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to load users");
        setLoading(false);
      });
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`${baseUrl}/deleteUser/${id}`)
        .then(res => {
          alert("User Deleted Successfully");
          fetchUsers();
        })
        .catch(err => {
          console.log(err);
          alert("Failed to delete user");
        });
    }
  };

  if (loading) {
    return <div className="manage-container"><p>Loading users...</p></div>;
  }

  if (error) {
    return <div className="manage-container"><p className="error">{error}</p></div>;
  }

  return (
    <div className="manage-container">
      <h2>Manage Users</h2>

      {users.length === 0 ? (
        <p className="no-data">No users found</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.phone || "N/A"}</td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUser;