import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_HELP_REQUEST_MUTATION } from '../../../graphQL/operations';
import { communityApolloClient } from '../../../services/apolloClient.js';
import "../../../styles/home.css";

export default function CreateHelp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        location: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [createHelpRequest, { loading }] = useMutation(CREATE_HELP_REQUEST_MUTATION, {
        client: communityApolloClient,
        onCompleted: (data) => {
            setSuccess('Help request created successfully!');
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

        if (!formData.description.trim()) {
            setError('Please enter a description.');
            return;
        }

        try {
            await createHelpRequest({
                variables: {
                    description: formData.description,
                    location: formData.location || null
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
                <h1>Create Help Request</h1>
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
                        <label htmlFor="description">Description *</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe what help you need" rows="8" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location)" />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleBack} className="secondary-btn">
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Help Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
