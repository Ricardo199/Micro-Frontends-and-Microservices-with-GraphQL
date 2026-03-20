import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/home.css";

export default function AccountSettings() {
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

    // Form state
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        // Basic validation
        if (!formData.username.trim()) {
            setMessage('Username is required');
            setIsSaving(false);
            return;
        }

        if (!formData.email.trim()) {
            setMessage('Email is required');
            setIsSaving(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setMessage('Please enter a valid email address');
            setIsSaving(false);
            return;
        }

        // Update user data
        const updatedUser = {
            ...user,
            username: formData.username,
            email: formData.email
        };

        // Save to localStorage
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage('Profile updated successfully!');
        setIsSaving(false);

        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        if (!formData.currentPassword) {
            setMessage('Current password is required');
            setIsSaving(false);
            return;
        }

        if (!formData.newPassword) {
            setMessage('New password is required');
            setIsSaving(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('New passwords do not match');
            setIsSaving(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setIsSaving(false);
            return;
        }
        setMessage('Password change request submitted! (Mock implementation)');
        setIsSaving(false);

        // Clear form
        setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));

        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
    };

    const handleBackToProfile = () => {
        navigate("/profile");
    };

    if (!user) {
        return (
            <div className="account-settings-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading account settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="account-settings-container">
            <div className="settings-header">
                <button className="back-btn" onClick={handleBackToProfile}>
                    ← Back to Profile
                </button>
                <h1>Account Settings</h1>
                <p className="settings-subtitle">Manage your account information and preferences</p>
            </div>

            {message && (
                <div className={`message ${message.includes('successfully') || message.includes('submitted') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="settings-section">
                <h2>Profile Information</h2>
                <form onSubmit={handleSaveProfile} className="settings-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <div className="readonly-field">
                            <span className={`role-badge ${user.role}`}>
                                {user.role.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="field-hint">Role cannot be changed</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="settings-section">
                <h2>Change Password</h2>
                <form onSubmit={handleChangePassword} className="settings-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your current password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your new password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your new password"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={isSaving}>
                            {isSaving ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="settings-section danger-zone">
                <h2>Danger Zone</h2>
                <div className="danger-actions">
                    <div className="danger-action">
                        <h3>Delete Account</h3>
                        <p>This action cannot be undone. This will permanently delete your account and all your data.</p>
                        <button className="danger-btn" onClick={() => {
                            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                localStorage.removeItem("token");
                                localStorage.removeItem("refreshToken");
                                localStorage.removeItem("userInfo");
                                navigate("/login");
                            }
                        }}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}