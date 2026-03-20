import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/home.css";

export default function HelpPage() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/news');
    };

    return (
        <div className="news-container">
            <div className="news-header">
                <button className="back-btn" onClick={handleBack}>
                    Back to News
                </button>
                <h1>Help & Support</h1>
            </div>

            <div className="help-content">
                <div className="help-section">
                    <h2>How to Get Help</h2>
                    <p>If you need assistance from your community, you can:</p>
                    <ul>
                        <li>Create a help request to ask for specific assistance</li>
                        <li>Post in community discussions for general questions</li>
                        <li>Contact community organizers for event-related help</li>
                    </ul>
                </div>

                <div className="help-actions">
                    <button className="primary-btn" onClick={() => navigate('/create-help')}>
                        Create Help Request
                    </button>
                    <button className="secondary-btn" onClick={() => navigate('/news')}>
                        View Community Posts
                    </button>
                </div>
            </div>
        </div>
    );
}
