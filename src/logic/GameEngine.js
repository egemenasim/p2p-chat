import _ from 'lodash';

// Constants
export const COLORS = ['red', 'black', 'blue', 'yellow'];
export const MIN_OPEN_POINTS = 101;
export const MIN_PAIRS = 5;

export class Tile {
    constructor(id, color, number, isFakeJoker = false) {
        this.id = id;
        this.color = color; // 'red', 'black', 'blue', 'yellow', or 'joker'
        this.number = number; // 1-13 (or null for joker)
        this.isFakeJoker = isFakeJoker;
    }
}

export const createDeck = () => {
    let tiles = [];
    let idCounter = 1;

    // 2 sets of each color 1-13
    COLORS.forEach(color => {
        for (let i = 1; i <= 13; i++) {
            tiles.push(new Tile(idCounter++, color, i));
            tiles.push(new Tile(idCounter++, color, i));
        }
    });

    // 2 Fake Jokers (will be assigned value based on real joker)
    tiles.push(new Tile(idCounter++, 'fake_joker', null, true));
    tiles.push(new Tile(idCounter++, 'fake_joker', null, true));

    return _.shuffle(tiles);
};

export const determineJoker = (openTile) => {
    if (openTile.isFakeJoker) {
        // Edge case if open tile is fake joker (rare rule variations, usually re-draw, but let's assume standard)
        return { color: 'red', number: 1 }; // Fallback
    }

    if (openTile.number === 13) {
        return { color: openTile.color, number: 1 };
    }

    return { color: openTile.color, number: openTile.number + 1 };
};

// Returns total points of a valid group, or 0 if invalid
export const validateGroup = (group, jokerTile) => {
    if (group.length < 3) return 0;

    // Substitute Joker with actual values for validation
    // This is complex because a joker could be ANY tile.
    // For MVP, simplistic validation:
    // 1. Check if it's a "Set" (Same Number, Different Colors)
    // 2. Check if it's a "Run" (Same Color, Sequential Numbers)

    let isSet = true;
    let isRun = true;

    // Pre-process: Identify non-joker tiles
    const nonJokers = group.filter(t => !isJoker(t, jokerTile));

    if (nonJokers.length === 0) return calculatePoints(group); // All jokers? Valid & High points theoretically

    // CHECK FOR SET (Same Number)
    const baseNumber = nonJokers[0].number;
    const colorsSeen = new Set();

    for (let t of nonJokers) {
        if (t.number !== baseNumber) isSet = false;
        if (colorsSeen.has(t.color)) isSet = false; // Cannot have same color twice in a Set
        colorsSeen.add(t.color);
    }
    // Max 4 tiles in a set (4 colors)
    if (group.length > 4) isSet = false;


    // CHECK FOR RUN (Same Color, Sequential)
    const baseColor = nonJokers[0].color;
    for (let t of nonJokers) {
        if (t.color !== baseColor) isRun = false;
    }

    if (isRun) {
        // Sort logic needed handling jokers... 
        // Simplified: check gaps.
        // This is hard without resolving jokers to specific positions.
        // Strategy: Sort non-jokers. Check gaps. Count available jokers to fill gaps.
        const sorted = [...nonJokers].sort((a, b) => a.number - b.number);
        let jokersNeeded = 0;

        // Check for 13-1 wrap (Okey 101 rule: 12-13-1 is valid)
        // Actually standard Okey is 11-12-13-1. 

        for (let i = 0; i < sorted.length - 1; i++) {
            let gap = sorted[i + 1].number - sorted[i].number;
            if (gap < 1) isRun = false; // Duplicate number
            jokersNeeded += (gap - 1);
        }
    }

    if (isSet || (isRun && isSet === false)) { // Prioritize logic
        return calculatePoints(group);
    }

    return 0;
}

const isJoker = (tile, jokerTile) => {
    return tile.color === jokerTile.color && tile.number === jokerTile.number;
}

export const calculatePoints = (tiles) => {
    return tiles.reduce((sum, t) => sum + (t.number || 0), 0);
}
