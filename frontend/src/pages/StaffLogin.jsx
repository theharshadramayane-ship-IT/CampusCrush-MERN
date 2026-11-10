import { useState } from 'react';
import axios from 'axios';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('coordinator');
  const [message, setMessage] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/apply-role', { email, requestedRole: role });
      setMessage(res.data.message);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to apply');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ background: '#1e1a2f', padding: '40px', borderRadius: '20px', width: '400px', border: '1px solid #ff2d75' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff2d75' }}>🛡️ Apply for Staff Role</h2>
        <p style={{ textAlign: 'center', color: '#b8a9e6', fontSize: '0.9rem', marginBottom: '20px' }}>
          Enter your registered email to apply for a college role.
        </p>
        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Your College Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
            <option value="gs">General Secretary (GS)</option>
            <option value="secretary">Board Secretary</option>
            <option value="coordinator">Event Coordinator</option>
            <option value="volunteer">Volunteer</option>
          </select>
          <button type="submit" style={styles.btn}>Apply Now →</button>
        </form>
        {message && <p style={{ textAlign: 'center', color: '#4caf50', marginTop: '15px' }}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '12px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white' },
  btn: { padding: '12px', background: '#ff2d75', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default StaffLogin;