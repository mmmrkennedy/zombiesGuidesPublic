let selectedTiles;
let tileSelection;
let result;
let resultTiles;
let tile_count;

document.addEventListener('mahjong_solver_template', function () {
    console.log("mahjong_solver_template called")

    selectedTiles = [];
    tileSelection = document.getElementById('tileSelection');
    result = document.getElementById('result');
    resultTiles = document.getElementById('resultTiles');
    tile_count = [0, 0, 0, 0, 0];

    // Add click event to each tile
    tileSelection.addEventListener('click', (event) => {
        const tile = event.target;
        if (tile.tagName === 'IMG' && selectedTiles.length < 14) {
            const tileValue = parseInt(tile.getAttribute('data-value'));
            const tileSrc = tile.getAttribute('data-src');

            // Add tile to the selected list and display in the result
            selectedTiles.push({value: tileValue, src: tileSrc});
            tile_count[tileValue - 1] += 1;
            updateResult();

            // Disable further tile selection if 14 tiles are selected
            if (selectedTiles.length === 14) {
                disableTiles();
                calculateHand();
            } else {
                if (tile_count[tileValue - 1] >= 4) {
                    disableTile(tileValue);
                }
            }
        }
    });
});

// Update the result with the selected tiles as images
function updateResult() {
    // result.textContent = `Selected Tiles:`;
    resultTiles.innerHTML = ''; // Clear previous tiles
    selectedTiles.forEach(tile => {
        const img = document.createElement('img');
        img.src = tile.src;
        img.alt = `Tile ${tile.value}`;
        img.className = 'tile';
        img.style.width = img.naturalWidth * 0.5 + 'px';
        img.style.height = img.naturalHeight * 0.5 + 'px';
        resultTiles.appendChild(img);
    });
}

// Disable further selection of tiles
function disableTiles() {
    document.querySelectorAll('.solver-symbol-select img').forEach(img => {
        img.classList.add('disabled');
        img.style.pointerEvents = 'none';
    });
}

function disableTile(tileValue) {
    document.querySelectorAll('.solver-symbol-select img').forEach(img => {
        if (parseInt(img.getAttribute('data-value')) === tileValue) {
            img.classList.add('disabled');
            img.style.pointerEvents = 'none';
        }
    });
}

// Reset button logic
function resetSelection() {
    selectedTiles.length = 0;
    tile_count = [0, 0, 0, 0, 0];
    result.textContent = "";
    resultTiles.innerHTML = "";
    updateResult(); // Reset the result display
    enableTiles(); // Re-enable tile selection
}

// Enable all tiles for selection
function enableTiles() {
    document.querySelectorAll('.solver-symbol-select img').forEach(img => {
        img.classList.remove('disabled');
        img.classList.remove('hidden');
        img.style.pointerEvents = 'auto';
    });
}

function calculateHand() {
    const tileCounts = selectedTiles.reduce((acc, tile) => {
        acc[tile.value] = (acc[tile.value] || 0) + 1;
        return acc;
    }, {});

    const melds = [];
    let pair = null;

    Object.keys(tileCounts).forEach(value => {
        const count = tileCounts[value];
        if (count >= 3) {
            melds.push([value, value, value]);
            tileCounts[value] -= 3;
        }
        if (count === 2 && !pair) {
            pair = [value, value];
            tileCounts[value] -= 2;
        }
    });

    const values = Object.keys(tileCounts).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < values.length - 2; i++) {
        const [a, b, c] = [values[i], values[i + 1], values[i + 2]];
        if (tileCounts[a] > 0 && tileCounts[b] > 0 && tileCounts[c] > 0) {
            melds.push([a, b, c]);
            tileCounts[a]--;
            tileCounts[b]--;
            tileCounts[c]--;
        }
    }

    if (melds.length === 4 && pair) {
        displayWinningHand(melds, pair);
    } else {
        result.innerHTML += "Invalid hand";
        // checkErrorInHand(melds, pair);
    }
}


// Display the winning hand in the result area
function displayWinningHand(melds, pair) {
    resultTiles.innerHTML = ''; // Clear previous result

    // Helper function to create a container for melds or pairs
    const createTileContainer = (tiles) => {
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.style.margin = '0 10px';

        tiles.forEach(value => {
            const img = document.createElement('img');
            const tile = selectedTiles.find(tile => tile.value == value);
            img.src = tile.src;
            img.alt = `Tile ${value}`;
            img.className = 'tile';
            img.style.width = img.naturalWidth * 0.5 + 'px';
            img.style.height = img.naturalHeight * 0.5 + 'px';
            container.appendChild(img);
        });

        return container;
    };

    // Display melds
    melds.forEach(meld => {
        const meldContainer = createTileContainer(meld);
        resultTiles.appendChild(meldContainer);
    });

    // Display the pair
    const pairContainer = createTileContainer(pair);
    resultTiles.appendChild(pairContainer);
}

