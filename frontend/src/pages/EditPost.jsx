import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost } from '../services/api';
import PostForm from '../components/PostForm';

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPost(id);
      setPost(data);
    } catch (err) {
      setError('Failed to load post. Post may not exist.');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError('');
      await updatePost(id, formData);
      navigate('/', { state: { message: 'Post updated successfully!' } });
    } catch (err) {
      setError('Failed to update post. Please try again.');
      console.error('Error updating post:', err);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="container">
        <div className="message message-error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit Post</h1>
      </div>

      {error && (
        <div className="message message-error">{error}</div>
      )}

      <PostForm
        post={post}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
}

export default EditPost;
