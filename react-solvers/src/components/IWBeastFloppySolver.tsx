import React from 'react';

function processSymbols(symbols: number[]): number[] {
    // The numbers indicate the corresponding file name number
    const lines = [
        [1, 2, 3, 4, 0, 5],
        [6, 5, 8, 9, 7, 1],
        [9, 10, 7, 8, 6, 1],
        [9, 4, 3, 0, 5, 2],
        [1, 11, 3, 2, 0, 5],
        [4, 11, 0, 2, 5, 8],
    ];

    for (const line of lines) {
        if (symbols.every(n => line.includes(n))) {
            return line.filter(n => symbols.includes(n));
        }
    }

    return [];
}

export default function IWBeastFloppySolver() {
    const [selectedSymbols, setSelectedSymbols] = React.useState<number[]>([]);
    const maxSymbols = 4;
    const totalSymbols = 12;
    const imagePath = '/games/IW/the_beast_from_beyond/floppy_disk_puzzle/pictures/';

    const selectSymbol = (symbolId: number) => {
        if (selectedSymbols.length < maxSymbols && !selectedSymbols.includes(symbolId)) {
            setSelectedSymbols([...selectedSymbols, symbolId]);
        }
    };

    const resetAll = () => {
        setSelectedSymbols([]);
    };

    const getMessage = (): string => {
        if (selectedSymbols.length === maxSymbols) {
            const isDuplicate = new Set(selectedSymbols).size !== selectedSymbols.length;

            if (isDuplicate) {
                return 'Invalid Sequence: Duplicate symbol selected!';
            } else {
                const processedResult = processSymbols(selectedSymbols);
                if (processedResult.length > 0) {
                    return 'Valid Sequence:';
                } else {
                    return 'Invalid Sequence: No matching result!';
                }
            }
        } else {
            return `Selected Symbols: ${selectedSymbols.join(', ')}`;
        }
    };

    const getResultImages = (): number[] => {
        if (selectedSymbols.length === maxSymbols) {
            const isDuplicate = new Set(selectedSymbols).size !== selectedSymbols.length;
            if (!isDuplicate) {
                return processSymbols(selectedSymbols);
            }
        }
        return [];
    };

    const resultImages = getResultImages();

    return (
        <div className="solver-container floppy">
            <p className="solver-instructions">Click the 4 symbols that appear in your game. The solver will validate the sequence and show the correct order if valid.</p>
            <p>Select 4 symbols in any order:</p>
            <div id="floppy_solver_symbol_select" className="solver-symbol-select floppy-grid">
                {Array.from({ length: totalSymbols }, (_, i) => (
                    <img key={i} src={`${imagePath}picture_${i}.webp`} alt={`Symbol ${i}`} data-symbol-id={i} className={`floppy-symbol ${selectedSymbols.includes(i) ? 'selected' : ''}`} onClick={() => selectSymbol(i)} />
                ))}
            </div>
            <div className="solver-output">
                <p id="floppy_solver_code">{getMessage()}</p>
                <div id="floppy_result" className="floppy-result">
                    {resultImages.map(id => (
                        <img key={id} src={`${imagePath}picture_${id}.webp`} alt={`Symbol ${id}`} className="floppy-symbol" />
                    ))}
                </div>
            </div>
            <button className="btn-base solver-button" onClick={resetAll}>
                Reset
            </button>
        </div>
    );
}
