const Safety = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '100px', paddingBottom: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🛡️ Safety First</h1>
      <div style={{ background: '#1e1a2f', padding: '30px', borderRadius: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Community Guidelines</h2>
        <ul style={{ lineHeight: '1.8', color: '#b8a9e6' }}>
          <li>🔒 Only verified college students allowed.</li>
          <li>📸 No fake or AI-generated pictures.</li>
          <li>💬 Be respectful in the public chat. No harassment.</li>
          <li>📍 First dates should be in public campus areas.</li>
        </ul>
      </div>
    </div>
  );
};

export default Safety;