import { useState } from 'react';

const Profile = () => {
  // Abhi ke liye hum fake data dikha rahe hain
  const [user] = useState({
    name: 'Guest User',
    age: 21,
    branch: 'Computer Science',
    bio: 'Just a guest exploring CampusCrush!'
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px' }}>
      <div style={{ background: '#1e1a2f', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '400px' }}>
        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>👤</div>
        <h2>{user.name}, {user.age}</h2>
        <p style={{ color: '#b8a9e6', marginBottom: '10px' }}>🎓 {user.branch}</p>
        <p style={{ marginBottom: '25px', color: '#e0d4ff' }}>📝 {user.bio}</p>
        
        <button onClick={() => alert('Guest account mein edit nahi hota!')} style={{ background: '#ff2d75', border: 'none', padding: '12px 30px', borderRadius: '25px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
          ✏️ Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;