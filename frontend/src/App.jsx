import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Discover from './pages/Discover';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Safety from './pages/Safety';
import FloatingChat from './components/FloatingChat'; // Naya Chat Component

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f0c1f', color: 'white' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/safety" element={<Safety />} />
      </Routes>
      
      {/* 🔥 Yahan hum Chat ko popup ki tarah fix kar rahe hain */}
      <FloatingChat /> 
    </div>
  );
}

export default App;