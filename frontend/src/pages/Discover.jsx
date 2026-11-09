import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Discover = () => {
  const { user, API_URL } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchMsg, setMatchMsg] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/discover`);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_URL]);

  const handleSwipe = async (action) => {
    const currentUser = users[currentIndex];
    if (!currentUser) return;

    try {
      const res = await axios.post(`${API_URL}/matches/like`, {
        likedUserId: currentUser._id,
        action
      });

      if (res.data.matched) {
        setMatchMsg(`🎉 It's a match with ${currentUser.name}!`);
        setTimeout(() => setMatchMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }

    // Next profile
    if (currentIndex + 1 < users.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('No more profiles! Come back later. 🎉');
      setCurrentIndex(0);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Loading profiles... 💘</div>;

  const currentUser = users[currentIndex];

  return (
    <div style={styles.container}>
      {matchMsg && (
        <div style={styles.matchPopup}>{matchMsg}</div>
      )}

      {!currentUser ? (
        <div style={{ textAlign: 'center', color: '#b8a9e6' }}>
          <h2>No more profiles available.</h2>
          <p>Check back later or add more users!</p>
        </div>
      ) : (
        <div style={styles.card} className="fade-in-up">
          <div style={styles.avatar}>{currentUser.profilePhoto || '👤'}</div>
          <h2 style={styles.name}>{currentUser.name}, {currentUser.age}</h2>
          <p style={styles.branch}>🎓 {currentUser.branch}</p>
          <p style={styles.bio}>📝 {currentUser.bio || 'No bio yet'}</p>
          <div style={styles.interests}>
            {currentUser.interests?.map((interest, i) => (
              <span key={i} style={styles.interestTag}>#{interest}</span>
            ))}
          </div>
          <div style={styles.actions}>
            <button onClick={() => handleSwipe('pass')} style={styles.passBtn}>👎 Pass</button>
            <button onClick={() => handleSwipe('like')} style={styles.likeBtn}>💘 Like</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '500px', margin: '0 auto', paddingTop: '100px' },
  matchPopup: { position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: '#ff2d75', padding: '15px 30px', borderRadius: '20px', fontWeight: 'bold', zIndex: 1000 },
  card: { background: '#1e1a2f', borderRadius: '30px', padding: '40px', textAlign: 'center' },
  avatar: { fontSize: '6rem', marginBottom: '20px' },
  name: { fontSize: '1.8rem', marginBottom: '10px' },
  branch: { color: '#b8a9e6', marginBottom: '10px' },
  bio: { marginBottom: '20px', color: '#e0d4ff' },
  interests: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '30px' },
  interestTag: { background: '#2a2538', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '20px', justifyContent: 'center' },
  passBtn: { background: '#4a3a5e', border: 'none', padding: '12px 30px', borderRadius: '30px', color: 'white', fontSize: '1.1rem', cursor: 'pointer' },
  likeBtn: { background: '#ff2d75', border: 'none', padding: '12px 30px', borderRadius: '30px', color: 'white', fontSize: '1.1rem', cursor: 'pointer' }
};

export default Discover;