import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/discover');
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🔐 Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          {error && <p style={{ color: '#ff6b9d', textAlign: 'center' }}>{error}</p>}
          <button type="submit" style={styles.btn}>Login →</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>New user? <Link to="/signup" style={{ color: '#ff2d75' }}>Signup</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px' },
  card: { background: '#1e1a2f', padding: '40px', borderRadius: '30px', width: '400px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white' },
  btn: { padding: '12px', background: '#ff2d75', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default Login;