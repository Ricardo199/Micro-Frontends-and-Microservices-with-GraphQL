import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/login.css"; 

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            return alert("Email is required");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            return alert("Please enter a valid email");
        }

        if (!password.trim()) {
            return alert("Password is required");
        }

        try {
            // TODO: Connect to GraphQL mutation
            // Below is fake temp backend calls
            const response = await fetch(
                'http://localhost:5000/api/users/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Login failed');
                return;
            }
            
            // Store authentication data
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(data.user));
            alert('Login successful!');
            navigate("/home");
        } catch(error) {
            console.error(error);
            alert('Server error');
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div>
            <div className="login-header">
                <h1>Login</h1>
            </div>

            <div className="login-wrapper">
                <div className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                <div className="action-commands">
                    <button onClick={handleSubmit}>Login</button>
                    <button onClick={handleSignUp}>Sign Up Instead</button>
                </div>
            </div>
        </div>
    )
}