import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Matches = () => {
  const { user, API_URL } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    // Fetch matches
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${API_URL}/matches`);
        setMatches(res.data);
      } catch (err) { console.error(err); }
    };
    fetchMatches();

    // Socket setup
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', user.id);

    socketRef.current.on('receiveMessage', (data) => {
      if (selectedChat && selectedChat._id === data.senderId) {
        setMessages(prev => [...prev, data]);
      }
    });

    return () => socketRef.current.disconnect();
  }, [API_URL, user.id, selectedChat]);

  const openChat = async (match) => {
    setSelectedChat(match);
    try {
      const res = await axios.get(`${API_URL}/messages/${match._id}`);
      setMessages(res.data);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const msgData = { receiverId: selectedChat._id, message: newMessage };
      const res = await axios.post(`${API_URL}/messages/send`, msgData);
      
      socketRef.current.emit('sendMessage', {
        receiverId: selectedChat._id,
        senderId: user.id,
        message: newMessage
      });

      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: '20px' }}>💬 Matches</h2>
        {matches.length === 0 && <p style={{ color: '#b8a9e6' }}>No matches yet. Start swiping!</p>}
        {matches.map(match => (
          <div 
            key={match._id} 
            onClick={() => openChat(match)}
            style={{
              ...styles.matchItem,
              ...(selectedChat?._id === match._id ? styles.activeMatch : {})
            }}
          >
            <div style={{ fontSize: '2rem' }}>{match.profilePhoto || '👤'}</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{match.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#b8a9e6' }}>{match.branch}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chatArea}>
        {selectedChat ? (
          <>
            <div style={styles.chatHeader}>
              <h3>{selectedChat.name}</h3>
            </div>
            <div style={styles.messagesBox}>
              {messages.map((msg, i) => (
                <div key={i} style={msg.sender === user.id ? styles.msgMe : styles.msgThem}>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} style={styles.inputArea}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.sendBtn}>Send</button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#b8a9e6' }}>
            <h3>Select a match to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', paddingTop: '70px' },
  sidebar: { width: '300px', background: '#1e1a2f', padding: '20px', borderRight: '1px solid #3a2e4d', overflowY: 'auto' },
  matchItem: { display: 'flex', gap: '15px', alignItems: 'center', padding: '10px', borderRadius: '10px', cursor: 'pointer', marginBottom: '10px', background: '#2a2538' },
  activeMatch: { background: '#ff2d75' },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', background: '#0f0c1f' },
  chatHeader: { padding: '20px', background: '#1e1a2f', borderBottom: '1px solid #3a2e4d' },
  messagesBox: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  msgMe: { alignSelf: 'flex-end', background: '#ff2d75', padding: '10px 15px', borderRadius: '15px 15px 0 15px', maxWidth: '70%' },
  msgThem: { alignSelf: 'flex-start', background: '#2a2538', padding: '10px 15px', borderRadius: '15px 15px 15px 0', maxWidth: '70%' },
  inputArea: { display: 'flex', padding: '20px', background: '#1e1a2f', borderTop: '1px solid #3a2e4d' },
  input: { flex: 1, padding: '12px', borderRadius: '25px', border: 'none', background: '#2a2538', color: 'white', marginRight: '10px' },
  sendBtn: { padding: '12px 25px', borderRadius: '25px', border: 'none', background: '#ff2d75', color: 'white', cursor: 'pointer', fontWeight: 'bold' }
};

export default Matches;