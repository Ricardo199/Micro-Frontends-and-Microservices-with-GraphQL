import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_POSTS_QUERY, GET_POST_QUERY, CREATE_POST_MUTATION } from '../../graphQL/operations.js';
import { communityApolloClient } from '../../services/apolloClient.js';
import "../../styles/home.css";

export default function NewsPage() {
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

    const { loading, error, data, refetch } = useQuery(GET_POSTS_QUERY, {
        client: communityApolloClient
    });

    const { loading: postLoading, error: postError, data: postData } = useQuery(GET_POST_QUERY, {
        variables: { _id: postId },
        client: communityApolloClient,
        skip: !postId
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCreatePost = () => {
        navigate("/create-post");
    };

    const handleViewPost = (postId) => {
        navigate(`/news/${postId}`);
    };

    const handleBackToNews = () => {
        navigate("/news");
    };

    const handleHome = () => {
        navigate("/home");
    };

    // View Specific Post
    if (postId) {

        if (postLoading) {
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


        const post = postData?.post;

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

    // Main Feed
    if (loading) {
        return (
            <div className="news-container">
                <div className="news-header">
                    <h1>Community News</h1>
                    <p>Stay informed about what's happening in our neighborhood</p>
                </div>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading post...</span>
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
                <h1>Community News</h1>
                <p>Stay informed about what's happening in our neighborhood</p>
            </div>

            {(user.role === 'community_organizer' || user.role === 'business_owner') && (
                <div className="news-actions">
                    <button className="create-post-btn" onClick={handleCreatePost}>
                        Create News Post
                    </button>
                </div>
            )}

            <div className="news-grid">
                {data?.posts?.length > 0 ? (
                    data.posts.map((post) => (
                        <div key={post._id} className="news-card" onClick={() => handleViewPost(post._id)}>
                            <div className="news-card-header">
                                <span className={`category-badge ${post.category}`}>
                                    {post.category.toUpperCase()}
                                </span>
                                <span className="news-date">{formatDate(post.createdAt)}</span>
                            </div>
                            <h3 className="news-title">{post.title}</h3>
                            <p className="news-author">By {post.author.username}</p>
                            {post.aiSummary && (
                                <p className="news-summary">{post.aiSummary}</p>
                            )}
                            <div className="news-actions">
                                <button className="read-more-btn">Read More</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No News Found</h3>
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