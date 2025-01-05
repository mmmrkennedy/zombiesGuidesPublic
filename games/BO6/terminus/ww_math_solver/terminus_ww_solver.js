// attack_gns_solver.js

// Function to toggle the visibility of the solver content
function toggleSolver() {
    const solverContent = document.getElementById("solverContent");
    solverContent.style.display = solverContent.style.display === "none" ? "block" : "none";
}

const selectedSymbols = { X: null, Y: null, Z: null };

function selectSymbol(type, value, element) {
    // Toggle selection
    if (selectedSymbols[type] === value) {
        // Unselect if the same symbol is clicked again
        selectedSymbols[type] = null;
        element.classList.remove("selected");
    } else {
        // Deselect any previously selected symbol for this type
        const container = document.getElementById(type.toLowerCase() + "Symbols");
        const images = container.getElementsByTagName("img");
        for (let img of images) {
            img.classList.remove("selected");
        }
        // Select new symbol
        selectedSymbols[type] = value;
        element.classList.add("selected");
    }

    // Update disabled states for other symbols
    updateDisabledSymbols(type, value, element.classList);

    Object.entries(selectedSymbols).forEach(([selected_letter, selected_value]) => {
        if (selected_letter !== type && selected_value !== null) {
            const otherElement = document.querySelector(`img[alt="${selected_letter}${selected_value}"]`);
            if (otherElement) {
                updateDisabledSymbols(selected_letter, selected_value, otherElement.classList);
            }
        }
    });


    // Calculate formulas
    calculateFormulas();
}

function updateDisabledSymbols(letter, value, element_selected) {
    // Get all symbol containers
    const xSymbols = document.getElementById("xSymbols").getElementsByTagName("img");
    const ySymbols = document.getElementById("ySymbols").getElementsByTagName("img");
    const zSymbols = document.getElementById("zSymbols").getElementsByTagName("img");

    for (let img of [...xSymbols, ...ySymbols, ...zSymbols]) {
        const img_letter = img.alt[0];
        const img_value = parseInt(img.alt.slice(1));

        if ((letter !== img_letter && value === img_value) || (letter === img_letter && value !== img_value)) {
            if ("selected" === element_selected.value) {
                img.classList.add("hidden");
            } else {
                img.classList.remove("hidden");
            }
        }
    }
}

function calculateFormulas() {
    const { X, Y, Z } = selectedSymbols;

    if (X !== null && Y !== null && Z !== null) {
        // Calculate each formula
        let formula1 = 2 * X + 11;
        let formula2 = (2 * Z + Y) - 5;
        let formula3 = Math.abs((Y + Z) - X);

        if (formula1 < 10) {
            formula1 = "0" + String(formula1)
        }

        if (formula2 < 10) {
            formula2 = "0" + String(formula2)
        }

        if (formula3 < 10) {
            formula3 = "0" + String(formula3)
        }

        // Display results
        document.getElementById("solver_code").textContent = formula1 + " - " + formula2 + " - " + formula3;
        /*
        document.getElementById("formula1").textContent = formula1;
        document.getElementById("formula2").textContent = formula2;
        document.getElementById("formula3").textContent = formula3;
         */
    } else {
        // Display "N/A" if not all symbols are selected
        document.getElementById("solver_code").textContent = "N/A";
        // document.getElementById("formula1").textContent = "N/A";
        // document.getElementById("formula2").textContent = "N/A";
        // document.getElementById("formula3").textContent = "N/A";
    }
}

function resetAll() {
    // Reset selections
    selectedSymbols.X = null;
    selectedSymbols.Y = null;
    selectedSymbols.Z = null;

    // Remove selected and disabled styles
    const allImages = document.querySelectorAll(".solver-symbol-select img");
    allImages.forEach(img => {
        img.classList.remove("selected");
        img.classList.remove("hidden");
    });

    // Reset formula results display
    document.getElementById("solver_code").textContent = "N/A";
    /*
    document.getElementById("formula1").textContent = "N/A";
    document.getElementById("formula2").textContent = "N/A";
    document.getElementById("formula3").textContent = "N/A";
     */
}