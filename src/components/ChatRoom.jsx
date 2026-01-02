import React, { useState, useEffect, useRef } from 'react';

const ChatRoom = ({ messages, onViewChange, onSendMessage, connectionStatus }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '800px',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            padding: '0'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: connectionStatus === 'connected' ? '#4ade80' : '#fbbf24'
                    }} />
                    <span style={{ fontWeight: 'bold' }}>Connected</span>
                </div>
                <button onClick={() => onViewChange('setup')} style={{ background: 'rgba(255,50,50,0.2)' }}>
                    End Chat
                </button>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
            }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        background: msg.sender === 'me'
                            ? 'var(--primary-gradient)'
                            : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        borderBottomRightRadius: msg.sender === 'me' ? '2px' : '12px',
                        borderBottomLeftRadius: msg.sender === 'me' ? '12px' : '2px',
                    }}>
                        <div style={{ fontSize: '0.8em', opacity: 0.7, marginBottom: '4px' }}>
                            {msg.sender === 'me' ? 'You' : 'Peer'}
                        </div>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{
                padding: '1rem',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                gap: '10px'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1 }}
                />
                <button type="submit" style={{ background: 'var(--primary-gradient)', border: 'none' }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
