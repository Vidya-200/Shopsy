import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); 
    alert("Logged out successfully");
    navigate('/admin');
  };

  return (
    <div className="dashboard">

      
      <div className="top-bar">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">

        <Link to="/add-product" className="card">
          <h3>Add Product</h3>
        </Link>

        <Link to="/view-product" className="card">
          <h3>View Products</h3>
        </Link>

        <Link to="/manage-product" className="card">
          <h3>Manage Products</h3>
        </Link>

        <Link to="/manage-user" className="card">
          <h3>Manage User</h3>
        </Link>

        <Link to="/order" className="card">
          <h3>Manage Orders</h3>
        </Link>

      </div>
    </div>
  );
}

export default Admin;