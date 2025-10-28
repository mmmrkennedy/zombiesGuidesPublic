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
        <div className="solver-container" style={{ minWidth: '350px' }}>
            <h2>Floppy Disk Puzzle</h2>
            <p>Select 4 symbols in order:</p>
            <div
                id="floppy_solver_symbol_select"
                className="solver-symbol-select"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    maxWidth: '500px',
                }}
            >
                {Array.from({ length: totalSymbols }, (_, i) => (
                    <img key={i} src={`${imagePath}picture_${i}.webp`} alt={`Symbol ${i}`} data-symbol-id={i} className={selectedSymbols.includes(i) ? 'selected' : ''} onClick={() => selectSymbol(i)} style={{ width: '60px', height: '60px' }} />
                ))}
            </div>
            <div className="solver-output">
                <p id="floppy_solver_code">{getMessage()}</p>
                <div id="floppy_result">
                    {resultImages.map(id => (
                        <img key={id} src={`${imagePath}picture_${id}.webp`} alt={`Symbol ${id}`} style={{ width: '60px', height: '60px', margin: '5px' }} />
                    ))}
                </div>
            </div>
            <button className="btn-base solver-button" onClick={resetAll}>
                Reset
            </button>
        </div>
    );
}
