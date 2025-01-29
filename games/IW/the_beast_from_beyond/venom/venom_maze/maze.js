const mazeSolutionCoordinates = [
    {'start': [0, 5], "end": [3, 4], 'path': [[0, 5], [0, 4], [1, 4], [1, 5], [5, 5], [5, 1], [4, 1], [4, 3], [3, 3], [3, 4]]},
    {'start': [1, 2], "end": [4, 4], 'path': [[1, 2], [2, 2], [2, 1], [1, 1], [1, 0], [0, 0], [0, 4], [1, 4], [1, 5], [4, 5], [4, 4]]},
    {'start': [3, 1], "end": [0, 4], 'path': [[3, 1], [1, 1], [1, 2], [2, 2], [2, 3], [1, 3], [1, 4], [2, 4], [2, 5], [0, 5], [0, 4]]},
    {'start': [4, 4], "end": [2, 2], 'path': [[4, 4], [4, 3], [5, 3], [5, 0], [2, 0], [2, 2]]},
    {'start': [0, 4], "end": [4, 2], 'path': [[0, 4], [0, 5], [1, 5], [1, 3], [0, 3], [0, 0], [5, 0], [5, 2], [4, 2]]},
    {'start': [1, 2], "end": [5, 3], 'path': [[1, 2], [0, 2], [0, 5], [1, 5], [1, 3], [2, 3], [2, 2], [3, 2], [3, 3], [4, 3], [4, 4], [5, 4], [5, 3]]},
    {'start': [1, 1], "end": [4, 3], 'path': [[1, 1], [2, 1], [2, 2], [3, 2], [3, 1], [4, 1], [4, 2], [5, 2], [5, 5], [4, 5], [4, 3]]},
    {'start': [3, 2], "end": [4, 1], 'path': [[3, 2], [3, 3], [2, 3], [2, 1], [1, 1], [1, 2], [0, 2], [0, 0], [4, 0], [4, 1]]},
    {'start': [0, 5], "end": [4, 0], 'path': [[0, 5], [0, 4], [1, 4], [1, 2], [0, 2], [0, 1], [2, 1], [2, 3], [4, 3], [4, 0]]},
    {'start': [2, 0], "end": [2, 3], 'path': [[2, 0], [0, 0], [0, 5], [2, 5], [2, 4], [1, 4], [1, 2], [3, 2], [3, 3], [2, 3]]},
    {'start': [4, 5], "end": [3, 3], 'path': [[4, 5], [1, 5], [1, 4], [2, 4], [2, 2], [3, 2], [3, 3]]},
    {'start': [3, 4], "end": [2, 1], 'path': [[3, 4], [3, 5], [5, 5], [5, 1], [4, 1], [4, 2], [2, 2], [2, 1]]},
    {'start': [0, 1], "end": [5, 3], 'path': [[0, 1], [0, 0], [1, 0], [1, 1], [3, 1], [3, 2], [2, 2], [2, 3], [5, 3]]},
    {'start': [1, 4], "end": [5, 0], 'path': [[1, 4], [1, 3], [2, 3], [2, 5], [3, 5], [3, 3], [4, 3], [4, 4], [5, 4], [5, 0]]},
    {'start': [3, 1], "end": [1, 2], 'path': [[3, 1], [4, 1], [4, 2], [5, 2], [5, 3], [4, 3], [4, 4], [3, 4], [3, 5], [2, 5], [2, 3], [3, 3], [3, 2], [2, 2], [2, 1], [1, 1], [1, 2]]},
];

function findSolPath(startCoords, endCoords) {
    const solution = mazeSolutionCoordinates.find(
        ({ start, end }) =>
            JSON.stringify(start) === JSON.stringify(startCoords) &&
            JSON.stringify(end) === JSON.stringify(endCoords)
    );
    return solution ? solution.path : null;
}

const mazeContainer = document.getElementById("maze-container");
const [startBlock, endBlock] = mazeContainer.querySelectorAll(".draggable-image");
const errorMessage = mazeContainer.querySelector("#venom-maze-error");
const solveButton = document.getElementById("solve-button-maze");

function parseCoordinates(elementId) {
    if (!elementId) return null;
    return elementId.split("-").slice(1).map(Number);
}


function resetMaze() {
    errorMessage.innerText = "";
    solveButton.classList.remove("disabled");

    // Clear the canvas to remove the line
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset draggable elements to their original positions
    const startElement = document.getElementById("start");
    const endElement = document.getElementById("end");
    const draggableContainer = document.querySelector(".draggable-container");

    draggableContainer.appendChild(startElement);
    draggableContainer.appendChild(endElement);

    // Reset the occupied status of all squares
    const greenSquares = document.querySelectorAll(".green-square");
    greenSquares.forEach(square => {
        square.dataset.occupied = "false";
    });
}

// Add this <canvas> element dynamically
const canvas = document.createElement("canvas");
canvas.id = "maze-overlay";
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "10";
canvas.style.pointerEvents = "none"; // So it doesn't block interactions

const boardElement = document.getElementById("board");
boardElement.appendChild(canvas);

function adjustCanvasSize() {
    const boardRect = boardElement.getBoundingClientRect();
    canvas.width = boardRect.width;
    canvas.height = boardRect.height;
    canvas.style.width = `${boardRect.width}px`;
    canvas.style.height = `${boardRect.height}px`;
}

function drawPath(pathCoords, color = "red", width = 3) {
    const boardRect = boardElement.getBoundingClientRect();
    const cellSize = boardRect.width / 6; // Assuming 6 columns as per CSS

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    ctx.strokeStyle = color; // Use the provided colour
    ctx.lineWidth = width; // Use the provided width
    ctx.beginPath();

    pathCoords.forEach((coord, index) => {
        // Calculate the center of each grid cell
        const x = coord[1] * cellSize + cellSize / 2;
        const y = coord[0] * cellSize + cellSize / 2;
        const padding = 0.4;

        if (index === 0) {
            // Check a direction for the start point
            const nextCoord = pathCoords[1];
            const deltaX = nextCoord[1] - coord[1];
            const deltaY = nextCoord[0] - coord[0];

            if (deltaX > 0) {
                ctx.moveTo(x + cellSize * padding, y); // Offset for moving right
            } else if (deltaX < 0) {
                ctx.moveTo(x - cellSize * padding, y); // Offset for moving left
            } else if (deltaY > 0) {
                ctx.moveTo(x, y + cellSize * padding); // Offset for moving down
            } else if (deltaY < 0) {
                ctx.moveTo(x, y - cellSize * padding); // Offset for moving up
            } else {
                ctx.moveTo(x, y); // Default
            }
        } else if (index === pathCoords.length - 1) {
            // Check a direction for the end point
            const prevCoord = pathCoords[index - 1];
            const deltaX = coord[1] - prevCoord[1];
            const deltaY = coord[0] - prevCoord[0];

            if (deltaX > 0) {
                ctx.lineTo(x - cellSize * padding, y); // Offset for moving right
            } else if (deltaX < 0) {
                ctx.lineTo(x + cellSize * padding, y); // Offset for moving left
            } else if (deltaY > 0) {
                ctx.lineTo(x, y - cellSize * padding); // Offset for moving down
            } else if (deltaY < 0) {
                ctx.lineTo(x, y + cellSize * padding); // Offset for moving up
            } else {
                ctx.lineTo(x, y); // Default
            }
        } else {
            ctx.lineTo(x, y); // Draw line to the next coordinate
        }
    });

    ctx.stroke();
}

// Modify the solveMaze function to include drawing
function solveMaze() {
    errorMessage.innerText = "";

    const startId = parseCoordinates(startBlock.parentElement.id);
    const endId = parseCoordinates(endBlock.parentElement.id);

    if (!startId || !endId) {
        errorMessage.innerText = "Please place the Yellow Block and Blue Diamond.";
        return;
    }

    const solPath = findSolPath(startId, endId);

    if (!solPath) {
        errorMessage.innerText = "No solution found, please try again.";
        return;
    }

    // Adjust canvas size to match the board
    adjustCanvasSize();

    // Draw the solution path with custom color and width
    drawPath(solPath, "blue", 10);

    solveButton.classList.add("disabled");
}

// Ensure the canvas size adjusts if the window resizes
window.addEventListener("resize", adjustCanvasSize);