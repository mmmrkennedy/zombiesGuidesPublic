import React from 'react';

type Direction = 0 | 1 | 2 | 3;
type BlockId = 0 | 1 | 2 | 3;
type DirectionsArray = [Direction, Direction, Direction, Direction];

const DIRECTION_SYMBOLS: string[] = ['↓', '→', '↑', '←'];
const LABELS: string[] = ['A', 'B', 'C', 'D'];

function shotsToFaceForward(currDirections: DirectionsArray, id: BlockId): number {
    return (4 - currDirections[id]) % 4;
}

function updateDirectionsAfterShots(currDirections: DirectionsArray, targetId: BlockId, shotCount: number): DirectionsArray {
    let newDirections: DirectionsArray = [...currDirections];

    // Update directions based on which block was shot
    if (targetId === 1) {
        // Block B
        // B affects: A, B (double), C
        newDirections[0] = ((currDirections[0] + shotCount) % 4) as Direction; // A
        newDirections[1] = ((currDirections[1] + shotCount * 2) % 4) as Direction; // B
        newDirections[2] = ((currDirections[2] + shotCount) % 4) as Direction; // C
    } else if (targetId === 2) {
        // Block C
        // C affects: B, C (double), D
        newDirections[1] = ((currDirections[1] + shotCount) % 4) as Direction; // B
        newDirections[2] = ((currDirections[2] + shotCount * 2) % 4) as Direction; // C
        newDirections[3] = ((currDirections[3] + shotCount) % 4) as Direction; // D
    } else if (targetId === 3) {
        // Block D
        // D affects: C, D (double)
        newDirections[2] = ((currDirections[2] + shotCount) % 4) as Direction; // C
        newDirections[3] = ((currDirections[3] + shotCount * 2) % 4) as Direction; // D
    }

    return newDirections;
}

function solve_logic(directions: DirectionsArray): number[] {
    let shootCounts: number[] = [0, 0, 0, 0];
    let currDirections: DirectionsArray = [...directions];

    // A: A2, B1
    // B: A1, B2, C1
    // C: B1, C2, D1
    // D: C1, D2

    // Direction reference: 0: Front, 1: Left, 2: Back, 3: Right

    // Step 1: Make blocks A through C face forward in sequence
    // First, make B face A
    const shotsForB = shotsToFaceForward(currDirections, 0);
    shootCounts[1] = shotsForB;
    currDirections = updateDirectionsAfterShots(currDirections, 1, shotsForB);

    // Then, make C face B
    const shotsForC = shotsToFaceForward(currDirections, 1);
    shootCounts[2] = shotsForC;
    currDirections = updateDirectionsAfterShots(currDirections, 2, shotsForC);

    // Finally, make D face C
    const shotsForD = shotsToFaceForward(currDirections, 2);
    shootCounts[3] = shotsForD;
    currDirections = updateDirectionsAfterShots(currDirections, 3, shotsForD);

    // Once all A-C are faced, check three possible D locations
    const block_d_dir = currDirections[3];

    // If block d is facing right
    if (block_d_dir === 1) {
        shootCounts[0] += 1;
        shootCounts[1] += 2;
        shootCounts[2] += 3;
    } else if (block_d_dir === 2) {
        shootCounts[0] += 2;
        shootCounts[2] += 2;
    } else if (block_d_dir === 3) {
        shootCounts[0] += 3;
        shootCounts[1] += 2;
        shootCounts[2] += 1;
    }

    return shootCounts.map(num => num % 4);
}

export default function WW2HammerPuzzleSolver() {
    const [directions, setDirections] = React.useState<DirectionsArray>([0, 0, 0, 0]);
    const [result, setResult] = React.useState<string>('');

    function change_block_dir(block_id: BlockId): void {
        setDirections(prevDirections => {
            const newDirections: DirectionsArray = [...prevDirections];
            newDirections[block_id] = ((newDirections[block_id] + 1) % 4) as Direction;
            return newDirections;
        });
    }

    function solve_blocks(directions: DirectionsArray) {
        let shootCounts: number[] = solve_logic(directions);
        let result: string = '';

        shootCounts.forEach((count, i) => {
            if (count > 0) {
                result += `Shoot ${LABELS[i]} ${count}x\n`;
            }
        });

        if (result.length === 0) {
            result = 'Puzzle is already solved!';
        }

        setResult(result.slice(0, -1));
    }

    return (
        <div className="solver-container lightning_puzzle_container">
            <h3>Block Positions (click to change)</h3>
            <p>
                Up = Facing Away
                <br />
                Down = Facing Front (Solve Direction)
            </p>

            <div className="aligned-buttons vertical">
                <button className="btn-base aligned-button square solver-button" id="blockA" onClick={() => change_block_dir(0)}>
                    {DIRECTION_SYMBOLS[directions[0]]}
                </button>
                <button className="btn-base aligned-button square solver-button" id="blockB" onClick={() => change_block_dir(1)}>
                    {DIRECTION_SYMBOLS[directions[1]]}
                </button>
                <button className="btn-base aligned-button square solver-button" id="blockC" onClick={() => change_block_dir(2)}>
                    {DIRECTION_SYMBOLS[directions[2]]}
                </button>
                <button className="btn-base aligned-button square solver-button" id="blockD" onClick={() => change_block_dir(3)}>
                    {DIRECTION_SYMBOLS[directions[3]]}
                </button>
            </div>

            <button className="btn-base solver-button" id="solve" onClick={() => solve_blocks(directions)}>
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
