// The list of seven possible words
const possibleWords = [
    "DAMNATION",  // Nuke
    "REAPER",     // Insta-Kill
    "GEISTKRAFT", // Full Charge
    "FAMISHED",   // Max Ammo
    "GLUTTONY",   // Double Jolts
    "WONDER",     // Tesla Gun & Ripsaw
    "THEJACKBOX"  // Jack-in-the-Boxes
];

/**
 * Suggests the next letter to guess in Hangman
 * @param {string} revealedSequence - Known letters in the order they appear (e.g., "WND" for "WONDER")
 * @param {string} guessedLetters - All letters that have been guessed (e.g., "WNDER")
 * @returns {object} Information about the next best letter to guess
 */
function suggestNextLetter(revealedSequence, guessedLetters) {
    // Convert inputs to uppercase for consistency
    revealedSequence = revealedSequence.toUpperCase();
    guessedLetters = guessedLetters.toUpperCase();

    // Filter words that match the revealed sequence
    const matchingWords = possibleWords.filter(word => {
        // Check if the revealed sequence matches the word's letters in order
        let wordIndex = 0;
        for (const letter of revealedSequence) {
            // Find the next occurrence of this letter
            let found = false;
            while (wordIndex < word.length) {
                if (word[wordIndex] === letter) {
                    found = true;
                    wordIndex++;
                    break;
                }
                wordIndex++;
            }
            if (!found) return false;
        }

        // Check that none of the incorrect guesses appear in the word
        // (An incorrect guess is a letter in guessedLetters that isn't part of the word)
        for (const letter of guessedLetters) {
            if (!word.includes(letter)) {
                continue; // Skip letters that don't appear in the word
            }

            // If this correctly guessed letter isn't in the revealed sequence,
            // that means the user hasn't put it in yet, which is invalid
            if (!revealedSequence.includes(letter)) {
                return false;
            }
        }

        return true;
    });

    // If no words match the pattern, return an error
    if (matchingWords.length === 0) {
        return {
            letter: null,
            message: "No matching words found. Check your revealed letters and guessed letters."
        };
    }

    // Count the frequency of each letter in the matching words
    const letterFrequency = {};
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Initialize the frequency counter for all letters
    for (const letter of alphabet) {
        letterFrequency[letter] = 0;
    }

    // Count each letter's frequency in matching words
    for (const word of matchingWords) {
        // Create a set of unique letters in the word
        const uniqueLetters = new Set(word.split(''));
        for (const letter of uniqueLetters) {
            // Only count letters that aren't already guessed
            if (!guessedLetters.includes(letter)) {
                letterFrequency[letter]++;
            }
        }
    }

    // Find the letter with the highest frequency
    let bestLetter = null;
    let highestFrequency = 0;

    for (const letter in letterFrequency) {
        if (letterFrequency[letter] > highestFrequency) {
            highestFrequency = letterFrequency[letter];
            bestLetter = letter;
        }
    }

    // If all letters have been guessed, return a message
    if (highestFrequency === 0) {
        return {
            letter: null,
            message: "All relevant letters have been guessed or revealed."
        };
    }

    // Calculate how many words contain this letter
    const wordsWithLetter = matchingWords.filter(word => word.includes(bestLetter));

    return {
        letter: bestLetter,
        frequency: highestFrequency,
        wordsMatched: matchingWords.length,
        wordsWithLetter: wordsWithLetter.length,
        potentialWords: matchingWords,
        message: `Suggest guessing '${bestLetter}'. It appears in ${wordsWithLetter.length} of the ${matchingWords.length} possible words.`
    };
}

// Function that will be called when the "Suggest Next Letter" button is clicked
function suggestLetter() {
    const revealedSequence = document.getElementById('revealed-letters').value;
    const guessedLetters = document.getElementById('guessed-letters').value;

    const result = suggestNextLetter(revealedSequence, guessedLetters);

    // Display the result
    document.getElementById('suggestion-message').textContent = result.message;

    if (result.letter) {
        document.getElementById('letter-suggestion').textContent = result.letter;
    } else {
        document.getElementById('letter-suggestion').textContent = "";
    }

    // Display the matching words
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = "";

    if (result.potentialWords && result.potentialWords.length > 0) {
        result.potentialWords.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordList.appendChild(listItem);
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('revealed-letters').value = "";
    document.getElementById('guessed-letters').value = "";
    suggestLetter();  // Used to load list of words on init
    
    // Add Enter key support for both input fields
    document.getElementById('revealed-letters').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            suggestLetter();
        }
    });

    document.getElementById('guessed-letters').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            suggestLetter();
        }
    });
});