import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_HELP_REQUESTS_QUERY, GET_HELP_REQUEST_QUERY, CREATE_HELP_REQUEST_MUTATION } from '../../graphQL/operations.js';
import { communityApolloClient } from '../../services/apolloClient.js';
import "../../styles/home.css";

export default function HelpPage() {
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

    const { loading, error, data, refetch } = useQuery(GET_HELP_REQUESTS_QUERY, {
        client: communityApolloClient
    });

    const { loading: helpLoading, error: helpError, data: helpData } = useQuery(GET_HELP_REQUEST_QUERY, {
        variables: { _id: helpId },
        client: communityApolloClient,
        skip: !helpId
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleViewHelpRequest = (helpId) => {
        navigate(`/help/${helpId}`);
    };

    const handleBackToHelp = () => {
        navigate("/help");
    };

    const handleHome = () => {
        navigate("/home");
    };

    if (helpId) {
        const helpRequest = helpData?.helpRequest;

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

    if (loading) {
        return (
            <div className="news-container">
                <div className="news-header">
                    <h1>Community Help</h1>
                    <p>Find and offer help to your neighbors</p>
                </div>

                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading help requests...</span>
                </div>

                <div className="news-actions">
                    <button className="secondary-btn" onClick={handleHome}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="news-container">
            <div className="news-header">
                <h1>Community Help</h1>
                <p>Find and offer help to your neighbors</p>
            </div>

            <div className="news-grid">
                {data?.helpRequests?.length > 0 ? (
                    data.helpRequests.map((helpRequest) => (
                        <div key={helpRequest._id} className="news-card" onClick={() => handleViewHelpRequest(helpRequest._id)}>
                            <div className="news-card-header">
                                <span className={`category-badge ${helpRequest.isResolved ? 'resolved' : 'pending'}`}>
                                    {helpRequest.isResolved ? 'RESOLVED' : 'PENDING'}
                                </span>
                                <span className="news-date">{formatDate(helpRequest.createdAt)}</span>
                            </div>

                            <h3 className="news-title">Help Request</h3>
                            <p className="news-author">By {helpRequest.author.username}</p>
                            
                            {helpRequest.location && (
                                <p className="news-location"> {helpRequest.location}</p>
                            )}
                            <p className="news-summary">{helpRequest.description}</p>
                            
                            <div className="news-actions">
                                <button className="read-more-btn">View Details</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No Help Requests Found</h3>
                    </div>
                )}
            </div>
            <div className="news-actions">
                <button className="secondary-btn" onClick={handleHome}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}