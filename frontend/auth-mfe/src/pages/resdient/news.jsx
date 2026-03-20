import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../../styles/home.css";

export default function News() {
    const navigate = useNavigate();
    const { postId } = useParams();
    
    // Get user data from localStorage
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : {
            _id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'resident'
        };
    });

    // Sample news data
    const [newsPosts] = useState([
        {
            _id: '1',
            title: 'Community Garden Opening This Weekend',
            content: 'We are excited to announce that the new community garden will be officially opening this Saturday at 10 AM. The garden is located at the corner of Maple and Oak streets and will feature raised beds for vegetables, flowers, and herbs. All community members are welcome to attend the opening ceremony and learn about how to get involved in maintaining the garden. There will be refreshments, gardening demonstrations, and opportunities to sign up for plot assignments. This project has been made possible through the efforts of the Neighborhood Improvement Committee and generous donations from local businesses.',
            category: 'news',
            author: { username: 'community_organizer' },
            createdAt: '2024-01-15T10:30:00Z',
            aiSummary: 'Local community garden opening event this weekend with gardening demonstrations and plot assignments'
        },
        {
            _id: '2',
            title: 'Monthly Neighborhood Meeting - January 20th',
            content: 'The monthly neighborhood association meeting will be held on January 20th at 7 PM in the community center. All residents are encouraged to attend as we will be discussing upcoming community events, safety concerns, and the annual budget. This month\'s meeting will also feature a presentation from the local police department about recent crime prevention initiatives in our area. Light refreshments will be provided. Please bring any questions or concerns you may have about our neighborhood.',
            category: 'announcement',
            author: { username: 'neighborhood_president' },
            createdAt: '2024-01-14T15:45:00Z',
            aiSummary: 'Monthly neighborhood meeting with police department presentation on crime prevention'
        },
        {
            _id: '3',
            title: 'Local Business Spotlight: Main Street Cafe',
            content: 'This month we are highlighting Main Street Cafe, a family-owned business that has been serving our community for over 15 years. Known for their delicious breakfast menu and excellent coffee, the cafe has recently expanded their hours and added outdoor seating. They are also offering special discounts for residents - just show your ID when you visit. Stop by to support this local business and enjoy their famous blueberry pancakes!',
            category: 'business',
            author: { username: 'business_owner' },
            createdAt: '2024-01-13T09:20:00Z',
            aiSummary: 'Local cafe expansion with new outdoor seating and resident discounts'
        },
        {
            _id: '4',
            title: 'Spring Cleanup Day - March 15th',
            content: 'Join us for our annual spring cleanup day on Saturday, March 15th. We will be meeting at the park at 9 AM to clean up litter, plant flowers, and prepare our community spaces for the warmer months. All supplies will be provided, and we will have a picnic lunch for volunteers. This is a great opportunity to meet your neighbors and help make our community beautiful. Families are welcome, and there will be activities for children as well.',
            category: 'event',
            author: { username: 'community_organizer' },
            createdAt: '2024-01-12T14:30:00Z',
            aiSummary: 'Annual community cleanup event with family activities and picnic lunch'
        },
        {
            _id: '5',
            title: 'New Playground Equipment Installation',
            content: 'Good news for families with young children! The new playground equipment for Riverside Park has arrived and will be installed next week. The installation is scheduled to begin on Tuesday and should be completed by Friday. During this time, the playground will be closed for safety reasons. We apologize for any inconvenience and appreciate your patience. The new equipment includes a larger climbing structure, additional swings, and improved safety surfacing.',
            category: 'news',
            author: { username: 'city_official' },
            createdAt: '2024-01-11T08:15:00Z',
            aiSummary: 'New playground equipment arriving with installation scheduled for next week'
        }
    ]);

    // State for filtering and search
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter posts based on category and search
    const filteredPosts = newsPosts.filter(post => {
        const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
        const searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.aiSummary.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
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

    // Viewing specific post
    if (postId) {
        const post = newsPosts.find(p => p._id === postId);
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
                    
                    <button className={`filter-btn ${selectedCategory === 'announcement' ? 'active' : ''}`} onClick={() => setSelectedCategory('announcement')} >
                        Announcements
                    </button>

                    <button className={`filter-btn ${selectedCategory === 'event' ? 'active' : ''}`} onClick={() => setSelectedCategory('event')} > 
                        Events
                    </button>

                    <button className={`filter-btn ${selectedCategory === 'business' ? 'active' : ''}`} onClick={() => setSelectedCategory('business')} >
                        Business
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
                        <p>
                            {searchTerm ? 
                                `No posts found matching "${searchTerm}". Try adjusting your search terms.` :
                                `No posts in the ${selectedCategory} category. Try selecting a different category.`
                            }
                        </p>
                        {(searchTerm || selectedCategory !== 'all') && (
                            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="clear-filters-btn">
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}