function DeleteConfirmation({ post, onConfirm, onCancel }) {
  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete the post <strong>"{post.name}"</strong>?</p>
        <p>This action cannot be undone.</p>
        <div className="modal-buttons">
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
