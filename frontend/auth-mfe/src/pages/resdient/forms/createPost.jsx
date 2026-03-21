import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_POST_MUTATION } from '../../../graphQL/operations';
import { communityApolloClient } from '../../../services/apolloClient.js';
import "../../../styles/home.css";

export default function CreatePost() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'news'
    });
    
    const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
        client: communityApolloClient,
        onCompleted: (data) => {
            console.log('CreatePost Success:', data);
            setTimeout(() => {
                navigate('/news');
            }, 2000);
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

        if (!formData.title.trim() || !formData.content.trim()) {
            return;
        }

        await createPost({
            variables: {
                title: formData.title,
                content: formData.content,
                category: formData.category
            }
        });

        navigate('/news');
    };

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <div className="news-container">
            <div className="news-header">
                <button className="back-btn" onClick={handleBack}>
                    Back to Home
                </button>
                <h1>Create News Post</h1>
            </div>

            <div className="create-post-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter post title" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} >
                            <option value="news">News</option>
                            <option value="discussion">Discussion</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content *</label>
                        <textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="Enter post content" rows="8" required />
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
