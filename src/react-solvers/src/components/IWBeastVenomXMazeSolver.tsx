import React, { useRef, useEffect, useState } from 'react';

// Type definitions
interface MazeSolution {
    start: [number, number];
    end: [number, number];
    path: [number, number][];
}

type DraggableType = 'start' | 'end';

interface DraggableState {
    type: DraggableType;
    position: [number, number] | null;
}

// Maze solution data
const mazeSolutionCoordinates: MazeSolution[] = [
    {
        start: [0, 5],
        end: [3, 4],
        path: [
            [0, 5],
            [0, 4],
            [1, 4],
            [1, 5],
            [5, 5],
            [5, 1],
            [4, 1],
            [4, 3],
            [3, 3],
            [3, 4],
        ],
    },
    {
        start: [1, 2],
        end: [4, 4],
        path: [
            [1, 2],
            [2, 2],
            [2, 1],
            [1, 1],
            [1, 0],
            [0, 0],
            [0, 4],
            [1, 4],
            [1, 5],
            [4, 5],
            [4, 4],
        ],
    },
    {
        start: [3, 1],
        end: [0, 4],
        path: [
            [3, 1],
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3],
            [1, 3],
            [1, 4],
            [2, 4],
            [2, 5],
            [0, 5],
            [0, 4],
        ],
    },
    {
        start: [4, 4],
        end: [2, 2],
        path: [
            [4, 4],
            [4, 3],
            [5, 3],
            [5, 0],
            [2, 0],
            [2, 2],
        ],
    },
    {
        start: [0, 4],
        end: [4, 2],
        path: [
            [0, 4],
            [0, 5],
            [1, 5],
            [1, 3],
            [0, 3],
            [0, 0],
            [5, 0],
            [5, 2],
            [4, 2],
        ],
    },
    {
        start: [1, 2],
        end: [5, 3],
        path: [
            [1, 2],
            [0, 2],
            [0, 5],
            [1, 5],
            [1, 3],
            [2, 3],
            [2, 2],
            [3, 2],
            [3, 3],
            [4, 3],
            [4, 4],
            [5, 4],
            [5, 3],
        ],
    },
    {
        start: [1, 1],
        end: [4, 3],
        path: [
            [1, 1],
            [2, 1],
            [2, 2],
            [3, 2],
            [3, 1],
            [4, 1],
            [4, 2],
            [5, 2],
            [5, 5],
            [4, 5],
            [4, 3],
        ],
    },
    {
        start: [3, 2],
        end: [4, 1],
        path: [
            [3, 2],
            [3, 3],
            [2, 3],
            [2, 1],
            [1, 1],
            [1, 2],
            [0, 2],
            [0, 0],
            [4, 0],
            [4, 1],
        ],
    },
    {
        start: [0, 5],
        end: [4, 0],
        path: [
            [0, 5],
            [0, 4],
            [1, 4],
            [1, 2],
            [0, 2],
            [0, 1],
            [2, 1],
            [2, 3],
            [4, 3],
            [4, 0],
        ],
    },
    {
        start: [2, 0],
        end: [2, 3],
        path: [
            [2, 0],
            [0, 0],
            [0, 5],
            [2, 5],
            [2, 4],
            [1, 4],
            [1, 2],
            [3, 2],
            [3, 3],
            [2, 3],
        ],
    },
    {
        start: [4, 5],
        end: [3, 3],
        path: [
            [4, 5],
            [1, 5],
            [1, 4],
            [2, 4],
            [2, 2],
            [3, 2],
            [3, 3],
        ],
    },
    {
        start: [3, 4],
        end: [2, 1],
        path: [
            [3, 4],
            [3, 5],
            [5, 5],
            [5, 1],
            [4, 1],
            [4, 2],
            [2, 2],
            [2, 1],
        ],
    },
    {
        start: [0, 1],
        end: [5, 3],
        path: [
            [0, 1],
            [0, 0],
            [1, 0],
            [1, 1],
            [3, 1],
            [3, 2],
            [2, 2],
            [2, 3],
            [5, 3],
        ],
    },
    {
        start: [1, 4],
        end: [5, 0],
        path: [
            [1, 4],
            [1, 3],
            [2, 3],
            [2, 5],
            [3, 5],
            [3, 3],
            [4, 3],
            [4, 4],
            [5, 4],
            [5, 0],
        ],
    },
    {
        start: [3, 1],
        end: [1, 2],
        path: [
            [3, 1],
            [4, 1],
            [4, 2],
            [5, 2],
            [5, 3],
            [4, 3],
            [4, 4],
            [3, 4],
            [3, 5],
            [2, 5],
            [2, 3],
            [3, 3],
            [3, 2],
            [2, 2],
            [2, 1],
            [1, 1],
            [1, 2],
        ],
    },
];

// Helper function to find solution path
function findSolPath(startCoords: [number, number], endCoords: [number, number]): [number, number][] | null {
    const solution = mazeSolutionCoordinates.find(({ start, end }) => JSON.stringify(start) === JSON.stringify(startCoords) && JSON.stringify(end) === JSON.stringify(endCoords));
    return solution ? solution.path : null;
}

export default function IWBeastVenomXMazeSolver() {
    const [draggables, setDraggables] = useState<DraggableState[]>([
        { type: 'start', position: null },
        { type: 'end', position: null },
    ]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [solutionPath, setSolutionPath] = useState<[number, number][] | null>(null);
    const [draggedItem, setDraggedItem] = useState<DraggableType | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    // Image paths
    const IMG_YELLOW_SQUARE = '/games/IW/the_beast_from_beyond/venom/venom_maze/pictures/yellow_square.webp';
    const IMG_BLUE_DIAMOND = '/games/IW/the_beast_from_beyond/venom/venom_maze/pictures/blue_diamond.webp';

    // Draw path on canvas
    const drawPath = (pathCoords: [number, number][], color = 'blue', width = 10) => {
        const canvas = canvasRef.current;
        const board = boardRef.current;
        if (!canvas || !board) return;

        const boardRect = board.getBoundingClientRect();
        const cellSize = boardRect.width / 6;

        canvas.width = boardRect.width;
        canvas.height = boardRect.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();

        pathCoords.forEach((coord, index) => {
            const x = coord[1] * cellSize + cellSize / 2;
            const y = coord[0] * cellSize + cellSize / 2;
            const padding = 0.4;

            if (index === 0) {
                const nextCoord = pathCoords[1];
                const deltaX = nextCoord[1] - coord[1];
                const deltaY = nextCoord[0] - coord[0];

                if (deltaX > 0) {
                    ctx.moveTo(x + cellSize * padding, y);
                } else if (deltaX < 0) {
                    ctx.moveTo(x - cellSize * padding, y);
                } else if (deltaY > 0) {
                    ctx.moveTo(x, y + cellSize * padding);
                } else if (deltaY < 0) {
                    ctx.moveTo(x, y - cellSize * padding);
                } else {
                    ctx.moveTo(x, y);
                }
            } else if (index === pathCoords.length - 1) {
                const prevCoord = pathCoords[index - 1];
                const deltaX = coord[1] - prevCoord[1];
                const deltaY = coord[0] - prevCoord[0];

                if (deltaX > 0) {
                    ctx.lineTo(x - cellSize * padding, y);
                } else if (deltaX < 0) {
                    ctx.lineTo(x + cellSize * padding, y);
                } else if (deltaY > 0) {
                    ctx.lineTo(x, y - cellSize * padding);
                } else if (deltaY < 0) {
                    ctx.lineTo(x, y + cellSize * padding);
                } else {
                    ctx.lineTo(x, y);
                }
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    };

    // Redraw canvas on window resize
    useEffect(() => {
        const handleResize = () => {
            if (solutionPath) {
                drawPath(solutionPath);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [solutionPath]);

    // Draw solution path when it changes
    useEffect(() => {
        if (solutionPath) {
            drawPath(solutionPath);
        }
    }, [solutionPath]);

    const handleDragStart = (e: React.DragEvent, type: DraggableType) => {
        setDraggedItem(type);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, row: number, col: number) => {
        e.preventDefault();

        if (!draggedItem) return;

        // Check if square is already occupied
        const isOccupied = draggables.some(d => d.position && d.position[0] === row && d.position[1] === col && d.type !== draggedItem);

        if (isOccupied) {
            setErrorMessage('This square is already occupied!');
            return;
        }

        // Update draggable position
        setDraggables(prev => prev.map(d => (d.type === draggedItem ? { ...d, position: [row, col] as [number, number] } : d)));

        setErrorMessage('');
        setDraggedItem(null);
    };

    const handleSolve = () => {
        const startDraggable = draggables.find(d => d.type === 'start');
        const endDraggable = draggables.find(d => d.type === 'end');

        if (!startDraggable?.position || !endDraggable?.position) {
            setErrorMessage('Please place both the Yellow Square and Blue Diamond.');
            return;
        }

        const solPath = findSolPath(startDraggable.position, endDraggable.position);

        if (!solPath) {
            setErrorMessage('No solution found, please try again.');
            setSolutionPath(null);
            return;
        }

        setErrorMessage('');
        setSolutionPath(solPath);
    };

    const handleReset = () => {
        setDraggables([
            { type: 'start', position: null },
            { type: 'end', position: null },
        ]);
        setErrorMessage('');
        setSolutionPath(null);

        // Clear canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const renderBoard = () => {
        const squares = [];

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                const draggable = draggables.find(d => d.position && d.position[0] === row && d.position[1] === col);

                squares.push(
                    <div key={`square-${row}-${col}`} className="green-square" onDragOver={handleDragOver} onDrop={e => handleDrop(e, row, col)}>
                        {draggable && <img className="placed-draggable" src={draggable.type === 'start' ? IMG_YELLOW_SQUARE : IMG_BLUE_DIAMOND} alt={draggable.type === 'start' ? 'Yellow Square' : 'Blue Diamond'} draggable onDragStart={e => handleDragStart(e, draggable.type)} />}
                    </div>
                );
            }
        }

        return squares;
    };

    const renderDraggableContainer = () => {
        return <div className="draggable-container">{draggables.map(d => !d.position && <img key={d.type} className="draggable-image" src={d.type === 'start' ? IMG_YELLOW_SQUARE : IMG_BLUE_DIAMOND} alt={d.type === 'start' ? 'Yellow Square' : 'Blue Diamond'} draggable onDragStart={e => handleDragStart(e, d.type)} />)}</div>;
    };

    return (
        <div className="solver-container">
            <p className="solver-instructions">Drag the Yellow Square and Blue Diamond onto the board where they're on the monitor in-game, then click Solve.</p>
            {renderDraggableContainer()}
            <div className="venom-board-wrapper">
                <div ref={boardRef} className="venom-board">
                    {renderBoard()}
                    <canvas ref={canvasRef} className="venom-board-canvas" />
                </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="solver-buttons">
                <button className="btn-base solver-button" onClick={handleSolve} disabled={!!solutionPath}>
                    Solve
                </button>
                <button className="btn-base solver-button" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
}
