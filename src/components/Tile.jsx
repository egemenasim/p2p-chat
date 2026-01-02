import React from 'react';

const Tile = ({ tile, isJoker = false }) => {
    if (!tile) return <div className="w-10 h-14 bg-gray-800/20 rounded"></div>;

    const colorMap = {
        'red': 'text-red-600',
        'black': 'text-slate-900',
        'blue': 'text-blue-600',
        'yellow': 'text-yellow-500'
    };

    if (tile.isFakeJoker) {
        return (
            <div className="w-10 h-14 bg-white rounded shadow-md border border-gray-300 flex items-center justify-center font-bold text-gray-500">
                J
            </div>
        );
    }

    return (
        <div className="w-10 h-14 bg-white rounded shadow-md border border-gray-300 flex flex-col items-center justify-center relative select-none cursor-pointer hover:-translate-y-1 transition-transform">
            <span className={`text-2xl font-bold font-mono ${colorMap[tile.color] || 'text-gray-800'}`}>
                {tile.number}
            </span>
            {isJoker && <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />}
        </div>
    );
};

export default Tile;
