// Input coordinates
const solution_cords_queens = [
    [[0, 0], [1, 4], [2, 7], [3, 5], [4, 2], [5, 6], [6, 1], [7, 3]], // 1
    [[0, 0], [1, 5], [2, 7], [3, 2], [4, 6], [5, 3], [6, 1], [7, 4]], // 2
    [[0, 1], [1, 3], [2, 5], [3, 7], [4, 2], [5, 0], [6, 6], [7, 4]], // 3
    [[0, 1], [1, 4], [2, 6], [3, 0], [4, 2], [5, 7], [6, 5], [7, 3]], // 4
    [[0, 1], [1, 4], [2, 6], [3, 3], [4, 0], [5, 7], [6, 5], [7, 2]], // 5
    [[0, 1], [1, 5], [2, 0], [3, 6], [4, 3], [5, 7], [6, 2], [7, 4]], // 6
    [[0, 1], [1, 5], [2, 7], [3, 2], [4, 0], [5, 3], [6, 6], [7, 4]], // 7
    [[0, 1], [1, 6], [2, 2], [3, 5], [4, 7], [5, 4], [6, 0], [7, 3]], // 8
    [[0, 1], [1, 6], [2, 4], [3, 7], [4, 0], [5, 3], [6, 5], [7, 2]], // 9
    [[0, 2], [1, 4], [2, 7], [3, 3], [4, 0], [5, 6], [6, 1], [7, 5]], // 10
    [[0, 2], [1, 5], [2, 1], [3, 4], [4, 7], [5, 0], [6, 6], [7, 3]], // 11
    [[0, 2], [1, 4], [2, 1], [3, 7], [4, 0], [5, 6], [6, 3], [7, 5]]  // 12
];

let solutions_queens = [];

function create2DArray(coords, size = 8) {
    // Initialize an 8x8 2D array with false values
    const array = Array.from({length: size}, () => Array(size).fill(false));

    // Mark the positions given in coords as true
    coords.forEach(([x, y]) => {
        array[x][y] = true;
    });

    return array;
}

function create_all_solution_arrays() {
    solution_cords_queens.forEach((coords) => {
        solutions_queens.push(create2DArray(coords));
    })
}


function rotate2DArrayToRight(array) {
    const size = array.length;
    const rotated = Array.from({length: size}, () => Array(size).fill(false));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            rotated[j][size - 1 - i] = array[i][j];
        }
    }

    return rotated;
}

function flip2DArray(array, direction) {
    const size = array.length;
    const flipped = Array.from({length: size}, () => Array(size).fill(false));

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

function find_valid_sol(starting_queen_cords) {
    let starting_x = starting_queen_cords[0];
    let starting_y = starting_queen_cords[1];

    let solutions_num = 0;

    let flipped_options = ["vertical", "horizontal"];

    for (let i = 0; i < solutions_queens.length; i++) {
        let solution = solutions_queens[i];

        for (let j = 0; j < 4; j++) {
            if (solution[starting_y][starting_x] === true) {
                // console.log(`Found Solution at i: ${i}, Rotation ${j}, starting_x: ${starting_x}, starting_y: ${starting_y}`);
                return solution;
            }

            for (let k = 0; k < flipped_options.length; k++) {
                solutions_num++;

                let solution_flipped = flip2DArray(solution, flipped_options[k]);

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


/*
+++++++++++++++++++++++++++++
HTML CODE
+++++++++++++++++++++++++++++
 */

const explain_p = document.getElementById('queens-explain');

// Function to place the queen at (0, 0) initially
function initializeQueen() {
    const square = document.getElementById('queen-square-0-0');
    if (square) {
        square.classList.add('queen');
    }
}

// Function to get the queen's current coordinates
function get_queen_coordinates() {
    const queen = document.querySelector('.queen');
    if (queen) {
        const id = queen.id; // e.g., "queen-square-0-0"
        const coords = id.split('-').slice(2).map(Number); // Extract row and column
        return [coords[0], coords[1]];
    }
    return null;
}

// Function to place queens on the chessboard
function placeQueens(chessboardArray) {
    // Clear any existing queens
    document.querySelectorAll('.queen').forEach(el => el.classList.remove('queen'));

    // Iterate through the 2D array
    for (let row = 0; row < chessboardArray.length; row++) {
        for (let col = 0; col < chessboardArray[row].length; col++) {
            if (chessboardArray[row][col]) {
                const square = document.getElementById(`queen-square-${row}-${col}`);
                if (square) {
                    square.classList.add('queen');
                }
            }
        }
    }
}

// Flag to track if movement is enabled
let isMovementEnabled = true;

// Function to disable queen movement
function disableQueenMovement() {
    isMovementEnabled = false;
    document.querySelectorAll('.chessboard div').forEach(square => {
        square.onclick = null; // Remove click handler
    });
}

// Function to enable queen movement
function enableQueenMovement() {
    isMovementEnabled = true;
    document.querySelectorAll('.chessboard div').forEach(square => {
        square.onclick = function () {
            if (isMovementEnabled) {
                document.querySelectorAll('.queen').forEach(el => el.classList.remove('queen'));
                this.classList.add('queen');
            }
        };
    });
}

function solve_eight_queens() {
    const coords = get_queen_coordinates();
    if (coords) {
        const [y, x] = coords;

        const sol = find_valid_sol([x, y]);

        if (sol === null) {
            explain_p.innerText = 'No solution found.';
            return;
        }

        placeQueens(sol);
        disableQueenMovement();

        // Disable the solve button
        document.getElementById('solve-button-queens').classList.add("disabled");
    }
}

// Function to reset the chessboard
function reset_eight_queens() {
    // Remove all queens
    document.querySelectorAll('.queen').forEach(el => el.classList.remove('queen'));

    // Enable movement
    enableQueenMovement();

    // Place queen at (0, 0)
    initializeQueen();

    explain_p.innerText = 'Click a square to move the Queen.';

    // Enable the solve button
    document.getElementById('solve-button-queens').classList.remove("disabled");
}


// Initialize the queen and enable movement when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeQueen(); // Place queen at (0, 0)
    enableQueenMovement(); // Allow movement
    create_all_solution_arrays(); // Replace with your implementation
});
