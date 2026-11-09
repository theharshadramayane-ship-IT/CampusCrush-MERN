import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Find Your <span style={{ color: '#ff2d75' }}>Campus</span> Crush</h1>
        <p style={styles.subtitle}>The only dating app for college students. Verified email required.<br />Swipe, match, chat, and meet your special someone on campus!</p>
        
        {!user ? (
          <div style={styles.btnGroup}>
            <Link to="/signup" style={styles.primaryBtn}>✨ Get Started →</Link>
            <Link to="/login" style={styles.secondaryBtn}>🔐 Login</Link>
          </div>
        ) : (
          <Link to="/discover" style={styles.primaryBtn}>💘 Start Swiping →</Link>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { paddingTop: '120px', textAlign: 'center' },
  hero: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px' },
  subtitle: { fontSize: '1.1rem', color: '#b8a9e6', marginBottom: '40px', lineHeight: '1.6' },
  btnGroup: { display: 'flex', gap: '20px', justifyContent: 'center' },
  primaryBtn: { background: '#ff2d75', padding: '12px 32px', borderRadius: '40px', color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' },
  secondaryBtn: { background: 'transparent', border: '2px solid #ff2d75', padding: '12px 32px', borderRadius: '40px', color: '#ff6b9d', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }
};

export default Home;