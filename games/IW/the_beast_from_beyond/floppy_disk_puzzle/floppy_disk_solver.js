const selectedSymbols = [];
const maxSymbols = 4;
const solverCode = document.getElementById('solver_code');
const resultDiv = document.getElementById('result');

// Update the solver output and display selected images in order
function updateSolverOutput() {
    console.log('Updating solver output...');
    resultDiv.innerHTML = ''; // Clear previous content
    solverCode.textContent = '';

    if (selectedSymbols.length === maxSymbols) {
        const isDuplicate = new Set(selectedSymbols).size !== selectedSymbols.length;
        console.log('Max symbols reached. Checking for duplicates...');

        if (isDuplicate) {
            console.log('Duplicate detected.');
            solverCode.textContent = 'Invalid Sequence: Duplicate symbol selected!';
        } else {
            console.log('No duplicates. Processing symbols...');
            const processedResult = processSymbols(selectedSymbols);
            console.log('Processed Result:', processedResult);

            if (processedResult) {
                solverCode.textContent = 'Valid Sequence:';
                processedResult.forEach(id => {
                    const img = document.createElement('img');
                    img.src = `pictures/picture ${id - 1}.png`; // Adjust path as needed
                    img.alt = `Symbol ${id}`;
                    img.style.width = '50px';
                    img.style.height = '50px';
                    img.style.margin = '5px';
                    resultDiv.appendChild(img);
                });
            } else {
                console.log('Invalid sequence: No matching result.');
                solverCode.textContent = 'Invalid Sequence: No matching result!';
            }
        }
    } else {
        console.log('Selected Symbols:', selectedSymbols);
        solverCode.textContent = `Selected Symbols: ${selectedSymbols.join(', ')}`;
    }
}

// Handle symbol selection
function selectSymbol(imgElement) {
    const symbolId = parseInt(imgElement.getAttribute('data-symbol-id'), 10);

    if (selectedSymbols.length < maxSymbols && !selectedSymbols.includes(symbolId)) {
        selectedSymbols.push(symbolId);
        imgElement.classList.add('selected');
        updateSolverOutput();
    }
}

// Reset the selection
function resetAll() {
    selectedSymbols.length = 0; // Clear the array
    document.querySelectorAll('.solver-symbol-select img').forEach(img => {
        img.classList.remove('selected');
    });
    updateSolverOutput();
}

// Process the selected symbols
function processSymbols(symbols) {
    const lines = [
        [1, 2, 3, 4, 0, 5],
        [6, 5, 8, 9, 7, 1],
        [9, 10, 7, 8, 6, 1],
        [9, 4, 3, 0, 5, 2],
        [1, 11, 3, 2, 0, 5],
        [4, 11, 0, 2, 5, 8]
    ];

    for (const line of lines) {
        if (symbols.every(n => line.includes(n))) {
            return line.filter(n => symbols.includes(n));
        }
    }

    return false;
}

// Add data-symbol-id to the images for reference
document.querySelectorAll('.solver-symbol-select img').forEach((img, index) => {
    img.setAttribute('data-symbol-id', index + 1); // IDs start from 1
});

const symbolContainer = document.querySelector('.solver-symbol-select');
const totalSymbols = 12; // Total number of symbols/images
const symbolsPerRow = 4; // Number of symbols per row
const imagePath = 'pictures/'; // Base path for images

function generateSymbolGrid() {
    for (let i = 0; i < totalSymbols; i++) {
        // Create a new <img> element
        const img = document.createElement('img');
        img.src = `${imagePath}picture ${i}.png`; // Replace with appropriate filenames
        img.alt = `Symbol ${i}`;
        img.setAttribute('data-symbol-id', i + 1); // Unique identifier for each symbol
        img.onclick = () => selectSymbol(img); // Add the click event

        // Add the image to the container
        symbolContainer.appendChild(img);

        // Add a line break after every 'symbolsPerRow' images
        if ((i + 1) % symbolsPerRow === 0) {
            const lineBreak = document.createElement('br');
            symbolContainer.appendChild(lineBreak);
        }
    }
}

// Call the function to generate the grid
document.addEventListener("DOMContentLoaded", function(){
    generateSymbolGrid();
});
