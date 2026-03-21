import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POST_QUERY } from '../../graphQL/operations.js';
import { communityApolloClient } from '../../services/apolloClient.js';
import "../../styles/home.css";

export default function communityDetailPage() {
    const navigate = useNavigate();
    const { postId } = useParams();
    
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : {
            _id: '1',
            username: 'wario',
            email: 'wario@thegreat.wario',
            role: 'resident'
        };
    });

    const { loading, error, data } = useQuery(GET_POST_QUERY, {
        variables: { _id: postId },
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

    const handleBackToNews = () => {
        navigate("/news");
    };

    const post = data?.post;
    
    if (loading) {
        return (
            <div className="news-container">
                <div className="news-header">
                    <button className="back-btn" onClick={handleBackToNews}>
                        Back to News
                    </button>
                    <h1>News</h1>
                </div>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading post...</span>
                </div>
            </div>
        );
    }

    if (error) {
        console.error('CommunityDetail Error:', {
            message: error.message,
            networkError: error.networkError,
            graphQLErrors: error.graphQLErrors,
            timestamp: new Date().toISOString(),
            component: 'CommunityDetail',
            action: 'GET_POST_QUERY',
            variables: { _id: postId }
        });
        
        return (
            <div className="news-container">
                <div className="news-header">
                    <button className="back-btn" onClick={handleBackToNews}>
                        Back to News
                    </button>
                    <h1>News</h1>
                </div>
                <div className="error-message">
                    <h2>Error Loading Post</h2>
                    <p>There was an error loading this post. Please try again.</p>
                    <button onClick={handleBackToNews} className="primary-btn">
                        Back to News
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="news-container">
                <div className="news-header">
                    <button className="back-btn" onClick={handleBackToNews}>
                        Back to News
                    </button>
                    <h1>News</h1>
                </div>
                <div className="error-message">
                    <h2>Post Not Found</h2>
                    <p>The news post you are looking for does not exist.</p>
                    <button onClick={handleBackToNews} className="primary-btn">
                        Back to News
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="news-container">
            <div className="news-header">
                <button className="back-btn" onClick={handleBackToNews}>
                    Back to News
                </button>
                <h1>News</h1>
            </div>

            <div className="post-detail">
                <div className="post-detail-header">
                    <span className={`category-badge ${post.category}`}>
                        {post.category.toUpperCase()}
                    </span>
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>

                <h1 className="post-detail-title">{post.title}</h1>
                
                <div className="post-detail-meta">
                    <span className="post-author">By {post.author.username}</span>
                </div>
                
                <div className="post-content">
                    <p>{post.content}</p>
                </div>
                
                {post.aiSummary && (
                    <div className="post-summary-box">
                        <h3>Summary</h3>
                        <p>{post.aiSummary}</p>
                    </div>
                )}
            </div>
        </div>
    );
}