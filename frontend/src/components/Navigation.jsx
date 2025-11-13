import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-logo">📝</span>
          <span className="nav-title">Post Manager</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              <span className="nav-icon">🏠</span>
              <span>All Posts</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/create" 
              className={location.pathname === '/create' ? 'active' : ''}
            >
              <span className="nav-icon">➕</span>
              <span>Create Post</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
