import { useState } from 'react';

const Events = () => {
  const events = [
    { id: 1, title: '🎨 Freshers Party', date: 'Aug 15', venue: 'Auditorium', image: '🎉' },
    { id: 2, title: '💻 Hackathon', date: 'Aug 20', venue: 'CS Dept', image: '💻' },
    { id: 3, title: '🎵 Open Mic', date: 'Aug 22', venue: 'Cafeteria', image: '🎤' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '100px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>🎉 Campus Events</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {events.map(e => (
          <div key={e.id} style={{ background: '#1e1a2f', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{e.image}</div>
            <h3>{e.title}</h3>
            <p style={{ color: '#b8a9e6', margin: '10px 0' }}>📅 {e.date} • 📍 {e.venue}</p>
            <button onClick={() => alert('Joined!')} style={{ padding: '10px 20px', background: '#ff2d75', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>Join Event</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;