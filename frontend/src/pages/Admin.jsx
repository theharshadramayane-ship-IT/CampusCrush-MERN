import { useState, useEffect } from 'react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '', date: '', venue: '', image: '🎉'
  });
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  // Page load hote hi events load karo
  useEffect(() => {
    const existingEvents = JSON.parse(localStorage.getItem('adminEvents')) || [];
    setEvents(existingEvents);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { id: Date.now(), ...formData };
    const updatedEvents = [...events, newEvent];
    
    localStorage.setItem('adminEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    
    setMessage('✅ Event Successfully Added!');
    setFormData({ title: '', date: '', venue: '', image: '🎉' });
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter(event => event.id !== id);
      localStorage.setItem('adminEvents', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        <h1 style={{ textAlign: 'center', color: '#ff2d75', marginBottom: '10px' }}>👑 Admin Dashboard</h1>
        <p style={{ textAlign: 'center', color: '#b8a9e6', marginBottom: '30px' }}>
          Manage your college events here.
        </p>

        {/* Event Add Form */}
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: '15px' }}>➕ Add New Event</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input 
              type="text" 
              placeholder="Event Title" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={styles.input} required 
            />
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={styles.input} required 
            />
            <input 
              type="text" 
              placeholder="Venue" 
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              style={styles.input} required 
            />
            
            <select 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              style={styles.input}
            >
              <option value="🎉">🎉 Party / Festival</option>
              <option value="💻">💻 Tech / Hackathon</option>
              <option value="🎤">🎤 Music / Open Mic</option>
              <option value="⚽">⚽ Sports</option>
              <option value="📚">📚 Study Group</option>
            </select>

            <button type="submit" style={styles.addBtn}>Add Event</button>
          </form>
          {message && <p style={{ textAlign: 'center', color: '#4caf50', marginTop: '15px' }}>{message}</p>}
        </div>

        {/* Added Events List */}
        <div style={styles.listCard}>
          <h3 style={{ marginBottom: '15px' }}>📋 Active Events ({events.length})</h3>
          {events.length === 0 ? (
            <p style={{ color: '#b8a9e6' }}>No custom events added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {events.map((event) => (
                <div key={event.id} style={styles.eventItem}>
                  <div>
                    <h4 style={{ margin: 0 }}>{event.image} {event.title}</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#b8a9e6' }}>📅 {event.date} • 📍 {event.venue}</p>
                  </div>
                  <button onClick={() => handleDelete(event.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' },
  dashboard: { width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' },
  formCard: { background: '#1e1a2f', padding: '30px', borderRadius: '20px', border: '1px solid #3a2e4d' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  input: { padding: '12px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white', width: '100%' },
  addBtn: { gridColumn: '1 / -1', padding: '12px', background: '#ff2d75', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  listCard: { background: '#1e1a2f', padding: '30px', borderRadius: '20px', border: '1px solid #3a2e4d' },
  eventItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2538', padding: '15px', borderRadius: '10px' },
  deleteBtn: { background: '#ff4d4d', border: 'none', padding: '8px 15px', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }
};

export default Admin;