const VALID_WORDS = ['aldehydes', 'allomer', 'benzene', 'chlorination', 'ethers', 'ethyl', 'hydrogenation', 'neutrino', 'nitriles', 'oxidation', 'reduction', 'solvolysis', 'sublimation', 'zwitterion'];

// Map letters to numerical values ('a' -> 1, ..., 'z' -> 26)
function letterToNumber(letter) {
    return letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
}

function wordToNumbers(word) {
    return word.split('').map(letterToNumber);
}

// Generate all possible combinations of letter positions
function generateCombinations() {
    const combos = [];
    for (let firstPosition = 1; firstPosition <= 4; firstPosition++) {
        for (let secondPosition = 0; secondPosition <= 4; secondPosition++) {
            for (let thirdPosition = 0; thirdPosition <= 4; thirdPosition++) {
                for (let fourthPosition = 0; fourthPosition <= 4; fourthPosition++) {
                    if (isValidCombination(secondPosition, thirdPosition, fourthPosition)) {
                        combos.push([firstPosition, secondPosition, thirdPosition, fourthPosition]);
                    }
                }
            }
        }
    }
    return combos;
}

// Check if a combination is valid
function isValidCombination(second, third, fourth) {
    return !((second === 0 && (third !== 0 || fourth !== 0)) || (third === 0 && fourth !== 0));
}

// Calculate the sequence modulo
function calculateSequenceModulo(first, second, third, fourth, letterValues) {
    const valueOne = letterValues[first];
    const valueTwo = 3 * second + letterValues[second];
    const valueThree = 3 * third * 2 + letterValues[third];
    const valueFour = 3 * fourth * 3 + letterValues[fourth];
    return (valueOne + valueTwo + valueThree + valueFour) % 26;
}

// Generate a sequence ID based on the combination
function generateSequenceId(first, second, third, fourth) {
    if (fourth !== 0) {
        return 1000 * first + 100 * second + 10 * third + fourth;
    }
    if (third !== 0) {
        return 100 * first + 10 * second + third;
    }
    if (second !== 0) {
        return 10 * first + second;
    }
    return first;
}

function hasDuplicates(array) {
    const seen = new Set();
    for (const item of array) {
        if (seen.has(item)) {
            return true; // Duplicate found
        }
        seen.add(item);
    }
    return false; // No duplicates
}

function solveCipher(targetWord, swingsetLetters) {
    targetWord = targetWord.toLowerCase();
    swingsetLetters = swingsetLetters.join('').toLowerCase();

    // Validate input
    if (swingsetLetters.length !== 4) {
        return 'Error: Swingset letters must be exactly 4 characters.';
    } else if (hasDuplicates(swingsetLetters)) {
        return "Error: Swingset letters can't be the same.";
    }

    if (targetWord.length === 0) {
        return 'Error: Enter a word.';
    } else if (!VALID_WORDS.includes(targetWord)) {
        return 'Error: Invalid word entered.';
    }

    try {
        const letterValues = [0].concat(swingsetLetters.split('').map(letterToNumber));
        const targetWordValues = wordToNumbers(targetWord);

        // Initialize shortest sequences with high values
        const shortestSequences = Array(targetWordValues.length).fill(Infinity);

        // Process combinations
        for (const [first, second, third, fourth] of generateCombinations()) {
            const sequenceModulo = calculateSequenceModulo(first, second, third, fourth, letterValues);
            const sequenceId = generateSequenceId(first, second, third, fourth);

            // Update the shortest sequence for each character in the word
            for (let index = 0; index < targetWordValues.length; index++) {
                if (sequenceModulo === targetWordValues[index] && sequenceId < shortestSequences[index]) {
                    shortestSequences[index] = sequenceId;
                }
            }
        }

        // Build the solution output
        const solution = shortestSequences
            .filter(seq => seq !== Infinity)
            .map(seq => String(seq))
            .join(' - ');
        return 'Code: ' + solution || 'Error: No valid sequence found.';
    } catch {
        return 'Error: Input contains invalid characters.';
    }
}

function main_solve() {
    const resultElement = document.getElementById('result_gns');

    const id_names = ['symbol_1', 'symbol_2', 'symbol_3', 'symbol_4'];

    const active_symbols = [];

    for (let i = 0; i < id_names.length; i += 1) {
        const container = document.getElementById(id_names[i]);

        // Loop through the img-container divs
        for (let j = 0; j < container.children.length; j++) {
            const imgContainer = container.children[j]; // Get the img-container div

            if (imgContainer.tagName === 'P') {
                continue;
            }

            // Check if the child contains an <img> element
            const img = imgContainer.querySelector('img');

            // Check if the img-container is visible
            const isVisible = imgContainer.style.display !== 'none';

            if (img && isVisible) {
                active_symbols.push(img.alt); // Add the alt text of the active image
            }
        }
    }

    const wordElement = document.getElementById('word');

    // Get the selected option's text
    const selectedText = wordElement.options[wordElement.selectedIndex].text;

    // Pass the target word and active symbols to solveCipher
    resultElement.innerHTML = solveCipher(selectedText, active_symbols);
}
