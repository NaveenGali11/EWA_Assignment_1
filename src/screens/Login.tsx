import React, {useEffect, useState} from 'react';
import './Login.css';
import {loginUser} from "../sevices/LoginService";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") && localStorage.getItem("username") && localStorage.getItem("userType")) {
            navigate("/");
        }
    },[navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle the login logic here (e.g., form submission)
        console.log("Username:", username, "Password:", password);
        try {
            const response = await loginUser(username, password);
            localStorage.setItem("user_id", response.user_id);
            localStorage.setItem("token", response.token);
            localStorage.setItem("username", response.username);
            localStorage.setItem("userType", response.userType);
            navigate("/")
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="input-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <p>Not a Smart Homes User ? <a href='/register'>Register Now</a></p>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
