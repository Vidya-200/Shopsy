import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./register.css";
import axios from "axios";

function Register(){
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        
        
        if(!name) return alert('Please enter your name');
        if (!phone) return alert('Please enter your phone number');
        if (!email) return alert('Please enter your email');
        if (!password) return alert('Please enter your password');

        axios.post(`${baseUrl}/register`, { name, phone, email, password })
        .then(res => {
            console.log(res);
            alert('Registration successful! Please login.');
            navigate('/login');
        })
        .catch(err => {
            console.log(err);
            alert('Registration failed. Please try again.');
        })
    }

    return(
        <div className="register-page">
            <div className="register-container">
                <div className="left">
                    <h2>Register</h2>
                    <p>
                        Get access to your Orders<br/>
                        <br/>
                        Wishlist and<br/>
                        <br/>
                        Recommendations
                    </p>
                </div>

                <div className="right">
                    <h3>Welcome!</h3>
                    {/* <p>Enter your mobile number to start shopping.</p> */}

                    <div className="input-box">
                        <input 
                        type="name"
                        placeholder="Enter Name"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        />
                        <input
                        type="phone"
                        placeholder="Enter Phone Number"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Enter Email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <p className="terms">
                        By continuing, I agree to the
                        <a href="/terms">Terms of Use</a> and
                        <a href="/policy">Privacy Policy</a>
                    </p>

                    <button className="btn" onClick={handleRegister}>Register</button>
                    <p>Already have an Account? <a href="/login">Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;