import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Home' },
    { path: '/discover', label: '💘 Discover' },
    { path: '/matches', label: '💬 Matches' },
    { path: '/events', label: '🎉 Events' },
    { path: '/profile', label: '👤 Profile' },
    { path: '/safety', label: '🛡️ Safety' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          ✨ <span style={{ color: '#ff2d75' }}>Campus</span>Crush
        </Link>
        <div style={styles.links}>
          {user && navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                ...(location.pathname === item.path ? styles.active : {})
              }}
            >
              {item.label}
            </Link>
          ))}
          {!user ? (
            <>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Signup</Link>
            </>
          ) : (
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: '#1e1a2fcc', backdropFilter: 'blur(10px)', borderBottom: '1px solid #3a2e4d', position: 'fixed', width: '100%', top: 0, zIndex: 1000 },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  logo: { fontSize: '1.3rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' },
  links: { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' },
  link: { textDecoration: 'none', color: '#e0d4ff', fontSize: '0.95rem' },
  active: { color: '#ff2d75', fontWeight: 'bold' },
  loginBtn: { background: 'transparent', border: '1px solid #ff2d75', padding: '8px 20px', borderRadius: '25px', color: '#ff6b9d', textDecoration: 'none' },
  signupBtn: { background: '#ff2d75', padding: '8px 20px', borderRadius: '25px', color: 'white', textDecoration: 'none' },
  logoutBtn: { background: 'transparent', border: '1px solid #ff2d75', padding: '8px 20px', borderRadius: '25px', color: '#ff6b9d', cursor: 'pointer' },
};

export default Navbar;