import { useState } from 'react';

const Safety = () => {
  const [reportText, setReportText] = useState('');

  const rules = [
    { icon: '🔒', title: 'Verified Students', desc: 'Only college students are allowed.' },
    { icon: '📸', title: 'Real Photos', desc: 'No fake or AI-generated pictures.' },
    { icon: '💬', title: 'Respectful Chat', desc: 'No harassment or bullying.' },
    { icon: '🚫', title: 'Block & Report', desc: 'Report any suspicious behavior.' },
    { icon: '📍', title: 'Public Meetups', desc: 'First dates should be in public.' },
    { icon: '👥', title: 'Tell a Friend', desc: 'Always let someone know your location.' }
  ];

  const handleReport = (e) => {
    e.preventDefault();
    if (reportText.trim()) {
      alert('✅ Report submitted. Our team will review it.');
      setReportText('');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>🛡️ Safety First</h1>
      <p style={{ textAlign: 'center', color: '#b8a9e6', marginBottom: '40px' }}>Your safety is our priority.</p>

      <div style={styles.grid}>
        {rules.map((rule, i) => (
          <div key={i} style={styles.card}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{rule.icon}</div>
            <h3 style={{ marginBottom: '5px' }}>{rule.title}</h3>
            <p style={{ color: '#b8a9e6', fontSize: '0.9rem' }}>{rule.desc}</p>
          </div>
        ))}
      </div>

      <div style={styles.reportSection}>
        <h2 style={{ marginBottom: '20px' }}>📢 Report an Issue</h2>
        <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <textarea 
            placeholder="Describe the issue..." 
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.btn}>Submit Report</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' },
  card: { background: '#1e1a2f', padding: '20px', borderRadius: '20px', textAlign: 'center' },
  reportSection: { background: '#1e1a2f', padding: '30px', borderRadius: '20px', maxWidth: '600px', margin: '0 auto' },
  textarea: { padding: '15px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white', minHeight: '120px', resize: 'none' },
  btn: { padding: '12px', borderRadius: '10px', border: 'none', background: '#ff2d75', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default Safety;