// Constants
const DIRECTION_SYMBOLS = ['↑', '→', '↓', '←'];
const STATUE_LABELS = ['A', 'B', 'C', 'D'];
const PUZZLE_OFFSETS = [
    [1, 1, 1],
    [1, 2, 1, 1],
    [2, 1, 1, 2],
    [1, 3, 1, 2]
];

let currentOffsets = [1, 1, 1, 1];
let currentDirections = [0, 0, 0, 0];


function adjustStatueDirection(statueIndex) {
    /**
     * Update the direction of a specific statue based on its offset.
     */
    currentDirections[statueIndex] = (currentDirections[statueIndex] + currentOffsets[statueIndex]) % 4;
}

function adjustStatueAndNeighbors3(statueIndex) {
    /**
     * Adjust the specified statue and its immediate neighbors (3-statue logic).
     */
    if (statueIndex > 0) {
        adjustStatueDirection(statueIndex - 1);
    }
    adjustStatueDirection(statueIndex);
    if (statueIndex < 2) {
        adjustStatueDirection(statueIndex + 1);
    }
}

function adjustStatueAndNeighbors4(statueIndex) {
    /**
     * Adjust the specified statue and its two neighbors on either side (4-statue logic).
     */
    if (statueIndex > 0) {
        adjustStatueDirection(statueIndex - 1);
    }
    adjustStatueDirection(statueIndex);
    if (statueIndex < 3) {
        adjustStatueDirection(statueIndex + 1);
    }
}

function get_num_needed_rotations(direction, offset) {
    let rotations = 0;

    // Calculate how many rotations it takes to reach direction 2 (Down)
    // Formula: (offset * rotations + direction) % 4 checks if we've rotated to Down
    // The % 4 handles the wrapping of directions (0=Up, 1=Right, 2=Down, 3=left)
    while (((offset * rotations) + direction) % 4 !== 2) {
        rotations++;
        // Abort if we need more than 5 rotations - likely impossible with the given offset
        if (rotations > 5) {
            rotations = -1;
            break;
        }
    }

    return rotations;
}

function solvePuzzle(puzzleId) {
    /**
     * Solve the puzzle based on its ID.
     */
    currentOffsets = PUZZLE_OFFSETS[puzzleId - 1];
    let isValid = true;
    let invalidStatueLabel = "";
    let result = "";

    // Validate input directions
    for (let i = 0; i < currentDirections.length; i++) {
        // console.log(`currentOffsets[i]: ${currentOffsets[i]}, currentDirections[i]: ${currentDirections[i]}`)

        // If the spin amount is 2, and the statue is facing left or right (it can never face front)
        if (currentOffsets[i] === 2 && (currentDirections[i] === 1 || currentDirections[i] === 3)) {
            isValid = false;
            invalidStatueLabel = STATUE_LABELS[i];
        }
    }

    if (!isValid) {
        return `Invalid Input! (Check Statue ${invalidStatueLabel})`;
    }

    // Solve the puzzle
    if (puzzleId === 1) {
        let turnsA = 0;
        while (currentDirections[1] !== currentDirections[2]) {
            adjustStatueAndNeighbors3(0); // Adjust statue A
            turnsA++;
            if (turnsA > 200) {
                return `Unable to solve, check if statues are correct (Debug: Failed with puzzleID: ${puzzleId} and on Statue A)`;
            }
        }
        if (turnsA > 0) {
            result += `Turn statue A ${turnsA}x\n`;
        }

        let turnsC = 0;
        while (currentDirections[0] !== currentDirections[1]) {
            adjustStatueAndNeighbors3(2); // Adjust statue C
            turnsC++;
            if (turnsC > 200) {
                return `Unable to solve, check if statues are correct (Debug: Failed with puzzleID: ${puzzleId} and on Statue C)`;
            }
        }
        if (turnsC > 0) result += `Turn statue C ${turnsC}x\n`;

        let turnsB = 0;
        while (currentDirections[1] !== 2) {
            adjustStatueAndNeighbors3(1); // Adjust statue B
            turnsB++;
            if (turnsB > 200) {
                return `Unable to solve, check if statues are correct (Debug: Failed with puzzleID: ${puzzleId} and on Statue B)`;
            }
        }
        if (turnsB > 0) result += `Turn statue B ${turnsB}x\n`;

    } else {
        let turnsC = 0;

        // Calculate how many rotations are needed for the first two statues to reach their goal
        let neededRotations0 = get_num_needed_rotations(currentDirections[0], currentOffsets[0]);
        let neededRotations1 = get_num_needed_rotations(currentDirections[1], currentOffsets[1]);

        // Keep adjusting until both statues need the same number of rotations
        while (neededRotations0 !== neededRotations1) {
            // Break if one statue has 180° rotation and the other's rotations align modulo 2, 
            // because they'll effectively synchronize despite different raw rotation counts
            if ((neededRotations0 !== neededRotations1) &&
                ((currentOffsets[0] === 2 && (neededRotations1 % 2) === neededRotations0) ||
                    (currentOffsets[1] === 2 && (neededRotations0 % 2) === neededRotations1))) {
                break;
            } else {
                // If we can't break out, adjust statue C and recalculate needed rotations
                adjustStatueAndNeighbors4(2); // Adjust statue C which affects statues 0 and 1
                turnsC++;
                neededRotations0 = get_num_needed_rotations(currentDirections[0], currentOffsets[0]);
                neededRotations1 = get_num_needed_rotations(currentDirections[1], currentOffsets[1]);
            }
        }

        if (turnsC > 0) result += `Turn statue C ${turnsC}x\n`;

        let turnsB = 0;

        let neededRotations2 = get_num_needed_rotations(currentDirections[2], currentOffsets[2]);
        let neededRotations3 = get_num_needed_rotations(currentDirections[3], currentOffsets[3]);

        while (neededRotations2 !== neededRotations3) {
            if ((neededRotations2 !== neededRotations3) &&
                ((currentOffsets[2] === 2 && (neededRotations3 % 2) === neededRotations2) ||
                    (currentOffsets[3] === 2 && (neededRotations2 % 2) === neededRotations3))) {
                break;
            } else {
                adjustStatueAndNeighbors4(1); // Adjust statue B
                turnsB++;
                neededRotations2 = get_num_needed_rotations(currentDirections[2], currentOffsets[2]);
                neededRotations3 = get_num_needed_rotations(currentDirections[3], currentOffsets[3]);
            }
        }
        if (turnsB > 0) result += `Turn statue B ${turnsB}x\n`;

        let turnsA = 0;
        while (currentDirections[0] !== 2 || currentDirections[1] !== 2) {
            adjustStatueAndNeighbors4(0); // Adjust statue A
            turnsA++;
        }
        if (turnsA > 0) result += `Turn statue A ${turnsA}x\n`;

        let turnsD = 0;
        while (currentDirections[2] !== 2 || currentDirections[3] !== 2) {
            adjustStatueAndNeighbors4(3); // Adjust statue D
            turnsD++;
        }
        if (turnsD > 0) result += `Turn statue D ${turnsD}x\n`;
    }

    return result;
}

// Function to set the active button
function setActiveButton(activeId) {
    let wall_1_element = document.getElementById("wall1");
    let wall_2_element = document.getElementById("wall2");
    let wall_3_element = document.getElementById("wall3");
    let wall_4_element = document.getElementById("wall4");
    let d_span = document.getElementById("d_span");
    let d_button = document.getElementById("statueD");

    // Reset all buttons
    wall_1_element.classList.remove('active');
    wall_2_element.classList.remove('active');
    wall_3_element.classList.remove('active');
    wall_4_element.classList.remove('active');

    // Set the clicked button as active
    document.getElementById(activeId).classList.add('active');

    if (getActiveWallButton().id !== "wall1") {
        d_span.style.display = "block";
        d_button.style.display = "block";
    } else {
        d_span.style.display = "none";
        d_button.style.display = "none";
    }
}

function getActiveWallButton() {
    // Query only the specific buttons
    return document.querySelector('#wall1.active, #wall2.active, #wall3.active, #wall4.active');
}

function reset_all_directions(saved_dirs) {
    const buttons = document.querySelectorAll('#statueA, #statueB, #statueC, #statueD');

    for (let i = 0; i < buttons.length; i++) {
        currentDirections[i] = saved_dirs[i];

        // Update the button's text with the new direction
        buttons[i].textContent = DIRECTION_SYMBOLS[currentDirections[i]];
    }
}

function change_directions(index) {
    // Increment the current direction for the given button index
    currentDirections[index] = (currentDirections[index] + 1) % DIRECTION_SYMBOLS.length;

    // Get the button element
    const button = document.getElementById(`statue${String.fromCharCode(65 + index)}`); // Converts 0->A, 1->B, etc.

    // Update the button's text with the new direction
    button.textContent = DIRECTION_SYMBOLS[currentDirections[index]];

    // console.log(`Statue ${String.fromCharCode(65 + index)} direction: ${DIRECTION_SYMBOLS[currentDirections[index]]}\nDir Int: ${currentDirections[index]}`);
}

// Example Usage
function main() {
    let active_puzzle_wall;
    let resultElement = document.getElementById("result");
    let result = "";

    try {
        active_puzzle_wall = getActiveWallButton().id
    } catch (error) {
        resultElement.innerHTML = "Error: Select which wall to solve for.";
        return
    }

    let puzzleID = Number(active_puzzle_wall.replace(/wall/i, '').trim());

    let save_directions = [...currentDirections];

    result = solvePuzzle(puzzleID);

    if (result.length === 0) {
        result = "Puzzle already solved!"
    }

    resultElement.innerHTML = result.replace(/\n/g, "<br>");

    reset_all_directions(save_directions);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("wall1").classList.add('active');
    reset_all_directions([2, 2, 2, 2])
});
