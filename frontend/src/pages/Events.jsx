import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const { API_URL, user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        setEvents(res.data);
      } catch (err) { console.error(err); }
    };
    fetchEvents();
  }, [API_URL]);

  const handleJoin = async (eventId) => {
    try {
      await axios.post(`${API_URL}/events/${eventId}/join`);
      alert('🎉 Joined event successfully!');
      // Refresh events
      const res = await axios.get(`${API_URL}/events`);
      setEvents(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>🎉 Campus Events</h1>
      
      <div style={styles.grid}>
        {events.map(event => (
          <div key={event._id} style={styles.card}>
            <div style={styles.image}>{event.image}</div>
            <h3 style={{ marginBottom: '10px' }}>{event.title}</h3>
            <p style={{ color: '#b8a9e6', fontSize: '0.9rem' }}>📅 {event.date} • 🕐 {event.time}</p>
            <p style={{ color: '#b8a9e6', fontSize: '0.9rem', marginBottom: '15px' }}>📍 {event.venue}</p>
            
            <button 
              onClick={() => handleJoin(event._id)} 
              style={styles.joinBtn}
              disabled={event.attendees?.includes(user?.id)}
            >
              {event.attendees?.includes(user?.id) ? '✓ Joined' : 'Join Event →'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { background: '#1e1a2f', padding: '25px', borderRadius: '20px', textAlign: 'center' },
  image: { fontSize: '4rem', marginBottom: '15px' },
  joinBtn: { width: '100%', padding: '10px', borderRadius: '20px', border: 'none', background: '#ff2d75', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default Events;