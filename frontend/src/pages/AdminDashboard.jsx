import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalMessages: 0, totalMatches: 0 });
  const [eventData, setEventData] = useState({ title: '', date: '', venue: '', image: '🎉' });
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');
  if (!token) navigate('/admin-login');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, eventsRes, messagesRes, analyticsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', { headers }),
          axios.get('http://localhost:5000/api/events'),
          axios.get('http://localhost:5000/api/admin/messages', { headers }),
          axios.get('http://localhost:5000/api/admin/analytics', { headers })
        ]);
        setUsers(usersRes.data);
        setEvents(eventsRes.data);
        setMessages(messagesRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/admin-login');
      }
    };
    fetchData();
  }, [token, navigate]);

  // ---------------- ACTIONS ----------------
  const handleToggleBlock = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/block/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) { alert('Failed'); }
  };

  const handleToggleMute = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/mute/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.map(u => u._id === userId ? { ...u, isChatMuted: !u.isChatMuted } : u));
    } catch (err) { alert('Failed'); }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/events', eventData, { headers: { Authorization: `Bearer ${token}` } });
      setEvents([res.data, ...events]);
      setEventData({ title: '', date: '', venue: '', image: '🎉' });
      alert('✅ Event Added!');
    } catch (err) { alert('Failed'); }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete this event?')) {
      await axios.delete(`http://localhost:5000/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setEvents(events.filter(e => e._id !== id));
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      await axios.delete(`http://localhost:5000/api/admin/messages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(messages.filter(m => m._id !== id));
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '80px', paddingBottom: '50px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>👑 Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin-login'); }} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {['overview', 'students', 'events', 'chat'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{...styles.tabBtn, ...(activeTab === tab ? styles.activeTab : {})}}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔥 1. ANALYTICS (Overview Tab) */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={styles.statCard}><h2 style={{ color: '#ff2d75' }}>{analytics.totalUsers}</h2><p>Total Users</p></div>
          <div style={styles.statCard}><h2 style={{ color: '#4caf50' }}>{analytics.totalMessages}</h2><p>Total Chat Messages</p></div>
          <div style={styles.statCard}><h2 style={{ color: '#ffb300' }}>{analytics.totalMatches}</h2><p>Total Matches</p></div>
        </div>
      )}

      {/* 🔥 2. STUDENT MANAGEMENT (Mute Feature added) */}
      {activeTab === 'students' && (
        <div style={styles.section}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3a2e4d', color: '#b8a9e6' }}>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #2a2538' }}>
                  <td style={{ padding: '10px' }}>{user.name} <br/><span style={{fontSize:'0.8rem', color:'#b8a9e6'}}>{user.email}</span></td>
                  <td style={{ padding: '10px' }}>
                    {user.isBlocked ? <span style={{ color: '#ff4d4d' }}>Blocked</span> : <span style={{ color: '#4caf50' }}>Active</span>}
                  </td>
                  <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleToggleBlock(user._id)} style={{ background: user.isBlocked ? '#4caf50' : '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button onClick={() => handleToggleMute(user._id)} style={{ background: user.isChatMuted ? '#ffb300' : '#4a3a5e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                      {user.isChatMuted ? 'Unmute Chat' : 'Mute Chat'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. EVENT MANAGEMENT */}
      {activeTab === 'events' && (
        <div style={styles.section}>
          <form onSubmit={handleAddEvent} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="Title" value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} style={styles.input} required />
            <input type="date" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Venue" value={eventData.venue} onChange={e => setEventData({...eventData, venue: e.target.value})} style={styles.input} required />
            <button type="submit" style={{ background: '#ff2d75', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Event</button>
          </form>
          {events.map(event => (
            <div key={event._id} style={styles.eventItem}>
              <div><h4 style={{ margin: 0 }}>{event.image} {event.title}</h4><p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#b8a9e6' }}>📅 {event.date} • 📍 {event.venue}</p></div>
              <button onClick={() => handleDeleteEvent(event._id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 4. CHAT MODERATION */}
      {activeTab === 'chat' && (
        <div style={styles.section}>
          <h3 style={{ marginBottom: '15px' }}>💬 Public Chat Moderation</h3>
          {messages.length === 0 ? <p>No messages yet.</p> : messages.map(msg => (
            <div key={msg._id} style={styles.eventItem}>
              <div>
                <p style={{ margin: 0 }}><strong>{msg.user}:</strong> {msg.text}</p>
                <span style={{ fontSize: '0.7rem', color: '#b8a9e6' }}>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => handleDeleteMessage(msg._id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  logoutBtn: { background: '#ff2d75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' },
  tabBtn: { background: 'transparent', color: '#b8a9e6', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  activeTab: { background: '#ff2d75', color: 'white' },
  statCard: { background: '#1e1a2f', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid #3a2e4d' },
  section: { background: '#1e1a2f', borderRadius: '20px', padding: '30px', border: '1px solid #3a2e4d' },
  input: { padding: '10px', background: '#2a2538', border: 'none', borderRadius: '5px', color: 'white' },
  eventItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2538', padding: '15px', borderRadius: '10px', marginBottom: '10px' }
};

export default AdminDashboard;