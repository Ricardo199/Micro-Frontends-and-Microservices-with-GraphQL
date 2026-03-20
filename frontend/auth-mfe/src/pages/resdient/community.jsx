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
            username: 'john_doe',
            email: 'john@example.com',
            role: 'resident'
        };
    });

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const { loading, error, data, refetch } = useQuery(GET_POSTS_QUERY, {
        variables: { category: selectedCategory === 'all' ? undefined : selectedCategory },
        client: communityApolloClient
    });

    const filteredPosts = data?.posts?.filter(post => {
        const searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.aiSummary && post.aiSummary.toLowerCase().includes(searchTerm.toLowerCase()));
        return searchMatch;
    }) || [];

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
        const { loading: postLoading, error: postError, data: postData } = useQuery(GET_POST_QUERY, {
            variables: { _id: postId },
            client: communityApolloClient,
            skip: !postId
        });

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

        if (postError) {
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

        const post = postData?.post;
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

    if (error) {
        console.error('NewsPage Error:', {
            message: error.message,
            networkError: error.networkError,
            graphQLErrors: error.graphQLErrors,
            timestamp: new Date().toISOString(),
            component: 'NewsPage',
            action: 'GET_POSTS_QUERY',
            variables: { category: selectedCategory === 'all' ? undefined : selectedCategory }
        });
        
        return (
            <div className="news-container">
                <div className="news-header">
                    <h1>Community News</h1>
                    <p>Stay informed about what's happening in our neighborhood</p>
                </div>
                <div className="error-message">
                    <h2>Error Loading News</h2>
                    <p>There was an error loading the news posts. Please try again.</p>
                    <p className="error-details">Error: {error.message}</p>
                    <button onClick={() => refetch()} className="primary-btn">
                        Retry
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

            <div className="news-controls">
                <div className="search-box">
                    <input type="text" placeholder="Search news posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                </div>

                <div className="category-filters">
                    <button  className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')} >
                        All Categories
                    </button>
                    
                    <button className={`filter-btn ${selectedCategory === 'news' ? 'active' : ''}`} onClick={() => setSelectedCategory('news')} >
                        News
                    </button>
                    
                    <button className={`filter-btn ${selectedCategory === 'discussion' ? 'active' : ''}`} onClick={() => setSelectedCategory('discussion')} >
                        Discussion
                    </button>
                </div>
            </div>

            <div className="results-info">
                <p>
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                    {searchTerm && ` for "${searchTerm}"`}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </p>
            </div>

            <div className="news-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
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
                        {(searchTerm || selectedCategory !== 'all') && (
                            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="clear-filters-btn">
                                Clear Filters
                            </button>
                        )}
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