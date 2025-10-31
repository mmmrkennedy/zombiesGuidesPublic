// Morse code mapping
const morseToText = {
    '.-': 'A',
    '-...': 'B',
    '-.-.': 'C',
    '-..': 'D',
    '.': 'E',
    '..-.': 'F',
    '--.': 'G',
    '....': 'H',
    '..': 'I',
    '.---': 'J',
    '-.-': 'K',
    '.-..': 'L',
    '--': 'M',
    '-.': 'N',
    '---': 'O',
    '.--.': 'P',
    '--.-': 'Q',
    '.-.': 'R',
    '...': 'S',
    '-': 'T',
    '..-': 'U',
    '...-': 'V',
    '.--': 'W',
    '-..-': 'X',
    '-.--': 'Y',
    '--..': 'Z',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '-----': '0',
};

const textToMorse = Object.entries(morseToText).reduce((acc, [morse, char]) => {
    acc[char] = morse;
    return acc;
}, {});

const keyTextSpan = document.getElementById('morse_key');
const decodedTextSpan = document.getElementById('morse_decoded_text');
const decryptedTextSpan = document.getElementById('morse_decrypted_text');
const killNumberSpan = document.getElementById('morse_kill_number');
const morseOutputSpan = document.getElementById('morse_output_code');
const copyButton = document.getElementById('morse_copy_button');
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
                return ''; // Error converting code
            }
        }
    }

    // Combine words into the full message
    return words
        .map(word => {
            const letters = word.split(' '); // Split word into letters
            const translatedLetters = letters.map(letter => morseToText[letter]); // Translate each letter
            return translatedLetters.join(''); // Combine letters into a word
        })
        .join(' ');
}

function decryptVigenere(ciphertext, key) {
    key = key.split(' ')[0];

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyUpper = key.toUpperCase();
    let plaintext = '';

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
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyUpper = key.toUpperCase();
    let ciphertext = '';

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

const cross_morse = encodeMorse('CROSS');
const archer_morse = encodeMorse('ARCHER');

function get_key(code) {
    // Returns the key (if it could be determined), and a bool indicating if the input is JUST the key

    if (cross_morse.startsWith(code) || code.startsWith(cross_morse)) {
        // If the input is the key
        return 'CROSS';
    } else if (archer_morse.startsWith(code) || code.startsWith(archer_morse)) {
        return 'ARCHER';
    }

    return '';
}

function extract_number(decrypted_text) {
    const number_str = decrypted_text.replace('KILLOVER', '');

    if (number_str.startsWith('F')) {
        return 'FIFTEEN';
    } else if (number_str.startsWith('E')) {
        return 'EIGHTEEN';
    } else if (number_str.startsWith('TW')) {
        if (number_str.startsWith('TWENTY') && !number_str.startsWith('TWENTYF')) {
            return 'TWENTY';
        } else if (number_str.startsWith('TWENTYF')) {
            return 'TWENTYFIVE';
        }

        return 'PARTIAL';
    } else if (number_str.startsWith('TH')) {
        return 'THIRTY';
    }

    return '';
}

// Mapping from number words to their morse code input sequences
const numberToMorseInput = {
    'FIFTEEN': '..-. .. ..-. - . . -. .- .-.',
    'EIGHTEEN': '. .. --. .... - . . -.',
    'TWENTY': '- .-- . -. - -.--',
    'TWENTYFIVE': '- .-- . -. - -.--   (then if no sound)   ..-. .. ...- .',
    'THIRTY': '- .... .. .-. - -.--'
};

function getNumberMorseOutput(numberWord) {
    return numberToMorseInput[numberWord] || '';
}

function copyToClipboard() {
    const morseCode = morseOutputSpan.innerText;
    if (morseCode && morseCode !== 'N/A (Enter more morse code)' && morseCode !== 'N/A (Invalid message)') {
        navigator.clipboard.writeText(morseCode).then(() => {
            const originalText = copyButton.innerText;
            copyButton.innerText = 'Copied!';
            setTimeout(() => {
                copyButton.innerText = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
}

function loadExample(exampleType) {
    if (exampleType === 'archer-fifteen') {
        morseInput.value = '-.- --.. -. ... ... -- . . .... ..--.';
        venomXKeySelector.value = 'archer';
    } else if (exampleType === 'cross-twenty') {
        morseInput.value = '-- --.. --.. -.. --. -..- ...- ..-. .-.. ---';
        venomXKeySelector.value = 'cross';
    } else if (exampleType === 'archer-key') {
        morseInput.value = '.- .-. -.-. .... . .-.';
        venomXKeySelector.value = 'default';
    }
    process_morse_code();
}

function is_valid_morse_code(code) {
    const code_char_num = new Set(code);

    for (const char of code_char_num) {
        if (!(char === '-' || char === '.' || char === ' ')) {
            return false;
        }
    }

    return true;
}

function getInvalidCharacters(code) {
    const invalidChars = new Set();
    for (const char of code) {
        if (!(char === '-' || char === '.' || char === ' ')) {
            invalidChars.add(char);
        }
    }
    return Array.from(invalidChars);
}

function process_morse_code() {
    const code = morseInput.value.trim();

    if (!is_valid_morse_code(code)) {
        const invalidChars = getInvalidCharacters(code);
        morseCodeInputError.innerText = `Error: Invalid characters found: "${invalidChars.join('", "')}". Only use "-", ".", and spaces.`;
        return;
    } else {
        morseCodeInputError.innerText = '';
    }

    // Set default display values for all spans to indicate invalid input
    keyTextSpan.innerText = 'N/A (Invalid message)';
    decodedTextSpan.innerText = 'N/A (Invalid message)';
    decryptedTextSpan.innerText = 'N/A (Invalid message)';
    killNumberSpan.innerText = 'N/A (Invalid message)';
    morseOutputSpan.innerText = 'N/A (Invalid message)';
    if (copyButton) {
        copyButton.style.display = 'none';
    }

    console.log(`Code Length: ${code.length}`);

    if (code.length === 0) {
        return;
    }

    // Attempt to retrieve key automatically from the input Morse code
    let key = get_key(code);

    // Handle cases where only a key is found in the input
    if (key !== '') {
        keyTextSpan.innerText = key;
        decodedTextSpan.innerText = 'N/A (Key message was entered)';
        decryptedTextSpan.innerText = 'N/A (Key message was entered)';
        killNumberSpan.innerText = 'N/A (Key message was entered)';
        morseOutputSpan.innerText = 'N/A (Key message was entered)';
        return;
    }

    if (key === '') {
        key = venomXKeySelector.value.toUpperCase();
    }

    // Check if a valid key has been selected
    if (key === 'DEFAULT' || key === '') {
        morseCodeInputError.innerText = 'Error: Please select a key (ARCHER or CROSS) from the dropdown above.';
        return;
    }

    // Decode the Morse code into plain text
    const decodedMorseToText = decodeMorse(code);

    if (decodedMorseToText === '') {
        morseCodeInputError.innerText = 'Error: Failed to decode morse code. Check your spacing between letters and words.';
        return;
    }

    // Decrypt the decoded text using the determined key
    const decryptedText = decryptVigenere(decodedMorseToText, key);

    // Extract the "kill number" from the decrypted text
    let extractedNumber = extract_number(decryptedText);

    // For the case when the user just enters the encrypted number ("KILLOVER" is needed for accurate decryption)
    if (extractedNumber.length === 0 && !decryptedText.startsWith('KILLOVER')) {
        const start_encrypted = encryptVigenere('KILLOVER', key);

        const decryptedTextExtended = decryptVigenere(start_encrypted + decodedMorseToText, key);

        // Extract the "kill number" from the decrypted text
        extractedNumber = extract_number(decryptedTextExtended);
    }

    // Update spans with the processed results
    keyTextSpan.innerText = key;
    decodedTextSpan.innerText = decodedMorseToText;
    decryptedTextSpan.innerText = decryptedText;

    // Handle partial detection with visual feedback
    if (extractedNumber === 'PARTIAL') {
        killNumberSpan.innerHTML = '<span style="color: orange; font-weight: bold;">⚠ TWENTY or TWENTYFIVE</span> — Continue entering morse code to determine which one.';
        morseOutputSpan.innerText = 'N/A (Enter more morse code)';
        if (copyButton) {
            copyButton.style.display = 'none';
        }
    } else if (extractedNumber !== '') {
        killNumberSpan.innerHTML = `<span style="color: green; font-weight: bold;">${extractedNumber}</span>`;
        const morseOutput = getNumberMorseOutput(extractedNumber);
        morseOutputSpan.innerText = morseOutput;
        if (copyButton && morseOutput) {
            copyButton.style.display = 'inline-block';
        }
    } else {
        killNumberSpan.innerText = extractedNumber;
        morseOutputSpan.innerText = 'N/A (Number not detected)';
        if (copyButton) {
            copyButton.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    keyTextSpan.innerText = 'N/A (Invalid message)';
    decodedTextSpan.innerText = 'N/A (Invalid message)';
    decryptedTextSpan.innerText = 'N/A (Invalid message)';
    killNumberSpan.innerText = 'N/A (Invalid message)';
    morseOutputSpan.innerText = 'N/A (Invalid message)';
    if (copyButton) {
        copyButton.style.display = 'none';
    }
});
