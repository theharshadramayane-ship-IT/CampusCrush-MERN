import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login Failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f0c1f' }}>
      <div style={{ background: '#1e1a2f', padding: '40px', borderRadius: '20px', width: '400px', border: '1px solid #ff2d75' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff2d75' }}>👑 Admin Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          {error && <p style={{ color: '#ff6b9d', textAlign: 'center' }}>{error}</p>}
          <button type="submit" style={styles.btn}>Login →</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.8rem', color: '#b8a9e6' }}>
          Demo: admin@campuscrusher.com / admin123
        </p>
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '12px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white' },
  btn: { padding: '12px', background: '#ff2d75', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default AdminLogin;