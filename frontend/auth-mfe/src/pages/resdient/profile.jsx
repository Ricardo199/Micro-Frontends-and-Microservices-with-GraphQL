import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/home.css";

export default function Profile() {
    const navigate = useNavigate();
    
    // Get user data from localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : {
            _id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'resident'
        };
    });

    // Sample activity data
    const [userActivity] = useState({
        postsCreated: [
            {
                _id: '1',
                title: 'Community Garden Opening This Weekend',
                category: 'news',
                createdAt: '2024-01-15T10:30:00Z',
                likes: 12
            },
            {
                _id: '2', 
                title: 'Discussion: Neighborhood Safety',
                category: 'discussion',
                createdAt: '2024-01-14T15:45:00Z',
                likes: 8
            }
        ],
        helpRequests: [
            {
                _id: '1',
                description: 'Need help shoveling snow from driveway',
                location: '123 Maple Street',
                isResolved: true,
                createdAt: '2024-01-15T08:00:00Z'
            }
        ],
        volunteerActivities: [
            {
                _id: '1',
                description: 'Helped organize community food drive',
                createdAt: '2024-01-10T14:00:00Z'
            },
            {
                _id: '2',
                description: 'Volunteered at neighborhood cleanup',
                createdAt: '2024-01-08T10:00:00Z'
            }
        ]
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    const handleEditProfile = () => {
        navigate("/account-settings");
    };

    if (!user) {
        return (
            <div className="profile-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Profile Header */}
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

            {/* Profile Actions */}
            <div className="profile-actions">
                <button className="action-btn primary" onClick={handleEditProfile}>
                    Edit Profile
                </button>
                <button className="action-btn secondary" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Profile Stats */}
            <div className="profile-stats">
                <div className="stat-card">
                    <span className="stat-number">{userActivity.postsCreated.length}</span>
                    <span className="stat-label">Posts Created</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{userActivity.helpRequests.length}</span>
                    <span className="stat-label">Help Requests</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{userActivity.volunteerActivities.length}</span>
                    <span className="stat-label">Volunteer Hours</span>
                </div>
            </div>

            {/* Activity Sections */}
            <div className="activity-sections">
                {/* Posts Created */}
                <div className="activity-section">
                    <h3>Recent Posts</h3>
                    {userActivity.postsCreated.length > 0 ? (
                        <div className="activity-list">
                            {userActivity.postsCreated.map((post) => (
                                <div key={post._id} className="activity-item">
                                    <div className="activity-header">
                                        <span className={`category-badge ${post.category}`}>
                                            {post.category.toUpperCase()}
                                        </span>
                                        <span className="activity-date">{formatDate(post.createdAt)}</span>
                                    </div>
                                    <h4 className="activity-title">{post.title}</h4>
                                    <div className="activity-meta">
                                        <span className="likes-count">👍 {post.likes} likes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No posts yet. Start sharing with your community!</p>
                        </div>
                    )}
                </div>

                {/* Help Requests */}
                <div className="activity-section">
                    <h3>Help Requests</h3>
                    {userActivity.helpRequests.length > 0 ? (
                        <div className="activity-list">
                            {userActivity.helpRequests.map((help) => (
                                <div key={help._id} className="activity-item">
                                    <div className="activity-header">
                                        <span className="help-status">
                                            {help.isResolved ? '✅ Resolved' : '⏳ Pending'}
                                        </span>
                                        <span className="activity-date">{formatDate(help.createdAt)}</span>
                                    </div>
                                    <h4 className="activity-title">Help Needed</h4>
                                    <p className="activity-description">{help.description}</p>
                                    {help.location && (
                                        <div className="activity-meta">
                                            <span className="location-icon">📍 {help.location}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No help requests yet.</p>
                        </div>
                    )}
                </div>

                {/* Volunteer Activities */}
                <div className="activity-section">
                    <h3>Volunteer Activities</h3>
                    {userActivity.volunteerActivities.length > 0 ? (
                        <div className="activity-list">
                            {userActivity.volunteerActivities.map((activity) => (
                                <div key={activity._id} className="activity-item">
                                    <div className="activity-header">
                                        <span className="activity-date">{formatDate(activity.createdAt)}</span>
                                    </div>
                                    <h4 className="activity-title">Volunteer</h4>
                                    <p className="activity-description">{activity.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No volunteer activities yet. Consider helping your neighbors!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}