import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span>CentralConnect</span>
          <small>City support services</small>
        </Link>

        <nav className="nav-group">
          <NavLink to="/tours" className={navLinkClass}>Tour Guide</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/transfers" className={navLinkClass}>Transfers</NavLink>
              <NavLink to="/legal" className={navLinkClass}>Legal</NavLink>
              <NavLink to="/applications" className={navLinkClass}>Applications</NavLink>
              <NavLink to="/community" className={navLinkClass}>Community</NavLink>
            </>
          ) : null}
        </nav>

        <div className="nav-cta">
          {user ? (
            <>
              <div className="user-pill">
                <strong>{user.fullName}</strong>
                <span>{user.role === 'admin' ? 'Admin' : 'Member'}</span>
              </div>
              <button onClick={onLogout} className="ghost-btn">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              <Link to="/register" className="primary-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
