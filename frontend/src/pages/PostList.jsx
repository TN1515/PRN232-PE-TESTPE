import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, deletePost } from '../services/api';
import DeleteConfirmation from '../components/DeleteConfirmation';

function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [postToDelete, setPostToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter and sort posts whenever posts, searchTerm, or sortOrder changes
    let filtered = posts.filter(post =>
      post.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by name
    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, sortOrder]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete.id);
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      setSuccessMessage(`Post "${postToDelete.name}" deleted successfully`);
      setPostToDelete(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
      setPostToDelete(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>All Posts</h1>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          Create New Post
        </button>
      </div>

      {successMessage && (
        <div className="message message-success">{successMessage}</div>
      )}

      {error && (
        <div className="message message-error">{error}</div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" onClick={toggleSort}>
            Sort {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📋</div>
          <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem', margin: 0 }}>
            {searchTerm ? 'No posts found matching your search.' : 'No posts available. Create your first post!'}
          </p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-card-image">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.name}
                    className="post-card-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('no-image');
                    }}
                  />
                ) : (
                  <div className="post-card-no-image">
                    <span>🖼️</span>
                    <p>No Image</p>
                  </div>
                )}
              </div>
              <div className="post-card-content">
                <h3 className="post-card-title">{post.name}</h3>
                <p className="post-card-description">
                  {post.description.length > 150
                    ? `${post.description.substring(0, 150)}...`
                    : post.description}
                </p>
                <div className="post-card-footer">
                  <div className="post-card-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(post.id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setPostToDelete(post)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmation
        post={postToDelete}
        onConfirm={handleDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
}

export default PostList;
