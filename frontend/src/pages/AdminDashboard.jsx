import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({ title: '', date: '', venue: '', image: '🎉' });
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');
  if (!token) navigate('/admin-login');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, eventsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', { headers }),
          axios.get('http://localhost:5000/api/events')
        ]);
        setUsers(usersRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleToggleBlock = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/block/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) { alert('Failed to block user'); }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/events', eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents([res.data, ...events]);
      setEventData({ title: '', date: '', venue: '', image: '🎉' });
      alert('✅ Event Added to Database!');
    } catch (err) { alert('Failed to add event'); }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(events.filter(e => e._id !== id));
      } catch (err) { alert('Failed to delete'); }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '100px', paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>👑 Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin-login'); }} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '40px' }}>
        <div style={styles.statCard}><h2 style={{ color: '#ff2d75' }}>{users.length}</h2><p>Total Users</p></div>
        <div style={styles.statCard}><h2 style={{ color: '#4caf50' }}>{users.filter(u => !u.isBlocked).length}</h2><p>Active Users</p></div>
        <div style={styles.statCard}><h2 style={{ color: '#ff4d4d' }}>{users.filter(u => u.isBlocked).length}</h2><p>Blocked Users</p></div>
        <div style={styles.statCard}><h2 style={{ color: '#ff2d75' }}>{events.length}</h2><p>Total Events</p></div>
      </div>

      {/* Student Management */}
      <div style={styles.section}>
        <h3>👨‍🎓 Student Management</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #3a2e4d', color: '#b8a9e6' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #2a2538' }}>
                <td style={{ padding: '10px' }}>{user.name}</td>
                <td style={{ padding: '10px', color: '#b8a9e6' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>{user.isBlocked ? <span style={{ color: '#ff4d4d' }}>Blocked</span> : <span style={{ color: '#4caf50' }}>Active</span>}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleToggleBlock(user._id)} style={{ background: user.isBlocked ? '#4caf50' : '#ff4d4d', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event Management */}
      <div style={styles.section}>
        <h3>🎉 Event Management</h3>
        <form onSubmit={handleAddEvent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <input type="text" placeholder="Title" value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} style={styles.input} required />
          <input type="date" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} style={styles.input} required />
          <input type="text" placeholder="Venue" value={eventData.venue} onChange={e => setEventData({...eventData, venue: e.target.value})} style={styles.input} required />
          <select value={eventData.image} onChange={e => setEventData({...eventData, image: e.target.value})} style={styles.input}>
            <option value="🎉">🎉 Party</option><option value="💻">💻 Tech</option><option value="🎤">🎤 Music</option><option value="⚽">⚽ Sports</option>
          </select>
          <button type="submit" style={{ background: '#ff2d75', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', gridColumn: '3' }}>Add Event</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {events.map(event => (
            <div key={event._id} style={styles.eventItem}>
              <div><h4 style={{ margin: 0 }}>{event.image} {event.title}</h4><p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#b8a9e6' }}>📅 {event.date} • 📍 {event.venue}</p></div>
              <button onClick={() => handleDeleteEvent(event._id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  logoutBtn: { background: '#ff2d75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' },
  statCard: { background: '#1e1a2f', padding: '20px', borderRadius: '15px', textAlign: 'center' },
  section: { background: '#1e1a2f', borderRadius: '20px', padding: '20px', marginBottom: '30px' },
  input: { padding: '10px', background: '#2a2538', border: 'none', borderRadius: '5px', color: 'white' },
  eventItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2538', padding: '15px', borderRadius: '10px' }
};

export default AdminDashboard;