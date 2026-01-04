import React, { useState } from 'react';

type Tile = {
    value: number;
    src: string;
};

interface HandResult {
    isWinning: boolean;
    melds: number[][];
    pair: number[] | null;
    errorMessage?: string;
}

const tileImages: Record<number, string> = {
    1: '/games/IW/shaolin_shuffle/mahjong_solver/dot_1.webp',
    2: '/games/IW/shaolin_shuffle/mahjong_solver/dot_2.webp',
    3: '/games/IW/shaolin_shuffle/mahjong_solver/dot_3.webp',
    4: '/games/IW/shaolin_shuffle/mahjong_solver/dot_4.webp',
    5: '/games/IW/shaolin_shuffle/mahjong_solver/dot_5.webp',
};

function calculateHand(selectedTiles: Tile[]): HandResult {
    // Count occurrences of each tile value
    const tileCounts = selectedTiles.reduce(
        (acc, tile) => {
            acc[tile.value] = (acc[tile.value] || 0) + 1;
            return acc;
        },
        {} as Record<number, number>
    );

    const melds: number[][] = [];
    let pair: number[] | null = null;

    // Find triplets and pairs first (prioritize triplets)
    Object.entries(tileCounts).forEach(([value, count]) => {
        const numValue = Number(value);
        if (count >= 3) {
            melds.push([numValue, numValue, numValue]);
            tileCounts[numValue] -= 3; // Remove used tiles from count
        }
        if (count === 2 && !pair) {
            // Only take first pair found
            pair = [numValue, numValue];
            tileCounts[numValue] -= 2; // Remove used tiles from count
        }
    });

    // Find sequences (consecutive runs of 3)
    const sortedValues = Object.keys(tileCounts)
        .map(Number)
        .sort((a, b) => a - b);

    for (let i = 0; i < sortedValues.length - 2; i++) {
        const [a, b, c] = [sortedValues[i], sortedValues[i + 1], sortedValues[i + 2]];
        // Check if we have consecutive values with remaining tiles
        if (tileCounts[a] > 0 && tileCounts[b] > 0 && tileCounts[c] > 0) {
            melds.push([a, b, c]);
            tileCounts[a]--; // Consume one of each tile in sequence
            tileCounts[b]--;
            tileCounts[c]--;
        }
    }

    // Winning hand needs 4 melds + 1 pair (14 tiles total)
    return {
        isWinning: melds.length >= 4 && pair !== null,
        melds,
        pair,
        errorMessage: melds.length < 4 || !pair ? 'Invalid hand' : undefined,
    };
}

export default function IWMahjongSolver() {
    const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
    const [handResult, setHandResult] = useState<HandResult | null>(null);

    // Count how many times each tile value has been selected
    const getTileCount = (value: number): number => {
        return selectedTiles.filter(tile => tile.value === value).length;
    };

    const handleTileClick = (value: number) => {
        if (selectedTiles.length >= 14) return; // Max 14 tiles allowed
        if (getTileCount(value) >= 4) return; // Max 4 of each tile type allowed

        const newTiles = [...selectedTiles, { value, src: tileImages[value] }];
        setSelectedTiles(newTiles);

        // Auto-calculate when we reach 14 tiles
        if (newTiles.length === 14) {
            setHandResult(calculateHand(newTiles));
        }
    };

    const resetSelection = () => {
        setSelectedTiles([]);
        setHandResult(null); // Clear any previous result
    };

    // Helper function to render groups of tiles (melds or pairs)
    const renderTileGroup = (tiles: number[], title: string) => (
        <div>
            <h4>{title}:</h4>
            <div className="meld-group">
                {tiles.map((value, index) => (
                    <img key={index} className="tile-display" src={tileImages[value]} alt={`${value} Dot`} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="solver-container centered">
            <form onSubmit={e => e.preventDefault()}>
                <fieldset>
                    <legend>Mahjong Tile Solver</legend>
                    <p className="solver-instructions">Click on the tiles as they appear in-game. If a valid hand is found, it'll be shown automatically. A valid hand consists of 4 Melds and 1 Pair. A Meld is a group of three or four matching or consecutive tiles, e.g., 3-4-5 or 3-3-3.</p>
                    <div className="solver-symbol-select img" role="group" aria-label="Mahjong tile selection">
                        {[1, 2, 3, 4, 5].map(value => {
                            const isDisabled = getTileCount(value) >= 4;
                            return (
                                <button key={value} type="button" onClick={() => handleTileClick(value)} disabled={isDisabled || selectedTiles.length >= 14} aria-label={`${value} Dot tile${isDisabled ? ' (maximum selected)' : ''}`} className={isDisabled ? 'img-disabled' : ''}>
                                    <img className="shaolin" src={tileImages[value]} alt="" aria-hidden="true" />
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                <button type="button" className="btn-base solver-button" onClick={resetSelection}>
                    Reset
                </button>

                <div className="solver-output solver-output-centered" role="status" aria-live="polite">
                    {/* Show selected tiles while building hand or if hand is invalid */}
                    {(!handResult || !handResult.isWinning) && (
                        <div className="selected-tiles">
                            <h4>
                                {/* Show "Invalid Hand" if we have 14 tiles but invalid, otherwise show count */}
                                {handResult && selectedTiles.length === 14 && !handResult.isWinning ? 'Invalid Hand:' : `Selected Tiles (${selectedTiles.length}/14):`}
                            </h4>
                            <div className="selected-tiles-row">
                                {selectedTiles.map((tile, index) => (
                                    <img key={index} className="selected-tile" src={tile.src} alt={`${tile.value} Dot`} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Display winning hand breakdown */}
                    {handResult?.isWinning && (
                        <div className="winning-hand">
                            <h3>Winning Hand!</h3>
                            <div className="melds">
                                <h4>Melds:</h4>
                                {handResult.melds.map((meld, index) => (
                                    <div key={index} className="meld-group">
                                        {meld.map((value, tileIndex) => (
                                            <img key={tileIndex} className="tile-display" src={tileImages[value]} alt={`${value} Dot`} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {/* Show the pair if one exists */}
                            {handResult.pair && renderTileGroup(handResult.pair, 'Pair')}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
