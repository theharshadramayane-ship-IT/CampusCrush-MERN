import { useState } from 'react';

const Discover = () => {
  // Fake data taaki page khali na dikhe
  const profiles = [
    { id: 1, name: 'Priya Sharma', age: 21, branch: 'Computer Science', bio: 'Coding enthusiast', photo: '👩‍💻' },
    { id: 2, name: 'Rahul Verma', age: 22, branch: 'Electronics', bio: 'Football player', photo: '👨‍🎓' },
    { id: 3, name: 'Anjali Nair', age: 20, branch: 'IT', bio: 'Nature lover', photo: '👩‍🔬' }
  ];
  const [index, setIndex] = useState(0);
  const current = profiles[index];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px' }}>
      {current ? (
        <div style={{ background: '#1e1a2f', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '350px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '15px' }}>{current.photo}</div>
          <h2>{current.name}, {current.age}</h2>
          <p style={{ color: '#b8a9e6', marginBottom: '10px' }}>🎓 {current.branch}</p>
          <p style={{ marginBottom: '25px' }}>{current.bio}</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button onClick={() => setIndex(index + 1)} style={{ padding: '12px 25px', background: '#3a2e4d', border: 'none', borderRadius: '25px', color: 'white', cursor: 'pointer' }}>Pass</button>
            <button onClick={() => { alert('Liked!'); setIndex(index + 1); }} style={{ padding: '12px 25px', background: '#ff2d75', border: 'none', borderRadius: '25px', color: 'white', cursor: 'pointer' }}>Like</button>
          </div>
        </div>
      ) : (
        <h2 style={{ color: '#b8a9e6' }}>No more profiles! 🎉</h2>
      )}
    </div>
  );
};

export default Discover;