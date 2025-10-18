// Create the chessboard
function createChessboard() {
    const chessboard = document.getElementById('chessboard');

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add((row + col) % 2 === 0 ? 'white-board' : 'black-board');

            // Assign an ID to each square based on its coordinates
            square.id = `queen-square-${row}-${col}`;

            chessboard.appendChild(square);
        }
    }
}

// Initialize the chessboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    createChessboard();
});
