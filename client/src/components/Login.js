import React, { useState } from "react";
import Input from "./form/Input";
import { Link, redirect, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../UserContext"; 

const Login = () => {
    const location = useLocation();

    const [username, setUsername] = useState(location.state?.username || "");
    const [password, setPassword] = useState(location.state?.password || "");
    const [message, setMessage] = useState(location.state?.message || "");
    const [error, setError] = useState(null);


    const { setLoggedIn, setUserId } = useUser();

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const userObject = {
            username: username,
            password: password
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userObject)
        }

        fetch(`${process.env.REACT_APP_BACKEND}/api/authenticate`, requestOptions)
            .then(async response => {
                const data = await response.json();

                // Check if the response was successful
                if (!response.ok) {
                    setError(`Failed to login: ${data.error}`)
                    console.log(`Failed to login: ${data.error}`);
                    return;
                }

                if (data.token) {
                    // Save the JWT in local storage or wherever you want to store it
                    localStorage.setItem('token', data.token);
                    console.log('data.id:', data.id);
                    console.log('Login successful');
                    setLoggedIn(true);
                    setUserId(data.id);
                    setError("");
                    // Handle redirection or state change here
                    navigate("/");
                } else {
                    setError(`Failed to login: ${data.error}`)
                    console.log('Login failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <Input
                    title="Username"
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                />

                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Login</button>
            </form>
            <br />
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

export default Login;
