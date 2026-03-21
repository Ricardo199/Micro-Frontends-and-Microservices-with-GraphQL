import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POSTS_QUERY, GET_HELP_REQUESTS_QUERY } from '../../graphQL/operations';
import { communityApolloClient } from '../../services/apolloClient.js';
import "../../styles/home.css";

export default function Home() {
    const navigate = useNavigate();
    
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const { data: postsData, loading: postsLoading, error: postsError } = useQuery(GET_POSTS_QUERY, {
        client: communityApolloClient
    });
    const posts = postsData?.posts || [];

    const { data: helpData, loading: helpLoading, error: helpError } = useQuery(GET_HELP_REQUESTS_QUERY, {
        client: communityApolloClient,
        variables: { isResolved: false }
    });
    const helpRequests = helpData?.helpRequests || [];

    const handleCreatePost = () => {
        navigate("/create-post");
    };

    const handleRequestHelp = () => {
        navigate("/create-help");
    };

    const handleViewCommunity = () => {
        navigate("/news");
    };

    const handleViewHelp = () => {
        navigate("/help");
    };
    
    const handleViewProfile = () => {
        navigate("/profile");
    };
    
    return (
        <div className="home-container">
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>Welcome back, {user.username}!</h1>
                    <div className="margin">
                        <p className="welcome-subtitle">
                            {user.role === 'resident' && "Connect with your neighbors and stay informed about community events."}
                            {user.role === 'business_owner' && "Engage with the community and promote your business."}
                            {user.role === 'community_organizer' && "Manage community initiatives and support your neighbors."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <button className="action-card" onClick={handleCreatePost}>
                        <h3>Create Post</h3>
                        <p>Share news, start a discussion, or announce an event</p>
                    </button>

                    <button className="action-card" onClick={handleRequestHelp}>
                        <h3>Request Help</h3>
                        <p>Ask for assistance from your community</p>
                    </button>

                    <button className="action-card" onClick={handleViewCommunity}>
                        <h3>View News</h3>
                        <p>Explore posts and discussions</p>
                    </button>

                    <button className="action-card" onClick={handleViewHelp}>
                        <h3>View Help</h3>
                        <p>Aid other users questions and concerns</p>
                    </button>

                    <button className="action-card" onClick={handleViewProfile}>
                        <h3>My Profile</h3>
                        <p>Manage your account and settings</p>
                    </button>
                </div>
            </div>
        </div>
    );
}