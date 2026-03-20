import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POSTS_QUERY, GET_HELP_REQUESTS_QUERY } from '../../graphQL/operations';
import "../../styles/home.css";

export default function Home() {
    const navigate = useNavigate();
    
    // Get user data from localStorage
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Fetch posts from backend
    const { data: postsData, loading: postsLoading, error: postsError } = useQuery(GET_POSTS_QUERY);
    const posts = postsData?.posts || [];

    // Fetch help requests from backend
    const { data: helpData, loading: helpLoading, error: helpError } = useQuery(GET_HELP_REQUESTS_QUERY, {
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

    const handleViewProfile = () => {
        navigate("/profile");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="home-container">
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>Welcome back, {user.username}!</h1>
                    <p className="welcome-subtitle">
                        {user.role === 'resident' && "Connect with your neighbors and stay informed about community events."}
                        {user.role === 'business_owner' && "Engage with the community and promote your business."}
                        {user.role === 'community_organizer' && "Manage community initiatives and support your neighbors."}
                    </p>
                    
                    <div className="user-stats">
                        <div className="stat-card">
                            <span className="stat-number">{posts.length}</span>
                            <span className="stat-label">Community Posts</span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-number">{helpRequests.length}</span>
                            <span className="stat-label">Active Help Requests</span>
                        </div>
                        
                        <div className="stat-card">
                            <span className="stat-number">Today</span>
                            <span className="stat-label">Last Visit</span>
                        </div>
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

                    <button className="action-card" onClick={handleViewProfile}>
                        <h3>My Profile</h3>
                        <p>Manage your account and settings</p>
                    </button>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-grid">

                    <div className="activity-section">
                        <h3>Latest Community Posts</h3>
                        <div className="posts-list">

                            {posts.map((post) => (
                                <div key={post._id} className="post-card" onClick={() => navigate(`/post/${post._id}`)}>
                                    <div className="post-header">
                                        <span className={`category-badge ${post.category}`}>
                                            {post.category.toUpperCase()}
                                        </span>
                                        <span className="post-date">{formatDate(post.createdAt)}</span>
                                    </div>
                                    <h4 className="post-title">{post.title}</h4>
                                    <p className="post-author">By {post.author.username}</p>
                                    {post.aiSummary && (
                                        <p className="post-summary">{post.aiSummary}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="activity-section">
                        <h3>Help Requests Needing Volunteers</h3>
                        <div className="help-list">

                            {helpRequests.map((help) => (
                                <div key={help._id} className="help-card">
                                    <div className="help-header">
                                        <span className="help-author">By {help.author.username}</span>
                                        <span className="help-date">{formatDate(help.createdAt)}</span>
                                    </div>

                                    <h4 className="help-title">Help Needed</h4>
                                    <p className="help-description">{help.description}</p>
                                    {help.location && (
                                        <div className="help-location">
                                            <span>{help.location}</span>
                                        </div>
                                    )}

                                    <div className="help-actions">
                                        <button className="volunteer-btn">Volunteer</button>
                                        <span className="volunteers-count">
                                            {help.volunteers.length} volunteers
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}