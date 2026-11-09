import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', gender: 'Boy', branch: 'CS', age: '' });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(formData);
    if (res.success) {
      navigate('/discover');
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>✨ Create Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} required />
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} style={styles.input} required />
          <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} style={styles.input} required />
          <input type="number" placeholder="Age" onChange={(e) => setFormData({...formData, age: e.target.value})} style={styles.input} required />
          
          <select onChange={(e) => setFormData({...formData, gender: e.target.value})} style={styles.input}>
            <option value="Boy">Boy</option>
            <option value="Girl">Girl</option>
          </select>
          
          <select onChange={(e) => setFormData({...formData, branch: e.target.value})} style={styles.input}>
            <option value="CS">Computer Science</option>
            <option value="IT">Information Technology</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
          </select>

          {error && <p style={{ color: '#ff6b9d', textAlign: 'center' }}>{error}</p>}
          <button type="submit" style={styles.btn}>Signup →</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Already have an account? <Link to="/login" style={{ color: '#ff2d75' }}>Login</Link></p>
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

export default Signup;