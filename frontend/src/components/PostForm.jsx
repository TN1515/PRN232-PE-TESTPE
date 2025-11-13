import { useState, useEffect } from 'react';

function PostForm({ post, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'

  useEffect(() => {
    if (post) {
      setFormData({
        name: post.name || '',
        description: post.description || '',
        image: post.image || ''
      });
      setImagePreview(post.image || '');
    }
  }, [post]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    // Only validate URL length if it's not a base64 image (uploaded file)
    if (formData.image && !formData.image.startsWith('data:') && formData.image.length > 500) {
      newErrors.image = 'Image URL cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update image preview when image URL changes
    if (name === 'image') {
      setImagePreview(value);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      console.log('Base64 length:', base64String.length);
      setImagePreview(base64String);
      setFormData(prev => ({
        ...prev,
        image: base64String
      }));
      setErrors(prev => ({ ...prev, image: '' }));
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to read file' }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
    // Reset file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleMethodChange = (method) => {
    setUploadMethod(method);
    clearImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Submitting form data:', {
      name: formData.name,
      description: formData.description,
      imageLength: formData.image.length,
      imageType: formData.image.startsWith('data:') ? 'base64' : 'url'
    });

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-row">
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="name">
              <span className="label-icon">📝</span>
              Post Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter an eye-catching title..."
              disabled={isSubmitting}
              className="form-input"
            />
            {errors.name && <div className="error">{errors.name}</div>}
            <div className="char-count">{formData.name.length}/200</div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <span className="label-icon">📄</span>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us more about your post..."
              disabled={isSubmitting}
              className="form-textarea"
              rows="8"
            />
            {errors.description && <div className="error">{errors.description}</div>}
            <div className="char-count">{formData.description.length}/1000</div>
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>
              <span className="label-icon">🖼️</span>
              Post Image
            </label>
            
            <div className="upload-method-selector">
              <button
                type="button"
                className={`method-btn ${uploadMethod === 'url' ? 'active' : ''}`}
                onClick={() => handleMethodChange('url')}
                disabled={isSubmitting}
              >
                🔗 Image URL
              </button>
              <button
                type="button"
                className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
                onClick={() => handleMethodChange('file')}
                disabled={isSubmitting}
              >
                📁 Upload File
              </button>
            </div>

            <div className="image-upload-section">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="btn-clear-image"
                    onClick={clearImage}
                    disabled={isSubmitting}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📸</span>
                  <p>No image selected</p>
                  <span className="upload-hint">
                    {uploadMethod === 'url' ? 'Enter an image URL below' : 'Click to upload an image'}
                  </span>
                </div>
              )}

              {uploadMethod === 'file' ? (
                <div className="upload-options">
                  <label htmlFor="file-upload" className="btn btn-upload">
                    📁 Choose Image File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isSubmitting}
                    style={{ display: 'none' }}
                  />
                  <div className="help-text">Max size: 5MB • Formats: JPG, PNG, GIF</div>
                </div>
              ) : (
                <div className="upload-options">
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                    className="form-input"
                  />
                  <div className="help-text">Enter a valid image URL</div>
                </div>
              )}
              
              {errors.image && <div className="error">{errors.image}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          ← Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-success"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>⏳ Saving...</>
          ) : (
            <>{isEdit ? '✓ Update Post' : '✓ Create Post'}</>
          )}
        </button>
      </div>
    </form>
  );
}

export default PostForm;
