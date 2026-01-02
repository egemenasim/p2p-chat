import { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs'
import ChatSetup from './components/ChatSetup'
import ChatRoom from './components/ChatRoom'
import './App.css'

function App() {
  const [myPeerId, setMyPeerId] = useState('')
  const [connection, setConnection] = useState(null)
  const [messages, setMessages] = useState([])
  const [view, setView] = useState('setup') // 'setup' | 'chat'
  const [connectionStatus, setConnectionStatus] = useState('disconnected') // disconnected, connecting, connected

  const peerRef = useRef(null)

  useEffect(() => {
    // Initialize Peer
    const peer = new Peer()
    peerRef.current = peer

    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id)
      setMyPeerId(id)
    })

    peer.on('connection', (conn) => {
      console.log('Incoming connection from:', conn.peer)
      handleConnection(conn)
    })

    return () => {
      peer.destroy()
    }
  }, [])

  const handleConnection = (conn) => {
    setConnection(conn)
    setConnectionStatus('connecting')

    conn.on('open', () => {
      console.log('Connection opened with:', conn.peer)
      setConnectionStatus('connected')
      setView('chat')
      // Send welcome message or just sync
    })

    conn.on('data', (data) => {
      console.log('Received data:', data)
      if (data.type === 'message') {
        setMessages(prev => [...prev, { text: data.text, sender: 'peer' }])
      }
    })

    conn.on('close', () => {
      console.log('Connection closed')
      setConnectionStatus('disconnected')
      setConnection(null)
      alert('Connection lost')
      setView('setup')
      setMessages([])
    })

    conn.on('error', (err) => {
      console.error('Connection error:', err)
      alert('Connection error: ' + err)
    })
  }

  const connectToPeer = (targetId) => {
    if (!peerRef.current) return
    console.log('Connecting to:', targetId)
    const conn = peerRef.current.connect(targetId)
    handleConnection(conn)
  }

  const sendMessage = (text) => {
    if (connection && connectionStatus === 'connected') {
      connection.send({ type: 'message', text })
      setMessages(prev => [...prev, { text, sender: 'me' }])
    }
  }

  const handleViewChange = (newView) => {
    if (newView === 'setup' && connection) {
      connection.close()
    }
    setView(newView)
  }

  return (
    <div className="App">
      {view === 'setup' ? (
        <ChatSetup myPeerId={myPeerId} onConnect={connectToPeer} />
      ) : (
        <ChatRoom
          messages={messages}
          onViewChange={handleViewChange}
          onSendMessage={sendMessage}
          connectionStatus={connectionStatus}
        />
      )}
    </div>
  )
}

export default App
