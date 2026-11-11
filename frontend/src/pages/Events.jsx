import { useState, useEffect } from 'react';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 API URL variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events`);
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API_URL]);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Loading events...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '100px', paddingBottom: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>🎉 Campus Events</h1>
      {events.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#b8a9e6' }}>No events added yet. Admin will add them soon!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {events.map(e => (
            <div key={e._id} style={{ background: '#1e1a2f', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid #3a2e4d' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{e.image}</div>
              <h3>{e.title}</h3>
              <p style={{ color: '#b8a9e6', margin: '10px 0' }}>📅 {e.date} • 📍 {e.venue}</p>
              <button onClick={() => alert('Joined!')} style={{ padding: '10px 20px', background: '#ff2d75', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer', width: '100%', marginTop: '10px' }}>Join Event</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;