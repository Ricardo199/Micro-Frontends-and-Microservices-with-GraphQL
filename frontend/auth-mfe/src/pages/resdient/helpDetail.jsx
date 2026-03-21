import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_HELP_REQUEST_QUERY } from '../../graphQL/operations.js';
import { communityApolloClient } from '../../services/apolloClient.js';
import "../../styles/home.css";

export default function HelpDetailPage() {
    const navigate = useNavigate();
    const { helpId } = useParams();
    
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : {
            _id: '1',
            username: 'wario',
            email: 'wario@thegreat.wario',
            role: 'resident'
        };
    });

    const { loading, error, data } = useQuery(GET_HELP_REQUEST_QUERY, {
        variables: { _id: helpId },
        client: communityApolloClient
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleBackToHelp = () => {
        navigate("/help");
    };

    if (loading) {
        return (
            <div className="news-container">
                <div className="news-header">
                    <button className="back-btn" onClick={handleBackToHelp}>
                        Back to Help Requests
                    </button>
                    <h1>Help Requests</h1>
                </div>
                
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading help request...</span>
                </div>
            </div>
        );
    }

    const helpRequest = data.helpRequest;
    return (
        <div className="news-container">
            <div className="news-header">
                <button className="back-btn" onClick={handleBackToHelp}>
                    Back to Help Requests
                </button>
                <h1>Help Requests</h1>
            </div>

            <div className="post-detail">
                <div className="post-detail-header">
                    <span className={`category-badge ${helpRequest.isResolved ? 'resolved' : 'pending'}`}>
                        {helpRequest.isResolved ? 'RESOLVED' : 'PENDING'}
                    </span>
                    <span className="post-date">{formatDate(helpRequest.createdAt)}</span>
                </div>
                
                <h1 className="post-detail-title">Help Request</h1>
                
                <div className="post-detail-meta">
                    <span className="post-author">By {helpRequest.author.username}</span>
                    
                    {helpRequest.location && (
                        <span className="post-location">{helpRequest.location}</span>
                    )}
                </div>
                
                <div className="post-content">
                    <p>{helpRequest.description}</p>
                </div>
                
                {helpRequest.volunteers && helpRequest.volunteers.length > 0 && (
                    <div className="volunteers-section">
                        <h3>Volunteers</h3>

                        <div className="volunteers-list">
                            {helpRequest.volunteers.map((volunteer, index) => (
                                <span key={index} className="volunteer-tag">
                                    {volunteer.username}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}