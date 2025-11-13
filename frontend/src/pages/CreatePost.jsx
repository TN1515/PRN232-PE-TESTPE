import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import PostForm from '../components/PostForm';

function CreatePost() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setError('');
      await createPost(formData);
      navigate('/', { state: { message: 'Post created successfully!' } });
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Create New Post</h1>
      </div>

      {error && (
        <div className="message message-error">{error}</div>
      )}

      <PostForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
}

export default CreatePost;
