// Constants and Initial Data
const DIRECTION_SYMBOLS = ['↓', '←', '↑', '→'];
const LABELS = ['A', 'B', 'C', 'D'];

// State variables
let currDirections = [1, 1, 1, 1];
let turnCounts = [0, 0, 0, 0];
let shootCounts = [0, 0, 0, 0];

// Helper Functions
function doTurn(id) {
    /**
     * Perform a puzzle-accurate turn on a given id block and other surrounding blocks (if applicable)
     */
    shootCounts[id]++;
    if (id > 0) { // Turn the block above if not the top one
        turn(id - 1);
    }
    turn(id); // Turn the current block
    turn(id); // Turn the current block again
    if (id < 3) { // Turn the block below if not the bottom one
        turn(id + 1);
    }
}

function turn(id) {
    /**
     * Updates the block's direction according to the new sequence.
     * A turn increments the direction in a clockwise order.
     */
    currDirections[id] = (currDirections[id] + 1) % 4; // Ensure wrap-around
    turnCounts[id]++;
}

function normalizeOffset(offset) {
    /**
     * Normalize offset to always be positive (0–3)
     */
    return (offset + 4) % 4;
}

function solve() {
    /**
     * Solve the puzzle for a given configuration.
     */
    turnCounts = [0, 0, 0, 0];
    shootCounts = [0, 0, 0, 0];

    // Solve Top Section
    const ideal0 = (currDirections[1] * 2) % 4; // Calculate the ideal direction for the top
    let offsetA = currDirections[0] - ideal0;
    offsetA = normalizeOffset(offsetA);

    if (offsetA > 0) {
        for (let i = 0; i < offsetA; i++) {
            doTurn(0);
        }
    }

    // Solve Bottom Section
    const ideal3 = (currDirections[2] * 2) % 4; // Calculate the ideal direction for the bottom
    let offsetB = currDirections[2] - ideal3;
    offsetB = normalizeOffset(offsetB);

    if (offsetB > 0) {
        for (let i = 0; i < offsetB; i++) {
            doTurn(3);
        }
    }

    // Rotate Top Section
    let topRotations = currDirections[1] - currDirections[0];
    topRotations = normalizeOffset(topRotations);
    for (let i = 0; i < topRotations; i++) {
        doTurn(0);
    }

    // Rotate Bottom Section
    let botRotations = currDirections[2] - currDirections[3];
    botRotations = normalizeOffset(botRotations);
    for (let i = 0; i < botRotations; i++) {
        doTurn(3);
    }

    // Adjust Halves Alignment
    let halvesOffset = currDirections[2] - currDirections[1];
    halvesOffset = normalizeOffset(halvesOffset);
    if (halvesOffset > 0) {
        for (let i = 0; i < halvesOffset; i++) {
            doTurn(0);
            doTurn(1);
            doTurn(3);
        }
    }

    // Complete Whole Rotations
    const wholeFlips = normalizeOffset(4 - currDirections[0]);
    for (let i = 0; i < wholeFlips; i++) {
        doTurn(0);
        doTurn(0);
        doTurn(1);
        doTurn(2);
        doTurn(3);
        doTurn(3);
    }

    // Display Results
    shootCounts = shootCounts.map(count => count % 4); // Normalize shoot counts to be within 0–3

    const results = [];
    shootCounts.forEach((count, i) => {
        if (count > 0) {
            results.push(`Shoot ${LABELS[i]} ${count}x`);
        }
    });

    if (shootCounts.reduce((a, b) => a + b, 0) === 0) {
        results.push("Puzzle is already solved!");
    }

    return results;
}

function change_directions(index) {
    // Increment the current direction for the given button index
    currDirections[index] = (currDirections[index] + 1) % DIRECTION_SYMBOLS.length;

    // Get the button element
    const button = document.getElementById(`block${String.fromCharCode(65 + index)}`); // Converts 0->A, 1->B, etc.

    // Update the button's text with the new direction
    button.textContent = DIRECTION_SYMBOLS[currDirections[index]];
}

function sync_dirs_to_arrows() {
    // Sync the currDirections values to the current directions of the arrows. Arrow directions take priority.
    const buttons = document.querySelectorAll('.aligned-buttons button');
    for (let i = 0; i < buttons.length; i++) {
        currDirections[i] = DIRECTION_SYMBOLS.indexOf(buttons[i].textContent);
    }
}

function reset_all_directions(saved_dirs) {
    // Reset all directions to the saved state
    const buttons = document.querySelectorAll('.aligned-buttons button');
    for (let i = 0; i < buttons.length; i++) {
        currDirections[i] = saved_dirs[i];
        buttons[i].textContent = DIRECTION_SYMBOLS[currDirections[i]];
    }
}

function main() {
    sync_dirs_to_arrows();

    const resultElement = document.getElementById("result");
    const savedDirections = [...currDirections]; // Save the initial state

    const result = solve();

    resultElement.innerHTML = result.join('<br>');

    reset_all_directions(savedDirections); // Restore the initial state
}


document.addEventListener('DOMContentLoaded', function () {
    sync_dirs_to_arrows();
});

