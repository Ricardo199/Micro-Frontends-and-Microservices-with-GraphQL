import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../../graphQL/operations';
import "../../styles/signup.css";

export default function SignUpForm() {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('resident');

    const [signup, { loading }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data) => {
            const { accessToken, refreshToken, user } = data.signup;
            
            // Store authentication data
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(user));
            alert('Signup successful!');
            navigate("/login");
        },
        onError: (error) => {
            alert(error.graphQLErrors?.[0]?.message || 'Signup failed');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            return alert("Username is required");
        }

        if (!email.trim()) {
            return alert("Email is required");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            return alert("Please enter a valid email");
        }

        if (!password.trim()) {
            return alert("Password is required");
        }

        signup({
            variables: {
                username,
                email,
                password,
                role
            }
        });
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div>
            <div className="login-header">
                <h1>Sign Up</h1>
            </div>

            <div login-wrapper>
                <div className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={username}  onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="resident">Resident</option>
                            <option value="business_owner">Business Owner</option>
                            <option value="community_organizer">Community Organizer</option>
                        </select>
                    </div>
                </div>

                <div className="action-commands">
                    <button onClick={handleLogin}>Login Instead</button>
                    <button onClick={handleSubmit}>Sign Up</button>
                </div>
            </div>
        </div>
    )
}