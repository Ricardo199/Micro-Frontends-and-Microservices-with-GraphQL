import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_POST_MUTATION } from '../../../graphQL/operations';
import "../../../styles/home.css";

export default function CreatePost() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'news'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
        onCompleted: (data) => {
            setSuccess('Post created successfully!');
            setTimeout(() => {
                navigate('/news');
            }, 2000);
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            await createPost({
                variables: {
                    title: formData.title,
                    content: formData.content,
                    category: formData.category
                }
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBack = () => {
        navigate('/news');
    };

    return (
        <div className="news-container">
            <div className="news-header">
                <button className="back-btn" onClick={handleBack}>
                    Back to News
                </button>
                <h1>Create News Post</h1>
            </div>

            <div className="create-post-form">
                {error && (
                    <div className="message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="message success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter post title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="news">News</option>
                            <option value="announcement">Announcement</option>
                            <option value="event">Event</option>
                            <option value="business">Business</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content *</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Enter post content"
                            rows="8"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleBack} className="secondary-btn">
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
