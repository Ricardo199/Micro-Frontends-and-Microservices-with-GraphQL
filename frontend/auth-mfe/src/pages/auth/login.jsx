import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphQL/operations';
import { authApolloClient } from '../../services/apolloClient.js';
import "../../styles/login.css";

export default function LoginForm() {
    const navigate = useNavigate();
    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        client: authApolloClient
    });

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
            const { data } = await login({
                variables: { email, password }
            });

            localStorage.setItem("authToken", data.login.accessToken);
            localStorage.setItem("refreshToken", data.login.refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(data.login.user));
            
            alert('Login successful!');
            navigate("/home");
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed. Please check your credentials.');
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

            <div className="login-wrapper" login-wrapper="true">
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
                    <button onClick={bypass}>bypass</button>
            </div>
        </div>
    )
}