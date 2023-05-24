import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./form/Input";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordConfirmChange = (event) => {
        setPasswordConfirm(event.target.value);
    };

    const checkPasswordStrength = (password) => {
        // at least one number, one lowercase and one uppercase letter
        // at least six characters that are letters, numbers or the underscore
        const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
        return strongPassword.test(password);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username || !password || !passwordConfirm) {
            setError("All fields are required");
            return;
        }

        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        if (!checkPasswordStrength(password)) {
            setError("Password is not strong enough. It must contain at least one number, " +
            "one lowercase and one uppercase letter, and at least six characters that are letters, " +
            "numbers or the underscore");
            return;
        }

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

        fetch(`${process.env.REACT_APP_BACKEND}/api/register`, requestOptions)
            .then(async response => {
                const data = await response.json();

                // Check if the response was successful
                if (!response.ok) {
                    setError(`Failed to register: ${data.error}`);
                    return;
                }

                console.log('Registration successful');
                setUsername("");
                setPassword("");

                navigate("/login");
            })
            .catch((error) => {
                setError('Error: ' + error);
                console.error('Error:', error);
            });
    };

    return (
        <div>
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

                <Input
                    title="Confirm Password"
                    type="password"
                    className="form-control"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                />

                <button type="submit">Register</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Register;
