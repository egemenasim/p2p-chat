import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import { createDeck, determineJoker } from '../logic/GameEngine';
import _ from 'lodash';

const GameTable = ({ players, myPlayer, onAction, gameState }) => {
    // Simplified mock state for MVP
    const [deck, setDeck] = useState([]);
    const [hand, setHand] = useState([]);
    const [joker, setJoker] = useState(null);
    const [openSets, setOpenSets] = useState([]); // Array of { playerId, sets: [[tile, tile...], ...] }

    useEffect(() => {
        // Only Host deals initial cards
        if (myPlayer.isHost && deck.length === 0) {
            const newDeck = createDeck();
            // Deal logic (21 to normal, 22 to dealer/host)
            // Reveal Joker
            // Mock deal for MVP:
            const myHand = newDeck.splice(0, 21);
            const openTile = newDeck.pop();
            setJoker(determineJoker(openTile));
            setHand(myHand.sort((a, b) => a.number - b.number));
            setDeck(newDeck);
        }
    }, []);

    return (
        <div className="w-full h-screen bg-[#2d5a27] relative overflow-hidden flex flex-col justify-between p-4">

            {/* Top Player (Opponent) */}
            <div className="flex justify-center">
                <div className="bg-black/30 p-2 rounded-xl text-white">
                    <div className="text-center font-bold">Player 2</div>
                    <div className="flex gap-1 justify-center">
                        {[...Array(21)].map((_, i) => (
                            <div key={i} className="w-8 h-12 bg-gray-300 rounded border border-gray-400"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center Table */}
            <div className="flex-1 flex justify-center items-center relative">
                {/* Deck */}
                <div className="absolute center bg-black/20 p-4 rounded-xl flex gap-8">
                    <div className="text-center">
                        <div className="w-10 h-14 bg-blue-800 rounded border-2 border-white shadow-xl cursor-pointer">
                            <div className="h-full flex items-center justify-center text-white font-bold text-xl">
                                {deck.length}
                            </div>
                        </div>
                        <span className="text-white text-xs font-bold mt-1 block">DRAW</span>
                    </div>

                    {/* Indicator / Joker */}
                    <div className="text-center">
                        <div className="scale-110 transform rotate-12">
                            {joker && <Tile tile={{ ...joker, isFakeJoker: false }} isJoker={true} />}
                        </div>
                        <span className="text-white text-xs font-bold mt-1 block text-yellow-400">INDICATOR</span>
                    </div>
                </div>
            </div>

            {/* My Hand (Bottom) */}
            <div className="w-full bg-black/40 p-4 rounded-t-3xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {myPlayer.name} <span className="text-sm font-normal opacity-70">(You)</span>
                    </h2>
                    <div className="flex gap-2">
                        <button className="btn-secondary text-sm py-1">Sort Colors</button>
                        <button className="btn-secondary text-sm py-1">Sort Numbers</button>
                        <button className="btn-primary text-sm py-1">Open Hand</button>
                    </div>
                </div>

                {/* Rack (Double Layer) */}
                <div className="flex flex-col gap-2 overflow-x-auto pb-2">
                    <div className="flex gap-1 min-w-max h-16 items-center px-4 bg-[#3d2a1e] rounded-lg shadow-inner">
                        {hand.slice(0, 11).map((tile, i) => (
                            <Tile key={tile.id} tile={tile} isJoker={joker && tile.color === joker.color && tile.number === joker.number} />
                        ))}
                    </div>
                    <div className="flex gap-1 min-w-max h-16 items-center px-4 bg-[#3d2a1e] rounded-lg shadow-inner">
                        {hand.slice(11).map((tile, i) => (
                            <Tile key={tile.id} tile={tile} isJoker={joker && tile.color === joker.color && tile.number === joker.number} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameTable;
