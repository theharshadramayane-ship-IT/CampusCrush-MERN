import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Discover from './pages/Discover';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Safety from './pages/Safety';
import Admin from './pages/Admin'; 
import AdminLogin from './pages/AdminLogin'; // 👈 Naya
import AdminDashboard from './pages/AdminDashboard'; // 👈 Naya
import FloatingChat from './components/FloatingChat';

function App() {
  const location = useLocation();
  // Admin se related saare pages par Navbar/Chat hide rahega
  const isAdminRoute = location.pathname.includes('/admin');

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c1f', color: 'white' }}>
      {!isAdminRoute && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/safety" element={<Safety />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      
      {!isAdminRoute && <FloatingChat />} 
    </div>
  );
}

export default App;