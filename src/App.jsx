import { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs'
import Lobby from './components/Lobby'
import GameTable from './components/GameTable'
import { v4 as uuidv4 } from 'uuid'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('lobby') // lobby | game | gameover
  const [isHost, setIsHost] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [myPlayer, setMyPlayer] = useState(null)
  const [players, setPlayers] = useState([]) // Array of { id, name, seat, isHost }
  const playersRef = useRef([]) // Ref to access latest players in callbacks

  const updatePlayers = (newPlayers) => {
    setPlayers(newPlayers)
    playersRef.current = newPlayers
  }

  const peerRef = useRef(null)
  const connectionsRef = useRef({}) // Store connections to other peers

  // Initialize PeerJS
  const initializePeer = (id) => {
    if (peerRef.current) peerRef.current.destroy()

    // Prefix ID to avoid collisions with random users
    const cleanId = id.replace(/[^a-zA-Z0-9-]/g, '')
    const peer = new Peer(cleanId)
    peerRef.current = peer

    peer.on('open', (peerId) => {
      console.log('My ID:', peerId)
      // If host, we are ready. If client, time to connect to host.
    })

    peer.on('connection', (conn) => {
      handleIncomingConnection(conn)
    })

    peer.on('error', (err) => {
      console.error(err)
      alert('Peer Connection Error: ' + err.type)
    })
  }

  // HOST LOGIC
  const createRoom = (playerName) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setRoomCode(code)
    setIsHost(true)

    // Create Host ID: okey101-[CODE]
    const hostId = `okey101-${code}`
    initializePeer(hostId)

    const hostPlayer = {
      id: hostId,
      name: playerName,
      seat: 0,
      isHost: true
    }
    setMyPlayer(hostPlayer)
    updatePlayers([hostPlayer])
  }

  const handleIncomingConnection = (conn) => {
    // Only Host should receive unexpected connections in this simple model (or peer-to-peer later)
    conn.on('open', () => {
      console.log('New connection:', conn.peer)
      connectionsRef.current[conn.peer] = conn

      // Wait for JOIN_REQUEST
      conn.on('data', (data) => {
        if (data.type === 'JOIN_REQUEST') {
          handleJoinRequest(conn, data.payload)
        }
      })
    })
  }


  const handleJoinRequest = (conn, { name }) => {
    const currentPlayers = playersRef.current;

    // Check if room is full
    if (currentPlayers.length >= 4) {
      conn.send({ type: 'ERROR', message: 'Room is full' })
      return
    }

    // Check if player already exists (re-join)
    if (currentPlayers.find(p => p.id === conn.peer)) {
      return;
    }

    const newPlayer = {
      id: conn.peer,
      name,
      seat: currentPlayers.length, // Simple auto-seat for now
      isHost: false
    }

    const updatedPlayers = [...currentPlayers, newPlayer]
    updatePlayers(updatedPlayers)

    // Broadcast update to ALL (including new player)
    broadcastPlayers(updatedPlayers)
  }

  // CLIENT LOGIC
  const joinRoom = (code, playerName) => {
    const clientId = `player-${uuidv4().slice(0, 8)}`
    initializePeer(clientId)
    setRoomCode(code)

    // Delay slighty to ensure peer is open
    setTimeout(() => {
      if (!peerRef.current) return

      const hostId = `okey101-${code}`
      console.log('Connecting to Host:', hostId)
      const conn = peerRef.current.connect(hostId)

      conn.on('open', () => {
        console.log('Connected to Host')
        conn.send({
          type: 'JOIN_REQUEST',
          payload: { name: playerName }
        })
      })

      conn.on('data', (data) => {
        handleClientData(data)
      })

      conn.on('error', (err) => alert('Connection failed: ' + err))

      setMyPlayer({ id: clientId, name: playerName })
    }, 1000)
  }

  const handleClientData = (data) => {
    if (data.type === 'UPDATE_PLAYERS') {
      updatePlayers(data.payload)
    }
    if (data.type === 'GAME_START') {
      setGameState('game')
    }
  }

  // UTILS
  const broadcastPlayers = (currentPlayers) => {
    // Send to all connected clients
    Object.values(connectionsRef.current).forEach(conn => {
      if (conn.open) {
        conn.send({ type: 'UPDATE_PLAYERS', payload: currentPlayers })
      }
    })
  }

  const startGame = () => {
    setGameState('game')
    // Broadcast start
    Object.values(connectionsRef.current).forEach(conn => {
      conn.send({ type: 'GAME_START' })
    })
  }

  return (
    <div className="App min-h-screen bg-slate-900 text-white font-sans selection:bg-green-500/30">
      {gameState === 'lobby' && (
        <Lobby
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          isHost={isHost}
          players={players}
          roomCode={roomCode}
          onStartGame={startGame}
          myPeerId={myPlayer?.id}
        />
      )}

      {gameState === 'game' && (
        <GameTable
          players={players}
          myPlayer={myPlayer}
        // onAction={handleGameAction}
        />
      )}
    </div>
  )
}


export default App
