import axios from 'axios';

// Base API URL - Change this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for large base64 images
  maxContentLength: 52428800, // 50MB
  maxBodyLength: 52428800, // 50MB
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Get all posts
 * @returns {Promise<Array>} Array of posts
 */
export const getPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Get a single post by ID
 * @param {string} id - Post ID
 * @returns {Promise<Object>} Post object
 */
export const getPost = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new post
 * @param {Object} postData - Post data (name, description, image)
 * @returns {Promise<Object>} Created post object
 */
export const createPost = async (postData) => {
  try {
    console.log('Creating post with data:', {
      name: postData.name,
      description: postData.description?.substring(0, 50) + '...',
      imageLength: postData.image?.length || 0,
      isBase64: postData.image?.startsWith('data:')
    });
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

/**
 * Update an existing post
 * @param {string} id - Post ID
 * @param {Object} postData - Updated post data (name, description, image)
 * @returns {Promise<Object>} Updated post object
 */
export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a post
 * @param {string} id - Post ID
 * @returns {Promise<void>}
 */
export const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`);
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

export default api;
