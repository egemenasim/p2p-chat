import React, { useState } from 'react';

const ChatSetup = ({ myPeerId, onConnect }) => {
  const [targetId, setTargetId] = useState('');

  const handleConnect = (e) => {
    e.preventDefault();
    if (targetId.trim()) {
      onConnect(targetId.trim());
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1>P2P Chat</h1>
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
          <code style={{ fontSize: '1.2em', color: '#a5b4fc' }}>{myPeerId || 'Generating ID...'}</code>
          <button 
            onClick={() => navigator.clipboard.writeText(myPeerId)}
            style={{ padding: '4px 8px', fontSize: '0.8em' }}
          >
            Copy
          </button>
        </div>
      </div>

      <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
    </div>
  );
};

export default ChatSetup;
