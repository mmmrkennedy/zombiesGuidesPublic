function createBoard() {
    const board = document.getElementById('board');

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const square = document.createElement('div');
            square.classList.add('green-square');
            square.id = `square-${row}-${col}`;
            square.dataset.occupied = "false"; // Track whether the square is occupied
            square.addEventListener('dragover', allowDrop);
            square.addEventListener('drop', drop);
            board.appendChild(square);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard();

    const images = document.querySelectorAll('.draggable-image');
    images.forEach(img => {
        img.addEventListener('dragstart', dragStart);
    });
});

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    const imageId = event.dataTransfer.getData("text");
    const draggedImage = document.getElementById(imageId);
    const targetSquare = event.target;

    // Ensure the drop target is a valid square
    if (!targetSquare.classList.contains('green-square')) return;

    // Check if the square is already occupied
    if (targetSquare.dataset.occupied === "true") {
        alert("This square is already occupied!");
        return;
    }

    // Unmark previous square if the image was already placed
    const previousSquare = draggedImage.parentElement;
    if (previousSquare.classList.contains('green-square')) {
        previousSquare.dataset.occupied = "false";
    }

    // Place the image and mark the square as occupied
    targetSquare.appendChild(draggedImage);
    targetSquare.dataset.occupied = "true";
}