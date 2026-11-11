import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const userEmail = localStorage.getItem('userEmail') || 'admin@campuscrusher.com'; 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👇 API URL variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/profile/${userEmail}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userEmail, API_URL]);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Loading Profile...</div>;
  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>User not found</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px' }}>
      <div style={{ background: '#1e1a2f', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '450px' }}>
        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>👤</div>
        <h2>{user.name}, {user.age}</h2>
        <p style={{ color: '#b8a9e6', marginBottom: '5px' }}>🎓 {user.branch}</p>
        <p style={{ color: '#ffb300', marginBottom: '15px', fontWeight: 'bold' }}>Role: {user.role.toUpperCase()}</p>
        
        <div style={{ background: '#2a2538', padding: '15px', borderRadius: '15px', marginBottom: '25px' }}>
          <h3 style={{ color: '#4caf50', margin: 0 }}>{user.points} Points</h3>
          <p style={{ fontSize: '0.8rem', color: '#b8a9e6', margin: '5px 0 0' }}>Keep contributing to earn more!</p>
        </div>

        <h3 style={{ textAlign: 'left', marginBottom: '10px' }}>🏅 My Certificates</h3>
        {user.certificates?.length === 0 ? (
          <p style={{ textAlign: 'left', color: '#b8a9e6', fontSize: '0.9rem' }}>No certificates yet. Participate in events!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user.certificates?.map((cert, i) => (
              <div key={i} style={{ background: '#2a2538', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', borderLeft: '4px solid #ffb300' }}>
                <span>🎓 {cert.title}</span>
                <span style={{ fontSize: '0.8rem', color: '#b8a9e6' }}>{new Date(cert.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;