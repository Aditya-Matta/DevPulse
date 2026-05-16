import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import useUIStore from '../store/uiStore.js';
import api from '../lib/axios.js';
import Button from '../components/ui/Button.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { connectSocket } from '../lib/socket.js';
import { LANGUAGES, LANGUAGE_STARTERS } from '../lib/constants.js';

export default function MockRoom() {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();

  const [phase, setPhase] = useState(urlCode ? 'room' : 'lobby');
  const [roomCode, setRoomCode] = useState(urlCode?.toUpperCase() || '');
  const [codeInput, setCodeInput] = useState('');
  const [room, setRoom] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const socketRef = useRef(null);
  const debounceRef = useRef(null);
  const chatEndRef = useRef(null);

  const joinSocket = useCallback((rc) => {
    const socket = connectSocket();
    socketRef.current = socket;
    socket.emit('room:join', { roomCode: rc, userId: user._id, username: user.username });
    socket.on('room:state', ({ code: c, language: l }) => { setCode(c); setLanguage(l); });
    socket.on('room:code-update', ({ code: c }) => setCode(c));
    socket.on('room:language-change', ({ language: l }) => { setLanguage(l); setCode(LANGUAGE_STARTERS[l]); });
    socket.on('room:participants', (p) => setParticipants(p));
    socket.on('room:message', (msg) => setMessages(prev => [...prev, msg]));
    socket.on('room:user-joined', ({ username }) => addNotification({ type: 'info', message: `${username} joined` }));
    socket.on('room:user-left', ({ username }) => addNotification({ type: 'info', message: `${username} left` }));
  }, [user]);

  useEffect(() => {
    if (urlCode) joinExistingRoom(urlCode.toUpperCase());
    return () => {
      socketRef.current?.emit('room:leave', { roomCode });
      ['room:state','room:code-update','room:language-change','room:participants','room:message','room:user-joined','room:user-left']
        .forEach(e => socketRef.current?.off(e));
    };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const createRoom = async () => {
    setCreating(true);
    try {
      const res = await api.post('/api/rooms/create', { language });
      const rc = res.data.data.room.roomCode;
      setRoom(res.data.data.room);
      setRoomCode(rc);
      setCode(LANGUAGE_STARTERS[language]);
      joinSocket(rc);
      navigate(`/mock-room/${rc}`, { replace: true });
      setPhase('room');
      addNotification({ type: 'success', message: `Room ${rc} created` });
    } catch { addNotification({ type: 'error', message: 'Failed to create room' }); }
    finally { setCreating(false); }
  };

  const joinExistingRoom = async (rc) => {
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${rc}/join`);
      setRoom(res.data.data.room);
      setRoomCode(rc);
      setCode(res.data.data.room.code || LANGUAGE_STARTERS[res.data.data.room.language]);
      setLanguage(res.data.data.room.language);
      joinSocket(rc);
      setPhase('room');
    } catch (err) {
      addNotification({ type: 'error', message: err.response?.data?.message || 'Room not found' });
    } finally { setLoading(false); }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCode(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      socketRef.current?.emit('room:code-update', { roomCode, code: val });
    }, 300);
  };

  const handleLangChange = (lang) => {
    setLanguage(lang);
    socketRef.current?.emit('room:language-change', { roomCode, language: lang });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    socketRef.current?.emit('room:message', { roomCode, text: messageInput.trim() });
    setMessageInput('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/mock-room/${roomCode}`);
    addNotification({ type: 'success', message: 'Room link copied' });
  };

  const selStyle = {
    background: 'var(--bg-raised)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)', padding: '7px 12px',
    color: 'var(--text)', fontSize: '0.83rem', fontFamily: 'inherit', outline: 'none',
  };

  // ── Lobby ───────────────────────────────────────────────────────
  if (phase === 'lobby') {
    return (
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <p className="label" style={{ marginBottom: 6 }}>Collaborative practice</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text)', marginBottom: 8 }}>
          Mock Interview Room
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: 36 }}>
          Create a room and share the 6-char code, or join a session already in progress.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Create */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-xs)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.01em' }}>Create room</p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.8rem', lineHeight: 1.55 }}>Get a unique code to share with your partner.</p>
            </div>
            <select style={selStyle} value={language} onChange={e => setLanguage(e.target.value)}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <Button variant="primary" onClick={createRoom} loading={creating}>Create room</Button>
          </div>

          {/* Join */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-xs)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.01em' }}>Join room</p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.8rem', lineHeight: 1.55 }}>Enter a 6-character code to join an existing session.</p>
            </div>
            <input
              className="input"
              placeholder="A1B2C3"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase().slice(0,6))}
              onKeyDown={e => { if (e.key==='Enter' && codeInput.length===6) joinExistingRoom(codeInput); }}
              style={{ textTransform:'uppercase', letterSpacing:'0.18em', fontWeight: 600, fontSize: '1.05rem', textAlign:'center' }}
            />
            <Button variant="secondary" onClick={() => joinExistingRoom(codeInput)} loading={loading} disabled={codeInput.length!==6}>
              Join room
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Room ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: 'calc(100vh - 110px)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 10, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
            Room <span style={{ fontFamily: 'monospace', color: 'var(--accent)', letterSpacing: '0.1em' }}>{roomCode}</span>
          </h1>
          <div style={{ display: 'flex', gap: -4 }}>
            {participants.map(p => <Avatar key={p.userId} name={p.username} size={24} style={{ marginLeft: -5, border: '2px solid var(--bg-surface)' }} />)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select style={selStyle} value={language} onChange={e => handleLangChange(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={copyLink}>Copy link</Button>
        </div>
      </div>

      {/* Editor + Chat */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Editor */}
        <div style={{
          background: 'var(--bg-raised)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', gap: 5 }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--border-strong)' }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--border-strong)' }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--border-strong)' }} />
            </div>
            <span style={{ color: 'var(--text-3)', fontSize: '0.73rem' }}>
              {LANGUAGES.find(l=>l.value===language)?.label} · {participants.length} participant{participants.length!==1?'s':''}
            </span>
          </div>
          <textarea
            value={code}
            onChange={handleCodeChange}
            spellCheck={false}
            style={{
              flex: 1, padding: '16px 18px',
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace",
              fontSize: '0.85rem', lineHeight: 1.7, resize: 'none', whiteSpace: 'pre',
            }}
          />
        </div>

        {/* Chat */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.82rem', color: 'var(--text)' }}>
            Chat
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', textAlign: 'center', marginTop: 16 }}>No messages yet</p>
            )}
            {messages.map((msg, i) => (
              <div key={i}>
                <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 600 }}>{msg.username}</span>
                <div style={{
                  background: 'var(--bg-raised)', borderRadius: '3px 10px 10px 10px',
                  padding: '7px 11px', marginTop: 3,
                  color: 'var(--text)', fontSize: '0.82rem', lineHeight: 1.45,
                  border: '1px solid var(--border)',
                }}>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 7 }}>
            <input
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder="Type a message…"
              className="input"
              style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '7px 12px', fontSize: '0.8rem' }}>→</button>
          </form>
        </div>
      </div>
    </div>
  );
}
