import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/home.css";

export default function Home() {
    const navigate = useNavigate();
    
    // Sample user data
    const [user] = useState({
        _id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'resident'
    });

    // Sample post data
    const [posts] = useState([
        {
            _id: '1',
            title: 'Community Garden Opening This Weekend',
            content: 'The new community garden will be opening this Saturday at 10 AM. Everyone is welcome to attend!',
            category: 'news',
            aiSummary: 'Local community garden opening event this weekend',
            createdAt: '2024-01-15T10:30:00Z',
            author: { username: 'community_organizer' }
        },
        {
            _id: '2',
            title: 'Discussion: Neighborhood Safety',
            content: 'Let\'s discuss ways to improve safety in our neighborhood. What ideas do you have?',
            category: 'discussion',
            aiSummary: 'Community discussion about neighborhood safety improvements',
            createdAt: '2024-01-14T15:45:00Z',
            author: { username: 'neighbor_jane' }
        },
        {
            _id: '3',
            title: 'Local Business Spotlight: Main Street Cafe',
            content: 'Check out the new menu items at Main Street Cafe! They\'re offering special discounts for residents.',
            category: 'news',
            aiSummary: 'Local cafe introduces new menu with resident discounts',
            createdAt: '2024-01-13T09:20:00Z',
            author: { username: 'business_owner' }
        }
    ]);

    // Sample help request data
    const [helpRequests] = useState([
        {
            _id: '1',
            description: 'Need help shoveling snow from driveway',
            location: '123 Maple Street',
            isResolved: false,
            createdAt: '2024-01-15T08:00:00Z',
            author: { username: 'elderly_resident' },
            volunteers: [{ username: 'helpful_neighbor' }]
        },
        {
            _id: '2',
            description: 'Looking for volunteers to help at food bank this Saturday',
            location: 'Community Center',
            isResolved: false,
            createdAt: '2024-01-14T12:00:00Z',
            author: { username: 'community_organizer' },
            volunteers: []
        }
    ]);

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

            {/* Quick Actions */}
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
                        <h3>View Community</h3>
                        <p>Explore posts and discussions</p>
                    </button>

                    <button className="action-card" onClick={handleViewProfile}>
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

                    {/* Help Requests */}
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
                    </div>
                </div>
            </div>

            {/* Community Highlights */}
            <div className="community-highlights">
                <h2>Community Highlights</h2>
                <div className="highlights-grid">
                    <div className="highlight-card">
                        <h3>Top Contributors</h3>
                        <p>Recognizing our most active community members</p>
                        <button className="highlight-btn">View Leaderboard</button>
                    </div>

                    <div className="highlight-card">
                        <h3>Upcoming Events</h3>
                        <p>Community gatherings and important dates</p>
                        <button className="highlight-btn">See Calendar</button>
                    </div>
                    
                    <div className="highlight-card">
                        <h3>Success Stories</h3>
                        <p>Inspiring stories of community support</p>
                        <button className="highlight-btn">Read Stories</button>
                    </div>
                </div>
            </div>
        </div>
    );
}