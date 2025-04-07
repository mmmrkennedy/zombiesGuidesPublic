// Morse code mapping
const morseToText = {
    ".-": "A", "-...": "B", "-.-.": "C", "-..": "D",
    ".": "E", "..-.": "F", "--.": "G", "....": "H",
    "..": "I", ".---": "J", "-.-": "K", ".-..": "L",
    "--": "M", "-.": "N", "---": "O", ".--.": "P",
    "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
    "..-": "U", "...-": "V", ".--": "W", "-..-": "X",
    "-.--": "Y", "--..": "Z", ".----": "1", "..---": "2",
    "...--": "3", "....-": "4", ".....": "5", "-....": "6",
    "--...": "7", "---..": "8", "----.": "9", "-----": "0"
};

const textToMorse = Object.entries(morseToText).reduce((acc, [morse, char]) => {
    acc[char] = morse;
    return acc;
}, {});

const keyTextSpan = document.getElementById('morse_key');
const decodedTextSpan = document.getElementById('morse_decoded_text');
const decryptedTextSpan = document.getElementById('morse_decrypted_text');
const killNumberSpan = document.getElementById('morse_kill_number');
const morseInput = document.getElementById('morse_input');
const morseCodeInputError = document.getElementById('morse-code-input-error');
const venomXKeySelector = document.getElementById('venom-y-key-selector');

// Function to encode text to Morse code
function encodeMorse(text) {
    return text
        .toUpperCase() // Convert to uppercase to match keys in textToMorse
        .split('') // Split into characters
        .map(char => textToMorse[char] || '') // Map each character to Morse code, ignoring unsupported characters
        .join(' ') // Join Morse codes with a space
        .replace(/\s{2,}/g, '   '); // Replace double spaces with triple spaces to separate words
}

function decodeMorse(morseCode) {
    const words = morseCode.split('   ');

    for (const word of words) {
        const letters = word.split(' ');
        for (const letter of letters) {
            if (!(letter in morseToText) && letter !== '') {
                return ""; // Error converting code
            }
        }
    }

     // Combine words into the full message
    return words.map(word => {
        const letters = word.split(' '); // Split word into letters
        const translatedLetters = letters.map(letter => morseToText[letter]); // Translate each letter
        return translatedLetters.join(''); // Combine letters into a word
    }).join(' ');
}


function decryptVigenere(ciphertext, key) {
    key = key.split(' ')[0];

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const keyUpper = key.toUpperCase();
    let plaintext = "";

    let keyIndex = 0;
    for (let i = 0; i < ciphertext.length; i++) {
        const char = ciphertext[i];
        const charUpper = char.toUpperCase();

        if (alphabet.includes(charUpper)) {
            const cipherIndex = alphabet.indexOf(charUpper);
            const keyChar = keyUpper[keyIndex % keyUpper.length];
            const keyIndexValue = alphabet.indexOf(keyChar);

            const plainIndex = (cipherIndex - keyIndexValue + alphabet.length) % alphabet.length;
            const plainChar = alphabet[plainIndex];

            plaintext += char === charUpper ? plainChar : plainChar.toLowerCase();
            keyIndex++;
        } else {
            plaintext += char; // Non-alphabetic characters remain unchanged
        }
    }

    return plaintext;
}

function encryptVigenere(plaintext, key) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const keyUpper = key.toUpperCase();
    let ciphertext = "";

    let keyIndex = 0;
    for (let i = 0; i < plaintext.length; i++) {
        const char = plaintext[i];
        const charUpper = char.toUpperCase();

        if (alphabet.includes(charUpper)) {
            const plainIndex = alphabet.indexOf(charUpper);
            const keyChar = keyUpper[keyIndex % keyUpper.length];
            const keyIndexValue = alphabet.indexOf(keyChar);

            const cipherIndex = (plainIndex + keyIndexValue) % alphabet.length;
            const cipherChar = alphabet[cipherIndex];

            ciphertext += char === charUpper ? cipherChar : cipherChar.toLowerCase();
            keyIndex++;
        } else {
            ciphertext += char; // Non-alphabetic characters remain unchanged
        }
    }

    return ciphertext;
}

const cross_morse = encodeMorse("CROSS");
const archer_morse = encodeMorse("ARCHER");

function get_key(code){
    // Returns the key (if it could be determined), and a bool indicating if the input is JUST the key

    if (cross_morse.startsWith(code) || code.startsWith(cross_morse)) { // If the input is the key
        return ["CROSS", true];

    } else if (archer_morse.startsWith(code) || code.startsWith(archer_morse)) {
        return ["ARCHER", true];
    }

    return ["", false];
}

function extract_number(decrypted_text) {
    let number_str = decrypted_text.replace("KILLOVER", "")

    if (number_str.startsWith("F")) {
        return "FIFTEEN";

    } else if (number_str.startsWith("E")) {
        return "EIGHTEEN";

    } else if (number_str.startsWith("TW")) {
        if (number_str.startsWith("TWENTY") && !number_str.startsWith("TWENTYF")) {
            return "TWENTY";
        } else if (number_str.startsWith("TWENTYF")) {
            return "TWENTYFIVE";
        }

        return "TWENTY or TWENTYFIVE (input more code to get a definitive result).";

    } else if (number_str.startsWith("TH")) {
        return "THIRTY";
    }

    return "";
}

function is_valid_morse_code(code) {
    let code_char_num = new Set(code);

    for (const char of code_char_num) {
        if (!(char === "-" || char === "." || char === " ")) {
            return false;
        }
    }

    return true;
}


function process_morse_code() {
    let code = morseInput.value.trim();

    if (!is_valid_morse_code(code)){
        morseCodeInputError.innerText = "Error: Code can only contain \"-\",\".\", or \"space\"";
        return;
    } else {
        morseCodeInputError.innerText = "";
    }

    // Set default display values for all spans to indicate invalid input
    keyTextSpan.innerText = 'N/A (Invalid message)';
    decodedTextSpan.innerText = 'N/A (Invalid message)';
    decryptedTextSpan.innerText = 'N/A (Invalid message)';
    killNumberSpan.innerText = 'N/A (Invalid message)';

    console.log(`Code Length: ${code.length}`);
    
    if (code.length === 0){
        return;
    }

    let key, was_only_key_entered;

    // Attempt to retrieve key automatically from the input Morse code
    [key, was_only_key_entered] = get_key(code);

    // Handle cases where only a key is found in the input
    if (was_only_key_entered) {
        keyTextSpan.innerText = key;
        decodedTextSpan.innerText = 'N/A (Key message was entered)';
        return;
    }

    if (key === ""){
        key = venomXKeySelector.value.toUpperCase();
    }

    // Decode the Morse code into plain text
    let decodedMorseToText = decodeMorse(code);

    // Decrypt the decoded text using the determined key
    let decryptedText = decryptVigenere(decodedMorseToText, key);

    // Extract the "kill number" from the decrypted text
    let extractedNumber = extract_number(decryptedText);

    // For the case when the user just enters the encrypted number ("KILLOVER" is needed for accurate decryption)
    if (extractedNumber.length === 0 && !decryptedText.startsWith("KILLOVER")) {
        let start_encrypted = encryptVigenere("KILLOVER", key);

        let decryptedTextExtended = decryptVigenere(start_encrypted + decodedMorseToText, key);

        // Extract the "kill number" from the decrypted text
        extractedNumber = extract_number(decryptedTextExtended);
    }

    // Update spans with the processed results
    keyTextSpan.innerText = key;
    decodedTextSpan.innerText = decodedMorseToText;
    decryptedTextSpan.innerText = decryptedText;
    killNumberSpan.innerText = extractedNumber;
}

document.addEventListener("DOMContentLoaded", function() {
    keyTextSpan.innerText = 'N/A (Invalid message)';
    decodedTextSpan.innerText = 'N/A (Invalid message)';
    decryptedTextSpan.innerText = 'N/A (Invalid message)';
    killNumberSpan.innerText = 'N/A (Invalid message)';
});