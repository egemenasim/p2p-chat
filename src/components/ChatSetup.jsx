import React, { useState } from 'react';

const ChatSetup = ({ onRegisterId, onConnect }) => {
  const [customId, setCustomId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (customId.trim()) {
      onRegisterId(customId.trim());
      setIsRegistered(true);
    }
  };

  const handleConnect = (e) => {
    e.preventDefault();
    if (targetId.trim()) {
      onConnect(targetId.trim());
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1>P2P Chat Setup</h1>

      {!isRegistered ? (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Choose your username (Peer ID):</p>
          <form onSubmit={handleRegister} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g. alice, bob, user123"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              style={{ flex: 1 }}
              autoFocus
            />
            <button type="submit" disabled={!customId} style={{ background: 'var(--primary-gradient)', border: 'none' }}>
              Set ID
            </button>
          </form>
        </div>
      ) : (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Your Peer ID:</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(0,0,0,0.2)',
            padding: '10px',
            borderRadius: '8px',
            justifyContent: 'center'
          }}>
            <code style={{ fontSize: '1.2em', color: '#a5b4fc' }}>{customId}</code>
          </div>
          <p style={{ fontSize: '0.8em', color: '#fbbf24', marginTop: '5px' }}>
            Note: If this ID is taken, connection might fail silently on free servers.
          </p>
        </div>
      )}

      {isRegistered && (
        <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
          <label style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>Connect to a friend:</label>
          <input
            type="text"
            placeholder="Enter friend's Peer ID"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
          <button type="submit" disabled={!targetId} style={{ background: 'var(--primary-gradient)', border: 'none' }}>
            Start Chat
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatSetup;
