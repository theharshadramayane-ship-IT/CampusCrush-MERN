import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: '💘 Discover' },
    { path: '/events', label: '🎉 Events' },
    { path: '/leaderboard', label: '🏆 Leaderboard' },
    { path: '/profile', label: '👤 Profile' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          ✨ <span style={{ color: '#ff2d75' }}>Campus</span>Crush
        </Link>
        <div style={styles.links}>
          {navItems.map(item => (
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
          {/* Staff Login Button */}
          <Link to="/staff-login" style={styles.staffBtn}>🛡️ Staff Login</Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: '#1e1a2fcc', backdropFilter: 'blur(10px)', borderBottom: '1px solid #3a2e4d', position: 'fixed', width: '100%', top: 0, zIndex: 1000 },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '1.3rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#e0d4ff', fontSize: '0.95rem' },
  active: { color: '#ff2d75', fontWeight: 'bold' },
  staffBtn: { background: 'transparent', border: '1px solid #ffb300', color: '#ffb300', padding: '8px 15px', borderRadius: '20px', textDecoration: 'none', fontSize: '0.9rem' }
};

export default Navbar;