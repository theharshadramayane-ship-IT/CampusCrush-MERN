import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    bio: user?.bio || ''
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>{user.profilePhoto || '👤'}</div>
        
        {!isEditing ? (
          <>
            <h2>{user.name}, {user.age}</h2>
            <p style={styles.branch}>🎓 {user.branch}</p>
            <p style={styles.bio}>📝 {user.bio || 'No bio yet'}</p>
            <button onClick={() => setIsEditing(true)} style={styles.editBtn}>✏️ Edit Profile</button>
          </>
        ) : (
          <div style={styles.editForm}>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              style={styles.input} 
              placeholder="Name" 
            />
            <input 
              type="number" 
              value={formData.age} 
              onChange={e => setFormData({...formData, age: e.target.value})} 
              style={styles.input} 
              placeholder="Age" 
            />
            <textarea 
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
              style={styles.textarea} 
              placeholder="Tell us about yourself..." 
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSave} style={styles.saveBtn}>💾 Save</button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px' },
  card: { background: '#1e1a2f', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '450px' },
  avatar: { fontSize: '6rem', marginBottom: '20px' },
  branch: { color: '#b8a9e6', marginBottom: '10px' },
  bio: { marginBottom: '20px', color: '#e0d4ff' },
  editBtn: { background: '#ff2d75', border: 'none', padding: '12px 30px', borderRadius: '25px', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  editForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white' },
  textarea: { padding: '12px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white', minHeight: '100px', resize: 'none' },
  saveBtn: { flex: 1, background: '#4caf50', border: 'none', padding: '12px', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { flex: 1, background: '#3a2e4d', border: 'none', padding: '12px', borderRadius: '10px', color: 'white', cursor: 'pointer' }
};

export default Profile;