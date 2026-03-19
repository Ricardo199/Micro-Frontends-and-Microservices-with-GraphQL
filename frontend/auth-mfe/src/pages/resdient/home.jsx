import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POSTS_QUERY, GET_HELP_REQUESTS_QUERY, ME_QUERY } from '../graphQL/operations';
import './home.css';

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    // Fetch user data
    const { data: userData, loading: userLoading } = useQuery(ME_QUERY, {
        onCompleted: (data) => {
            setUser(data.me);
        },
        onError: (error) => {
            console.error('Error fetching user:', error);
            // Redirect to login if not authenticated
            navigate('/login');
        }
    });

    // Every 2 mins, fetech post
    const { data: postsData, loading: postsLoading } = useQuery(GET_POSTS_QUERY, {
        variables: { category: null },
        pollInterval: 120000,
    });

    // Every 2 mins, fetch all help
    const { data: helpData, loading: helpLoading } = useQuery(GET_HELP_REQUESTS_QUERY, {
        variables: { isResolved: false },
        pollInterval: 30000,
    });

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

    if (userLoading || !user) {
        return (
            <div className="home-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your community...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Welcome Section */}
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
                            <span className="stat-number">{postsData?.posts?.length || 0}</span>
                            <span className="stat-label">Community Posts</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{helpData?.helpRequests?.length || 0}</span>
                            <span className="stat-label">Active Help Requests</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">Today</span>
                            <span className="stat-label">Last Visit</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <button className="action-card" onClick={handleCreatePost}>
                        <div className="action-icon">📝</div>
                        <h3>Create Post</h3>
                        <p>Share news, start a discussion, or announce an event</p>
                    </button>
                    <button className="action-card" onClick={handleRequestHelp}>
                        <div className="action-icon">🆘</div>
                        <h3>Request Help</h3>
                        <p>Ask for assistance from your community</p>
                    </button>
                    <button className="action-card" onClick={handleViewCommunity}>
                        <div className="action-icon">📰</div>
                        <h3>View Community</h3>
                        <p>Explore posts and discussions</p>
                    </button>
                    <button className="action-card" onClick={handleViewProfile}>
                        <div className="action-icon">👤</div>
                        <h3>My Profile</h3>
                        <p>Manage your account and settings</p>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-grid">
                    {/* Recent Posts */}
                    <div className="activity-section">
                        <h3>Latest Community Posts</h3>
                        {postsLoading ? (
                            <div className="loading-small">Loading posts...</div>
                        ) : postsData?.posts?.length > 0 ? (
                            <div className="posts-list">
                                {postsData.posts.slice(0, 3).map((post) => (
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
                        ) : (
                            <div className="empty-state">
                                <p>No posts yet. Be the first to share something with your community!</p>
                            </div>
                        )}
                    </div>

                    {/* Help Requests */}
                    <div className="activity-section">
                        <h3>Help Requests Needing Volunteers</h3>
                        {helpLoading ? (
                            <div className="loading-small">Loading help requests...</div>
                        ) : helpData?.helpRequests?.length > 0 ? (
                            <div className="help-list">
                                {helpData.helpRequests.slice(0, 3).map((help) => (
                                    <div key={help._id} className="help-card">
                                        <div className="help-header">
                                            <span className="help-author">By {help.author.username}</span>
                                            <span className="help-date">{formatDate(help.createdAt)}</span>
                                        </div>
                                        <h4 className="help-title">Help Needed</h4>
                                        <p className="help-description">{help.description}</p>
                                        {help.location && (
                                            <div className="help-location">
                                                <span className="location-icon">📍</span>
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
                        ) : (
                            <div className="empty-state">
                                <p>No active help requests. Your community is doing great!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Community Highlights */}
            <div className="community-highlights">
                <h2>Community Highlights</h2>
                <div className="highlights-grid">
                    <div className="highlight-card">
                        <div className="highlight-icon">🏆</div>
                        <h3>Top Contributors</h3>
                        <p>Recognizing our most active community members</p>
                        <button className="highlight-btn">View Leaderboard</button>
                    </div>
                    <div className="highlight-card">
                        <div className="highlight-icon">📅</div>
                        <h3>Upcoming Events</h3>
                        <p>Community gatherings and important dates</p>
                        <button className="highlight-btn">See Calendar</button>
                    </div>
                    <div className="highlight-card">
                        <div className="highlight-icon">✅</div>
                        <h3>Success Stories</h3>
                        <p>Inspiring stories of community support</p>
                        <button className="highlight-btn">Read Stories</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
