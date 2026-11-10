import { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/leaderboard');
        setUsers(res.data);
      } catch (err) { console.error(err); }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '100px', paddingBottom: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#ffb300' }}>🏆 Weekly Leaderboard</h1>
      <p style={{ textAlign: 'center', color: '#b8a9e6', marginBottom: '40px' }}>Top contributors of CampusCrush</p>

      <div style={{ background: '#1e1a2f', borderRadius: '20px', padding: '20px', border: '1px solid #3a2e4d' }}>
        {users.map((user, index) => (
          <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: index !== users.length - 1 ? '1px solid #2a2538' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h2 style={{ margin: 0, color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#b8a9e6' }}>
                #{index + 1}
              </h2>
              <div>
                <h4 style={{ margin: 0 }}>{user.name}</h4>
                <span style={{ fontSize: '0.8rem', color: '#b8a9e6' }}>{user.branch}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: 0, color: '#4caf50' }}>{user.points} pts</h3>
              <span style={{ fontSize: '0.8rem', color: '#ffb300' }}>
                🎓 {user.certificates.length} Certificates
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;