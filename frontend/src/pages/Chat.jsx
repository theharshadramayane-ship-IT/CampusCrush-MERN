import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL

const Chat = () => {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_public_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off('receive_public_message');
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const joinChat = (e) => {
    e.preventDefault();
    if (username.trim()) setIsJoined(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_public_message', { user: username, text: message });
      setMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div style={styles.joinContainer}>
        <div style={styles.joinCard}>
          <h2 style={{ marginBottom: '20px' }}>Join Public Chat 🚀</h2>
          <p style={{ color: '#b8a9e6', marginBottom: '20px' }}>Enter your name to start chatting with everyone.</p>
          <form onSubmit={joinChat}>
            <input type="text" placeholder="Your Name" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
            <button type="submit" style={styles.btn}>Join Room →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>Group Chat (Public) 🌍</div>
      <div style={styles.messagesBox}>
        {chat.map((msg, i) => (
          <div key={i} style={msg.user === username ? styles.msgMe : styles.msgThem}>
            <div style={{ fontSize: '0.75rem', color: msg.user === username ? '#fff' : '#b8a9e6', marginBottom: '4px' }}>
              <strong>{msg.user}</strong>
            </div>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.sendBtn}>Send</button>
      </form>
    </div>
  );
};

const styles = {
  joinContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px' },
  joinCard: { background: '#1e1a2f', padding: '40px', borderRadius: '20px', width: '400px', textAlign: 'center' },
  input: { width: '100%', padding: '12px', background: '#2a2538', border: 'none', borderRadius: '10px', color: 'white', marginBottom: '15px' },
  btn: { width: '100%', padding: '12px', background: '#ff2d75', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  chatContainer: { display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '80px', maxWidth: '800px', margin: '0 auto' },
  header: { padding: '20px', background: '#1e1a2f', borderBottom: '1px solid #3a2e4d', fontWeight: 'bold' },
  messagesBox: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' },
  msgMe: { alignSelf: 'flex-end', background: '#ff2d75', padding: '10px 15px', borderRadius: '15px 15px 0 15px', maxWidth: '70%' },
  msgThem: { alignSelf: 'flex-start', background: '#1e1a2f', padding: '10px 15px', borderRadius: '15px 15px 15px 0', maxWidth: '70%' },
  inputArea: { display: 'flex', padding: '20px', background: '#1e1a2f' },
  sendBtn: { padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#ff2d75', color: 'white', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }
};

export default Chat;