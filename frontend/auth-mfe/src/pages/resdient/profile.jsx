import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../../graphQL/operations';
import { authApolloClient } from '../../services/apolloClient.js';
import "../../styles/home.css";

export default function Profile() {
    const navigate = useNavigate();
    
    const { data: userData, loading: userLoading, error: userError } = useQuery(ME_QUERY, {
        client: authApolloClient,
        onError: (error) => {
            console.error('Error fetching user data:', error);
            navigate('/login');
        }
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userData?.me) {
            setUser(userData.me);
        }
    }, [userData]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    const handleHome = () => {
        navigate("/home");
    }

    if (userLoading) {
        return (
            <div className="profile-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (userError || !user) {
        return (
            <div className="profile-container">
                <div className="error-state">
                    <h2>Unable to Load Profile</h2>
                    <p>There was an error loading your profile. Please try again.</p>
                    <button className="primary-btn" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                </div>
                
                <div className="profile-info">
                    <h1>{user.username}</h1>
                    <p className="profile-email">{user.email}</p>
                    <span className={`role-badge ${user.role}`}>
                        {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className="member-since">Member since January 2024</p>
                </div>
            </div>

            <div className="profile-actions">
                <button className="action-btn secondary" onClick={handleLogout}>
                    Logout
                </button>

                <button className='action-btn secondary' onClick={handleHome}>
                    Home
                </button>
            </div>
        </div>
    );
}