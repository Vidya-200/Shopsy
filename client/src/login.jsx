import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./login.css";
import axios from "axios";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("${baseUrl}/login", { email, password })
        .then(res => {console.log(res);})

        .catch(err => console.log(err))
        if (!email) return alert('Please enter your email');
        if (!password) return alert('Please enter your password');

        
        navigate('/home');
    }

    return(
        <div className="login-page">
            <div className="login-container">
                <div className="left">
                    <h2>Login</h2>
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

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Enter Email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
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

                    <button className="btn" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;