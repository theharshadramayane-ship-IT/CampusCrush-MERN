import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalMessages: 0, totalEvents: 0 });
  const [eventData, setEventData] = useState({ title: '', date: '', venue: '', image: '🎉' });
  const navigate = useNavigate();

  // 👇 API URL variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const token = localStorage.getItem('adminToken');
  if (!token) navigate('/admin-login');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, eventsRes, messagesRes, analyticsRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/users`, { headers }),
          axios.get(`${API_URL}/api/events`),
          axios.get(`${API_URL}/api/admin/messages`, { headers }),
          axios.get(`${API_URL}/api/admin/analytics`, { headers })
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
  }, [token, navigate, API_URL]);

  const handleToggleBlock = async (userId) => {
    await axios.put(`${API_URL}/api/admin/block/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const handleRoleAction = async (userId, action) => {
    await axios.post(`${API_URL}/api/admin/role-request`, { userId, action }, { headers: { Authorization: `Bearer ${token}` } });
    alert(`Role ${action}d!`);
    window.location.reload();
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${API_URL}/api/events`, eventData, { headers: { Authorization: `Bearer ${token}` } });
    setEvents([res.data, ...events]);
    setEventData({ title: '', date: '', venue: '', image: '🎉' });
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete?')) {
      await axios.delete(`${API_URL}/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setEvents(events.filter(e => e._id !== id));
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete message?')) {
      await axios.delete(`${API_URL}/api/admin/messages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(messages.filter(m => m._id !== id));
    }
  };

  const handleAssignCoordinator = async (eventId, userId) => {
    if (!userId) return;
    try {
      await axios.post(`${API_URL}/api/admin/assign-coordinator`, { eventId, userId }, { headers: { Authorization: `Bearer ${token}` } });
      alert('✅ Coordinator Assigned successfully!');
    } catch (err) { 
      alert('Failed to assign coordinator'); 
    }
  };

  // ... baaki return mein same JSX rahega ...
  
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '80px', paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>👑 Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin-login'); }} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {['overview', 'students', 'events', 'chat', 'roles'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.tabBtn, ...(activeTab === tab ? styles.activeTab : {})}}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={styles.statCard}><h2 style={{ color: '#ff2d75' }}>{analytics.totalUsers}</h2><p>Total Users</p></div>
          <div style={styles.statCard}><h2 style={{ color: '#4caf50' }}>{analytics.totalMessages}</h2><p>Total Messages</p></div>
          <div style={styles.statCard}><h2 style={{ color: '#ffb300' }}>{analytics.totalEvents}</h2><p>Total Events</p></div>
        </div>
      )}

      {activeTab === 'students' && (
        <div style={styles.section}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead><tr style={{ borderBottom: '1px solid #3a2e4d', color: '#b8a9e6' }}><th style={{ padding: '10px' }}>Name</th><th>Role</th><th>Points</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #2a2538' }}>
                  <td style={{ padding: '10px' }}>{user.name} <br/><span style={{fontSize:'0.8rem', color:'#b8a9e6'}}>{user.email}</span></td>
                  <td style={{ padding: '10px', color: '#ff2d75' }}>{user.role.toUpperCase()}</td>
                  <td style={{ padding: '10px', color: '#4caf50' }}>{user.points} pts</td>
                  <td style={{ padding: '10px' }}>{user.isBlocked ? <span style={{ color: '#ff4d4d' }}>Blocked</span> : <span style={{ color: '#4caf50' }}>Active</span>}</td>
                  <td style={{ padding: '10px' }}><button onClick={() => handleToggleBlock(user._id)} style={{ background: user.isBlocked ? '#4caf50' : '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>{user.isBlocked ? 'Unblock' : 'Block'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'events' && (
        <div style={styles.section}>
          <form onSubmit={handleAddEvent} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="Title" value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} style={styles.input} required />
            <input type="date" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} style={styles.input} required />
            <input type="text" placeholder="Venue" value={eventData.venue} onChange={e => setEventData({...eventData, venue: e.target.value})} style={styles.input} required />
            <button type="submit" style={{ background: '#ff2d75', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Event</button>
          </form>
          
          <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Assign Coordinators</h3>
          {events.map(event => (
            <div key={event._id} style={styles.eventItem}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{event.image} {event.title}</h4>
                <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#b8a9e6' }}>📅 {event.date} • 📍 {event.venue}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select onChange={(e) => handleAssignCoordinator(event._id, e.target.value)} style={styles.input} defaultValue="">
                  <option value="" disabled>Assign Coordinator</option>
                  {users.filter(u => u.role === 'coordinator' || u.role === 'volunteer').map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <button onClick={() => handleDeleteEvent(event._id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'chat' && (
        <div style={styles.section}>
          <h3 style={{ marginBottom: '15px' }}>💬 Chat Moderation</h3>
          {messages.map(msg => (
            <div key={msg._id} style={styles.eventItem}>
              <div><strong>{msg.user}:</strong> {msg.text}</div>
              <button onClick={() => handleDeleteMessage(msg._id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roles' && (
        <div style={styles.section}>
          <h3 style={{ marginBottom: '15px' }}>🛡️ Role Approval Requests</h3>
          {users.filter(u => u.roleStatus === 'pending').length === 0 ? <p>No pending requests.</p> : users.filter(u => u.roleStatus === 'pending').map(user => (
            <div key={user._id} style={styles.eventItem}>
              <div>
                <h4 style={{ margin: 0 }}>{user.name} <span style={{fontSize:'0.8rem', color:'#b8a9e6'}}>({user.email})</span></h4>
                <p style={{ margin: '5px 0 0', color: '#ffb300' }}>Requested: <strong>{user.requestedRole?.toUpperCase()}</strong></p>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => handleRoleAction(user._id, 'approve')} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Approve</button>
                <button onClick={() => handleRoleAction(user._id, 'reject')} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Reject</button>
              </div>
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