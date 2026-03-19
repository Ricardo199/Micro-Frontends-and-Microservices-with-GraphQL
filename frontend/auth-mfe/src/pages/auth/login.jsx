import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphQL/operations';
import "../../styles/login.css";

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            const { accessToken, refreshToken, user } = data.login;
            
            // Store authentication data
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(user));
            alert('Login successful!');
            navigate("/home");
        },
        onError: (error) => {
            alert(error.graphQLErrors?.[0]?.message || 'Login failed');
        }
    });

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

        login({
            variables: {
                email,
                password
            }
        });
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    // Remove this later
    const bypass = () => {
        navigate("/home");
    }

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
                    <button onClick={bypass}>bypass</button>
            </div>
        </div>
    )
}