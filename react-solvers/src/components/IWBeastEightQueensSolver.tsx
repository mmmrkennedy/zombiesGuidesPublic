import React from 'react';

const solution_cords_queens: number[][][] = [
    [
        [0, 0],
        [1, 4],
        [2, 7],
        [3, 5],
        [4, 2],
        [5, 6],
        [6, 1],
        [7, 3],
    ], // 1
    [
        [0, 0],
        [1, 5],
        [2, 7],
        [3, 2],
        [4, 6],
        [5, 3],
        [6, 1],
        [7, 4],
    ], // 2
    [
        [0, 1],
        [1, 3],
        [2, 5],
        [3, 7],
        [4, 2],
        [5, 0],
        [6, 6],
        [7, 4],
    ], // 3
    [
        [0, 1],
        [1, 4],
        [2, 6],
        [3, 0],
        [4, 2],
        [5, 7],
        [6, 5],
        [7, 3],
    ], // 4
    [
        [0, 1],
        [1, 4],
        [2, 6],
        [3, 3],
        [4, 0],
        [5, 7],
        [6, 5],
        [7, 2],
    ], // 5
    [
        [0, 1],
        [1, 5],
        [2, 0],
        [3, 6],
        [4, 3],
        [5, 7],
        [6, 2],
        [7, 4],
    ], // 6
    [
        [0, 1],
        [1, 5],
        [2, 7],
        [3, 2],
        [4, 0],
        [5, 3],
        [6, 6],
        [7, 4],
    ], // 7
    [
        [0, 1],
        [1, 6],
        [2, 2],
        [3, 5],
        [4, 7],
        [5, 4],
        [6, 0],
        [7, 3],
    ], // 8
    [
        [0, 1],
        [1, 6],
        [2, 4],
        [3, 7],
        [4, 0],
        [5, 3],
        [6, 5],
        [7, 2],
    ], // 9
    [
        [0, 2],
        [1, 4],
        [2, 7],
        [3, 3],
        [4, 0],
        [5, 6],
        [6, 1],
        [7, 5],
    ], // 10
    [
        [0, 2],
        [1, 5],
        [2, 1],
        [3, 4],
        [4, 7],
        [5, 0],
        [6, 6],
        [7, 3],
    ], // 11
    [
        [0, 2],
        [1, 4],
        [2, 1],
        [3, 7],
        [4, 0],
        [5, 6],
        [6, 3],
        [7, 5],
    ], // 12
];
const solutions_queens: boolean[][][] = solution_cords_queens.map(coords => create2DArray(coords));

function create2DArray(coords: number[][], size = 8): boolean[][] {
    // Initialize an 8x8 2D array with false values
    const array = Array.from({ length: size }, () => Array(size).fill(false));

    // Mark the positions given in coords as true
    coords.forEach(([x, y]) => {
        array[x][y] = true;
    });

    return array;
}

function rotate2DArrayToRight(array: boolean[][]): boolean[][] {
    const size = array.length;
    const rotated = Array.from({ length: size }, () => Array(size).fill(false));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            rotated[j][size - 1 - i] = array[i][j];
        }
    }

    return rotated;
}

function flip2DArray(array: boolean[][], direction: string): boolean[][] {
    const size = array.length;
    const flipped = Array.from({ length: size }, () => Array(size).fill(false));

    if (direction === 'horizontal') {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                flipped[i][size - 1 - j] = array[i][j];
            }
        }
    } else if (direction === 'vertical') {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                flipped[size - 1 - i][j] = array[i][j];
            }
        }
    }

    return flipped;
}

function find_valid_sol(starting_queen_cords: number[]) {
    const starting_x = starting_queen_cords[0];
    const starting_y = starting_queen_cords[1];

    const flipped_options = ['vertical', 'horizontal'];

    for (let i = 0; i < solutions_queens.length; i++) {
        let solution: boolean[][] = solutions_queens[i];

        for (let j = 0; j < 4; j++) {
            if (solution[starting_y][starting_x] === true) {
                // console.log(`Found Solution at i: ${i}, Rotation ${j}, starting_x: ${starting_x}, starting_y: ${starting_y}`);
                return solution;
            }

            for (let k = 0; k < flipped_options.length; k++) {
                const solution_flipped = flip2DArray(solution, flipped_options[k]);

                if (solution_flipped[starting_y][starting_x] === true) {
                    // console.log(`Found Solution at i: ${i}, Rotation ${j}, Flipped ${flipped_options[k]}, starting_x: ${starting_x}, starting_y: ${starting_y}`);
                    return solution_flipped;
                }
            }

            solution = rotate2DArrayToRight(solution);
        }
    }

    return null;
}

export default function IWBeastEightQueensSolver() {
    const [queenLocation, setQueenLocation] = React.useState<number[]>([0, 0]);
    const [solution, setSolution] = React.useState<boolean[][] | null>(null);
    const [message, setMessage] = React.useState<string>('Click a square to move the Queen.');
    const [isMovementEnabled, setIsMovementEnabled] = React.useState<boolean>(true);

    const generateChessboard = () => {
        const squares = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isWhite = (row + col) % 2 === 0;
                const hasQueen = solution ? solution[row][col] : row === queenLocation[0] && col === queenLocation[1];

                squares.push(<div key={`queen-square-${row}-${col}`} id={`queen-square-${row}-${col}`} className={`${isWhite ? 'white-board' : 'black-board'}${hasQueen ? ' queen' : ''}`} onClick={() => handleSquareClick(row, col)} />);
            }
        }

        return squares;
    };

    const handleSquareClick = (row: number, col: number) => {
        if (isMovementEnabled) {
            setQueenLocation([row, col]);
        }
    };

    const handleSolve = () => {
        const [y, x] = queenLocation;
        const sol = find_valid_sol([x, y]);

        if (sol === null) {
            setMessage('No solution found.');
            return;
        }

        setSolution(sol);
        setIsMovementEnabled(false);
        setMessage('Solution found!');
    };

    const handleReset = () => {
        setSolution(null);
        setQueenLocation([0, 0]);
        setIsMovementEnabled(true);
        setMessage('Click a square to move the Queen.');
    };

    return (
        <div className="solver-container">
            <h2>Eight Queens Puzzle</h2>
            <p id="queens-explain">{message}</p>
            <div className="chessboard">{generateChessboard()}</div>
            <div>
                <button className="btn-base solver-button" onClick={handleSolve} disabled={!isMovementEnabled}>
                    Solve
                </button>
                <button className="btn-base solver-button" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
}
