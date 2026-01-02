import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Lobby = ({ onCreateRoom, onJoinRoom, isHost, players, roomCode, onStartGame, myPeerId }) => {
    const [joinCode, setJoinCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [step, setStep] = useState('name'); // name -> action -> lobby

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (playerName.trim()) {
            setStep('action');
        }
    };

    const handleCreate = () => {
        onCreateRoom(playerName);
        setStep('lobby');
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (joinCode.length === 4) {
            onJoinRoom(joinCode, playerName);
            setStep('lobby');
        }
    };

    if (step === 'name') {
        return (
            <div className="glass-panel max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-6">101 Okey P2P</h1>
                <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full"
                        maxLength={12}
                        autoFocus
                    />
                    <button type="submit" disabled={!playerName} className="btn-primary">
                        Continue
                    </button>
                </form>
            </div>
        );
    }

    if (step === 'action') {
        return (
            <div className="glass-panel max-w-md mx-auto">
                <h1 className="text-2xl mb-2">Welcome, {playerName}</h1>
                <div className="flex flex-col gap-4">
                    <button onClick={handleCreate} className="btn-primary py-4 text-xl">
                        Create New Room
                    </button>

                    <div className="flex items-center gap-2 my-2">
                        <div className="h-px bg-white/20 flex-1"></div>
                        <span className="text-white/50">OR</span>
                        <div className="h-px bg-white/20 flex-1"></div>
                    </div>

                    <form onSubmit={handleJoin} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Room Code (4 digits)"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="flex-1 text-center tracking-widest text-xl"
                        />
                        <button type="submit" disabled={joinCode.length !== 4} className="btn-secondary">
                            Join
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Waiting Lobby View
    return (
        <div className="glass-panel w-full max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-yellow-400 mb-2">Room Code: {roomCode}</h2>
                    <p className="text-white/60">Share this code with your friends</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-white/40">Status</div>
                    <div className="text-xl text-green-400 font-bold">Waiting for players...</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
                {/* Render 4 Seats */}
                {[0, 1, 2, 3].map((seatIndex) => {
                    const player = players.find(p => p.seat === seatIndex);
                    return (
                        <motion.div
                            key={seatIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`
                aspect-video rounded-xl border-2 flex flex-col items-center justify-center p-4 relative
                ${player ? 'border-green-500/50 bg-green-500/10' : 'border-dashed border-white/20'}
              `}
                        >
                            {player ? (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-2 flex items-center justify-center text-2xl font-bold">
                                        {player.name[0].toUpperCase()}
                                    </div>
                                    <h3 className="text-xl font-bold">{player.name}</h3>
                                    {player.isHost && <span className="absolute top-2 right-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">HOST</span>}
                                </>
                            ) : (
                                <div className="text-white/30 text-center">
                                    <div className="text-4xl mb-2">+</div>
                                    <div>Empty Seat</div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {isHost && (
                <div className="flex justify-center">
                    <button
                        onClick={onStartGame}
                        disabled={players.length < 4} // Strict 4 player rule for Okey 101 usually
                        className={`
              text-xl px-12 py-4 rounded-full font-bold transition-all
              ${players.length === 4
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 shadow-lg shadow-green-500/30'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
                    >
                        {players.length === 4 ? 'START GAME' : `Waiting for players (${players.length}/4)`}
                    </button>
                </div>
            )}

            {!isHost && (
                <div className="text-center text-white/50 animate-pulse">
                    Waiting for host to start the game...
                </div>
            )}
        </div>
    );
};

export default Lobby;
