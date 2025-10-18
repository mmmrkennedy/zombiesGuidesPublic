import React from 'react';

type WallID = 'wall1' | 'wall2' | 'wall3' | 'wall4';
type StatueIndex = 0 | 1 | 2 | 3;
type RotationValue = 0 | 1 | 2 | 3;
type PuzzleID = 0 | 1 | 2 | 3;
type RotationList = [RotationValue, RotationValue, RotationValue, RotationValue];

// Constants
const DIRECTION_SYMBOLS: string[] = ['↑', '→', '↓', '←'];
const STATUE_LABELS: string[] = ['A', 'B', 'C', 'D'];
const PUZZLE_OFFSETS: number[][] = [
    [1, 1, 1],
    [1, 2, 1, 1],
    [2, 1, 1, 2],
    [1, 3, 1, 2],
];

function adjustStatueDirection(directions: RotationList, offsets: number[], statueIndex: StatueIndex): RotationList {
    const newDirections: RotationList = [...directions];
    newDirections[statueIndex] = ((newDirections[statueIndex] + offsets[statueIndex]) % 4) as RotationValue;
    return newDirections;
}

function adjustStatueAndNeighbors3(directions: RotationList, offsets: number[], statueIndex: StatueIndex) {
    let newDirections: RotationList = [...directions];
    if (statueIndex > 0) {
        newDirections = adjustStatueDirection(newDirections, offsets, (statueIndex - 1) as RotationValue);
    }
    newDirections = adjustStatueDirection(newDirections, offsets, statueIndex);
    if (statueIndex < 2) {
        newDirections = adjustStatueDirection(newDirections, offsets, (statueIndex + 1) as RotationValue);
    }
    return newDirections;
}

function adjustStatueAndNeighbors4(directions: RotationList, offsets: number[], statueIndex: StatueIndex) {
    let newDirections: RotationList = [...directions];
    if (statueIndex > 0) {
        newDirections = adjustStatueDirection(newDirections, offsets, (statueIndex - 1) as RotationValue);
    }
    newDirections = adjustStatueDirection(newDirections, offsets, statueIndex);
    if (statueIndex < 3) {
        newDirections = adjustStatueDirection(newDirections, offsets, (statueIndex + 1) as RotationValue);
    }
    return newDirections;
}

function get_num_needed_rotations(direction: number, offset: number): number {
    let rotations = 0;
    while ((offset * rotations + direction) % 4 !== 2) {
        rotations++;
        if (rotations > 5) {
            rotations = -1;
            break;
        }
    }
    return rotations;
}

function solvePuzzle(directions: RotationList, puzzleID: PuzzleID) {
    const offsets = PUZZLE_OFFSETS[puzzleID - 1];
    let workingDirections: RotationList = [...directions];
    let isValid = true;
    let invalidStatueLabel = '';
    let result = '';

    // Validate input directions
    for (let i = 0; i < workingDirections.length; i++) {
        if (offsets[i] === 2 && (workingDirections[i] === 1 || workingDirections[i] === 3)) {
            isValid = false;
            invalidStatueLabel = STATUE_LABELS[i];
        }
    }

    if (!isValid) return `Invalid Input! (Check Statue ${invalidStatueLabel})`;

    if (puzzleID === 1) {
        let turnsA = 0;
        while (workingDirections[1] !== workingDirections[2]) {
            workingDirections = adjustStatueAndNeighbors3(workingDirections, offsets, 0);
            turnsA++;
            if (turnsA > 30) return `Unable to solve, check if statues are correct (Debug: Failed with puzzleID: ${puzzleID} and on Statue A)`;
        }
        if (turnsA > 0) result += `Turn statue A ${turnsA}x\n`;

        let turnsC = 0;
        while (workingDirections[0] !== workingDirections[1]) {
            workingDirections = adjustStatueAndNeighbors3(workingDirections, offsets, 2);
            turnsC++;
            if (turnsC > 30) return `Unable to solve, check if statues are correct (Debug: Failed with puzzleID: ${puzzleID} and on Statue C)`;
        }
        if (turnsC > 0) result += `Turn statue C ${turnsC}x\n`;

        let turnsB = 0;
        while (workingDirections[1] !== 2) {
            workingDirections = adjustStatueAndNeighbors3(workingDirections, offsets, 1);
            turnsB++;
            if (turnsB > 30) {
                return `Unable to solve, check if statues are correct (Debug: Failed with puzzleID: ${puzzleID} and on Statue B)`;
            }
        }
        if (turnsB > 0) result += `Turn statue B ${turnsB}x\n`;
    } else {
        let turnsC = 0;
        let neededRotations0 = get_num_needed_rotations(workingDirections[0], offsets[0]);
        let neededRotations1 = get_num_needed_rotations(workingDirections[1], offsets[1]);

        while (neededRotations0 !== neededRotations1) {
            if (neededRotations0 !== neededRotations1 && ((offsets[0] === 2 && neededRotations1 % 2 === neededRotations0) || (offsets[1] === 2 && neededRotations0 % 2 === neededRotations1))) {
                break;
            } else {
                workingDirections = adjustStatueAndNeighbors4(workingDirections, offsets, 2);
                turnsC++;
                neededRotations0 = get_num_needed_rotations(workingDirections[0], offsets[0]);
                neededRotations1 = get_num_needed_rotations(workingDirections[1], offsets[1]);
            }
        }
        if (turnsC > 0) result += `Turn statue C ${turnsC}x\n`;

        let turnsB = 0;
        let neededRotations2 = get_num_needed_rotations(workingDirections[2], offsets[2]);
        let neededRotations3 = get_num_needed_rotations(workingDirections[3], offsets[3]);

        while (neededRotations2 !== neededRotations3) {
            if (neededRotations2 !== neededRotations3 && ((offsets[2] === 2 && neededRotations3 % 2 === neededRotations2) || (offsets[3] === 2 && neededRotations2 % 2 === neededRotations3))) {
                break;
            } else {
                workingDirections = adjustStatueAndNeighbors4(workingDirections, offsets, 1);
                turnsB++;
                neededRotations2 = get_num_needed_rotations(workingDirections[2], offsets[2]);
                neededRotations3 = get_num_needed_rotations(workingDirections[3], offsets[3]);
            }
        }
        if (turnsB > 0) result += `Turn statue B ${turnsB}x\n`;

        let turnsA = 0;
        while (workingDirections[0] !== 2 || workingDirections[1] !== 2) {
            workingDirections = adjustStatueAndNeighbors4(workingDirections, offsets, 0);
            turnsA++;
        }
        if (turnsA > 0) result += `Turn statue A ${turnsA}x\n`;

        let turnsD = 0;
        while (workingDirections[2] !== 2 || workingDirections[3] !== 2) {
            workingDirections = adjustStatueAndNeighbors4(workingDirections, offsets, 3);
            turnsD++;
        }
        if (turnsD > 0) result += `Turn statue D ${turnsD}x\n`;
    }

    if (result.length === 0) {
        result = 'Puzzle Solved!';
    } else {
        result = result.slice(0, -1);
    }
    return result;
}

// Main React Component
export default function WW2StatueSolver() {
    const [activeWall, setActiveWall] = React.useState<WallID>('wall1');
    const [directions, setDirections] = React.useState<RotationList>([2, 2, 2, 2]);
    const [result, setResult] = React.useState<string>('');

    function handleWallClick(wallId: WallID) {
        setActiveWall(wallId);
    }

    function handleStatueClick(statueIndex: StatueIndex) {
        const newDirections: RotationList = [...directions];
        newDirections[statueIndex] = ((newDirections[statueIndex] + 1) % 4) as RotationValue;
        setDirections(newDirections);
    }

    function handleSolve() {
        const puzzleID = Number(activeWall.replace('wall', '')) as PuzzleID;
        const solutionText = solvePuzzle([...directions], puzzleID);
        setResult(solutionText);
    }

    return (
        <div className="solver-container">
            <h2>Select Which Wall</h2>
            <div>
                <button className={activeWall === 'wall1' ? 'solver-button active' : 'solver-button'} onClick={() => handleWallClick('wall1')}>
                    Wall 1
                </button>
                <button className={activeWall === 'wall2' ? 'solver-button active' : 'solver-button'} onClick={() => handleWallClick('wall2')}>
                    Wall 2
                </button>
                <button className={activeWall === 'wall3' ? 'solver-button active' : 'solver-button'} onClick={() => handleWallClick('wall3')}>
                    Wall 3
                </button>
                <button className={activeWall === 'wall4' ? 'solver-button active' : 'solver-button'} onClick={() => handleWallClick('wall4')}>
                    Wall 4
                </button>
            </div>

            <h3>Statue Positions (click to change)</h3>
            <div className="aligned-buttons">
                <button className="aligned-button solver-button" onClick={() => handleStatueClick(0)}>
                    {DIRECTION_SYMBOLS[directions[0]]}
                </button>
                <button className="aligned-button solver-button" onClick={() => handleStatueClick(1)}>
                    {DIRECTION_SYMBOLS[directions[1]]}
                </button>
                <button className="aligned-button solver-button" onClick={() => handleStatueClick(2)}>
                    {DIRECTION_SYMBOLS[directions[2]]}
                </button>

                {activeWall !== 'wall1' && (
                    <button className="aligned-button solver-button" onClick={() => handleStatueClick(3)}>
                        {DIRECTION_SYMBOLS[directions[3]]}
                    </button>
                )}
            </div>

            <div className="aligned-labels">
                <span className="aligned-label">A</span> <span className="aligned-label">B</span> <span className="aligned-label">C</span> {activeWall !== 'wall1' && <span className="aligned-label">D</span>}
            </div>

            <button className="solver-button" onClick={handleSolve}>
                Solve!
            </button>

            <div className="solver-output">
                <p>
                    {result.split('\n').map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}
