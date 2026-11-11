import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const FloatingChat = () => {
  // 👇 API URL variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Socket connection variable ke saath
  const socket = io(API_URL);

  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('guestName') || '');
  const [isJoined, setIsJoined] = useState(!!username);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_public_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off('receive_public_message');
  }, [socket]);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isOpen]);

  const joinChat = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('guestName', username);
      setIsJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_public_message', { user: username, text: message });
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>🌍 Public Chat</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✖</button>
          </div>
          
          {!isJoined ? (
            <div style={styles.joinBox}>
              <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Enter your name to chat</p>
              <form onSubmit={joinChat} style={{ display: 'flex', gap: '5px' }}>
                <input type="text" placeholder="Your Name" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
                <button type="submit" style={styles.btn}>Join</button>
              </form>
            </div>
          ) : (
            <>
              <div style={styles.messagesBox}>
                {chat.map((msg, i) => (
                  <div key={i} style={msg.user === username ? styles.msgMe : styles.msgThem}>
                    <div style={{ fontSize: '0.65rem', color: '#b8a9e6' }}>{msg.user}</div>
                    <p>{msg.text}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} style={styles.inputArea}>
                <input type="text" placeholder="Type..." value={message} onChange={(e) => setMessage(e.target.value)} style={styles.input} />
                <button type="submit" style={styles.btn}>Send</button>
              </form>
            </>
          )}
        </div>
      )}

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.floatingBtn}>💬</button>
      )}
    </div>
  );
};

const styles = {
  container: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000 },
  floatingBtn: { width: '60px', height: '60px', borderRadius: '50%', background: '#ff2d75', color: 'white', fontSize: '1.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,45,117,0.4)' },
  chatWindow: { width: '320px', height: '450px', background: '#1e1a2f', borderRadius: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 25px rgba(0,0,0,0.5)', overflow: 'hidden', border: '1px solid #3a2e4d' },
  header: { padding: '15px', background: '#ff2d75', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' },
  joinBox: { padding: '20px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  messagesBox: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  msgMe: { alignSelf: 'flex-end', background: '#ff2d75', padding: '8px 12px', borderRadius: '10px 10px 0 10px', maxWidth: '80%', color: 'white' },
  msgThem: { alignSelf: 'flex-start', background: '#2a2538', padding: '8px 12px', borderRadius: '10px 10px 10px 0', maxWidth: '80%', color: 'white' },
  inputArea: { display: 'flex', padding: '10px', background: '#2a2538' },
  input: { flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#1e1a2f', color: 'white' },
  btn: { padding: '10px 15px', borderRadius: '8px', border: 'none', background: '#ff2d75', color: 'white', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }
};

export default FloatingChat;