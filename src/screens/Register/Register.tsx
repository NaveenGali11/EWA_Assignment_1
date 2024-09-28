import React, { useState } from 'react';
import './Register.css'; // We'll define the styles for centering the form here
import { registerUser } from '../../sevices/LoginService';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [userType, setUserType] = useState<string>('customer'); // Default user type
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle registration logic here
        console.log("Registering user:", { username, email, userType, password });
        try {
            const response = await registerUser(username,password,email,userType);
            localStorage.setItem("user_id", response.user_id);
            localStorage.setItem("token", response.token);
            localStorage.setItem("username", response.username);
            localStorage.setItem("userType", response.userType);
            navigate("/");
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="register-container">
            <form className="register-box" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="userType">User Type:</label>
                    <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                    >
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                        <option value="sales_man">Sales Manager</option>
                        <option value="delivery_staff">Delivery Staff</option>
                    </select>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
