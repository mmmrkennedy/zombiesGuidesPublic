// Constants and Initial Data
const DIRECTION_SYMBOLS = ['↓', '→', '↑', '←'];
const LABELS = ['A', 'B', 'C', 'D'];

// State variables
const currDirections = [0, 0, 0, 0];
let turnCounts = [0, 0, 0, 0];
let shootCounts = [0, 0, 0, 0];

function shotsToFaceForward(id) {
    return (4 - currDirections[id]) % 4;
}

function updateDirectionsAfterShots(targetId, shotCount) {
    // Update directions based on which block was shot
    if (targetId === 1) {
        // Block B
        // B affects: A, B (double), C
        currDirections[0] = (currDirections[0] + shotCount) % 4; // A
        currDirections[1] = (currDirections[1] + shotCount * 2) % 4; // B
        currDirections[2] = (currDirections[2] + shotCount) % 4; // C
    } else if (targetId === 2) {
        // Block C
        // C affects: B, C (double), D
        currDirections[1] = (currDirections[1] + shotCount) % 4; // B
        currDirections[2] = (currDirections[2] + shotCount * 2) % 4; // C
        currDirections[3] = (currDirections[3] + shotCount) % 4; // D
    } else if (targetId === 3) {
        // Block D
        // D affects: C, D (double)
        currDirections[2] = (currDirections[2] + shotCount) % 4; // C
        currDirections[3] = (currDirections[3] + shotCount * 2) % 4; // D
    }
}

function solve() {
    turnCounts = [0, 0, 0, 0];
    shootCounts = [0, 0, 0, 0];

    // A: A2, B1
    // B: A1, B2, C1
    // C: B1, C2, D1
    // D: C1, D2

    // Direction reference: 0: Front, 1: Left, 2: Back, 3: Right

    // Step 1: Make blocks A through C face forward in sequence
    // First, make B face A
    const shotsForB = shotsToFaceForward(0);
    shootCounts[1] = shotsForB;
    updateDirectionsAfterShots(1, shotsForB);

    // Then, make C face B
    const shotsForC = shotsToFaceForward(1);
    shootCounts[2] = shotsForC;
    updateDirectionsAfterShots(2, shotsForC);

    // Finally, make D face C
    const shotsForD = shotsToFaceForward(2);
    shootCounts[3] = shotsForD;
    updateDirectionsAfterShots(3, shotsForD);

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

    shootCounts = shootCounts.map(num => num % 4);

    const results = [];
    shootCounts.forEach((count, i) => {
        if (count > 0) {
            results.push(`Shoot ${LABELS[i]} ${count}x`);
        }
    });

    if (results.length === 0) {
        results.push(`Puzzle is already solved!`);
    }

    return results;
}

function change_directions(index) {
    console.log(`change_directions called with index ${index}`);

    // Increment the current direction for the given button index
    currDirections[index] = (currDirections[index] + 1) % DIRECTION_SYMBOLS.length;

    // Get the button element
    const button = document.getElementById(`block${String.fromCharCode(65 + index)}`); // Converts 0->A, 1->B, etc.

    // Update the button's text with the new direction
    button.textContent = DIRECTION_SYMBOLS[currDirections[index]];
}

function sync_dirs_to_arrows() {
    // Sync the currDirections values to the current directions of the arrows. Arrow directions take priority.
    const buttons = document.querySelectorAll('.aligned-button square solver-button');
    for (let i = 0; i < buttons.length; i++) {
        currDirections[i] = DIRECTION_SYMBOLS.indexOf(buttons[i].textContent[0]);
    }
}

function reset_all_directions(saved_dirs) {
    const dawn_solver_cont = document.querySelectorAll('.lightning_puzzle_container');

    for (let j = 0; j < dawn_solver_cont.length; j++) {
        // Reset all directions to the saved state
        const buttons = dawn_solver_cont[j].querySelectorAll('.aligned-button');
        for (let i = 0; i < buttons.length; i++) {
            currDirections[i] = saved_dirs[i];
            buttons[i].textContent = DIRECTION_SYMBOLS[currDirections[i]];
        }
    }
}

function dawn_solver_init() {
    sync_dirs_to_arrows();

    const resultElement = document.getElementById('result');
    const savedDirections = [...currDirections]; // Save the initial state

    const result = solve();

    resultElement.innerHTML = result.join('<br>');

    reset_all_directions(savedDirections); // Restore the initial state
}

document.addEventListener('DOMContentLoaded', () => {
    sync_dirs_to_arrows();
});
