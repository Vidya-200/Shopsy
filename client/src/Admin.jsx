import React, { useState } from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "12345";

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      alert("Login Successful");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-btn">LOGIN</button>

          
        </form>
      </div>
    </div>
  );
}

export default Admin;