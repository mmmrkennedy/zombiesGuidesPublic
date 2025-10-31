import React, { useState, useEffect } from 'react';

// Morse code mapping
const morseToText: Record<string, string> = {
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

const textToMorse: Record<string, string> = Object.entries(morseToText).reduce(
    (acc, [morse, char]) => {
        acc[char] = morse;
        return acc;
    },
    {} as Record<string, string>
);

// Mapping from number words to their morse code input sequences
const numberToMorseInput: Record<string, string> = {
    FIFTEEN: '..-. .. ..-. - . . -. .- .-.',
    EIGHTEEN: '. .. --. .... - . . -.',
    TWENTY: '- .-- . -. - -.--',
    TWENTYFIVE: '- .-- . -. - -.--   (then if no sound)   ..-. .. ...- .',
    THIRTY: '- .... .. .-. - -.--',
};

type Key = 'ARCHER' | 'CROSS' | 'DEFAULT';

// Function to encode text to Morse code
function encodeMorse(text: string): string {
    return text
        .toUpperCase()
        .split('')
        .map(char => textToMorse[char] || '')
        .join(' ')
        .replace(/\s{2,}/g, '   ');
}

function decodeMorse(morseCode: string): string {
    const words = morseCode.split('   ');

    for (const word of words) {
        const letters = word.split(' ');
        for (const letter of letters) {
            if (!(letter in morseToText) && letter !== '') {
                return ''; // Error converting code
            }
        }
    }

    return words
        .map(word => {
            const letters = word.split(' ');
            const translatedLetters = letters.map(letter => morseToText[letter]);
            return translatedLetters.join('');
        })
        .join(' ');
}

function decryptVigenere(ciphertext: string, key: string): string {
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
            plaintext += char;
        }
    }

    return plaintext;
}

function encryptVigenere(plaintext: string, key: string): string {
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
            ciphertext += char;
        }
    }

    return ciphertext;
}

const cross_morse = encodeMorse('CROSS');
const archer_morse = encodeMorse('ARCHER');

function getKey(code: string): Key {
    if (cross_morse.startsWith(code) || code.startsWith(cross_morse)) {
        return 'CROSS';
    } else if (archer_morse.startsWith(code) || code.startsWith(archer_morse)) {
        return 'ARCHER';
    }
    return 'DEFAULT';
}

function extractNumber(decryptedText: string): string {
    const numberStr = decryptedText.replace('KILLOVER', '');

    if (numberStr.startsWith('F')) {
        return 'FIFTEEN';
    } else if (numberStr.startsWith('E')) {
        return 'EIGHTEEN';
    } else if (numberStr.startsWith('TW')) {
        if (numberStr.startsWith('TWENTY') && !numberStr.startsWith('TWENTYF')) {
            return 'TWENTY';
        } else if (numberStr.startsWith('TWENTYF')) {
            return 'TWENTYFIVE';
        }
        return 'PARTIAL';
    } else if (numberStr.startsWith('TH')) {
        return 'THIRTY';
    }

    return '';
}

function getNumberMorseOutput(numberWord: string): string {
    return numberToMorseInput[numberWord] || '';
}

function isValidMorseCode(code: string): boolean {
    for (const char of code) {
        if (!(char === '-' || char === '.' || char === ' ')) {
            return false;
        }
    }
    return true;
}

function getInvalidCharacters(code: string): string[] {
    const invalidChars = new Set<string>();
    for (const char of code) {
        if (!(char === '-' || char === '.' || char === ' ')) {
            invalidChars.add(char);
        }
    }
    return Array.from(invalidChars);
}

export default function IWBeastMorseCodeSolver() {
    const [morseInput, setMorseInput] = useState<string>('');
    const [selectedKey, setSelectedKey] = useState<Key>('DEFAULT');
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<{
        key: string;
        decodedText: string;
        decryptedText: string;
        killNumber: string;
        morseOutputCode: string;
        isPartial: boolean;
        isKeyMessage: boolean;
    } | null>(null);

    const loadExample = (exampleType: string) => {
        if (exampleType === 'archer-fifteen') {
            setMorseInput('-.- --.. -. ... ... -- . . .... .--.');
            setSelectedKey('ARCHER');
        } else if (exampleType === 'cross-twenty') {
            setMorseInput('-- --.. --.. -.. --. -..- ...- ..-. .-.. ---');
            setSelectedKey('CROSS');
        } else if (exampleType === 'archer-key') {
            setMorseInput('.- .-. -.-. .... . .-.');
            setSelectedKey('DEFAULT');
        }
    };

    const copyToClipboard = () => {
        if (result?.morseOutputCode && !result.isPartial && !result.isKeyMessage) {
            navigator.clipboard.writeText(result.morseOutputCode).then(() => {
                // Could add a temporary "Copied!" message here
            });
        }
    };

    useEffect(() => {
        processMorseCode();
    }, [morseInput, selectedKey]);

    const processMorseCode = () => {
        const code = morseInput.trim();

        if (!isValidMorseCode(code)) {
            const invalidChars = getInvalidCharacters(code);
            setError(`Invalid characters found: "${invalidChars.join('", "')}". Only use "-", ".", and spaces.`);
            setResult(null);
            return;
        } else {
            setError('');
        }

        if (code.length === 0) {
            setResult(null);
            return;
        }

        // Attempt to retrieve key automatically from the input Morse code
        let key = getKey(code);

        // Handle cases where only a key is found in the input
        if (key !== 'DEFAULT') {
            setResult({
                key,
                decodedText: 'N/A',
                decryptedText: 'N/A',
                killNumber: 'N/A',
                morseOutputCode: 'N/A',
                isPartial: false,
                isKeyMessage: true,
            });
            return;
        }

        if (key === 'DEFAULT') {
            key = selectedKey;
        }

        // Check if a valid key has been selected
        if (key === 'DEFAULT' || key === '') {
            setError('Please select a key (ARCHER or CROSS) from the dropdown.');
            setResult(null);
            return;
        }

        // Decode the Morse code into plain text
        const decodedMorseToText = decodeMorse(code);

        if (decodedMorseToText === '') {
            setError('Failed to decode morse code. Check your spacing between letters and words.');
            setResult(null);
            return;
        }

        // Decrypt the decoded text using the determined key
        const decryptedText = decryptVigenere(decodedMorseToText, key);

        // Extract the "kill number" from the decrypted text
        let extractedNumber = extractNumber(decryptedText);

        // For the case when the user just enters the encrypted number ("KILLOVER" is needed for accurate decryption)
        if (extractedNumber.length === 0 && !decryptedText.startsWith('KILLOVER')) {
            const startEncrypted = encryptVigenere('KILLOVER', key);
            const decryptedTextExtended = decryptVigenere(startEncrypted + decodedMorseToText, key);
            extractedNumber = extractNumber(decryptedTextExtended);
        }

        const morseOutput = extractedNumber === 'PARTIAL' ? '' : getNumberMorseOutput(extractedNumber);

        setResult({
            key,
            decodedText: decodedMorseToText,
            decryptedText,
            killNumber: extractedNumber,
            morseOutputCode: morseOutput,
            isPartial: extractedNumber === 'PARTIAL',
            isKeyMessage: false,
        });
    };

    return (
        <div className="solver-container">
            <form onSubmit={e => e.preventDefault()}>
                <fieldset>
                    <legend>Beast Venom-Y/Z Morse Code Solver</legend>
                    <p className="solver-instructions">
                        Enter Morse Code using "-" for Long Beep and "." for Short Beep, including spaces. Input from either console will be accurately translated. Continue entering code until the solver extracts the number. To decrypt a number without Cross' or Archer's starting code, manually enter the Key (the starting code determines the key automatically).
                    </p>

                    <details style={{ marginBottom: '12px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>📖 Morse Code Reference</summary>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                gap: '8px',
                                padding: '10px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '0.9em',
                            }}
                        >
                            <div>A: .-</div>
                            <div>B: -...</div>
                            <div>C: -.-.</div>
                            <div>D: -..</div>
                            <div>E: .</div>
                            <div>F: ..-.</div>
                            <div>G: --.</div>
                            <div>H: ....</div>
                            <div>I: ..</div>
                            <div>J: .---</div>
                            <div>K: -.-</div>
                            <div>L: .-..</div>
                            <div>M: --</div>
                            <div>N: -.</div>
                            <div>O: ---</div>
                            <div>P: .--.</div>
                            <div>Q: --.-</div>
                            <div>R: .-.</div>
                            <div>S: ...</div>
                            <div>T: -</div>
                            <div>U: ..-</div>
                            <div>V: ...-</div>
                            <div>W: .--</div>
                            <div>X: -..-</div>
                            <div>Y: -.--</div>
                            <div>Z: --..</div>
                            <div>1: .----</div>
                            <div>2: ..---</div>
                            <div>3: ...--</div>
                            <div>4: ....-</div>
                            <div>5: .....</div>
                            <div>6: -....</div>
                            <div>7: --...</div>
                            <div>8: ---..</div>
                            <div>9: ----.</div>
                            <div>0: -----</div>
                        </div>
                    </details>

                    <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>Try an Example:</p>
                        <button type="button" className="btn-base" onClick={() => loadExample('archer-key')} style={{ marginRight: '8px' }}>
                            ARCHER Key
                        </button>
                        <button type="button" className="btn-base" onClick={() => loadExample('archer-fifteen')} style={{ marginRight: '8px' }}>
                            ARCHER → 15
                        </button>
                        <button type="button" className="btn-base" onClick={() => loadExample('cross-twenty')}>
                            CROSS → 20
                        </button>
                    </div>

                    <div className="form-row">
                        <label htmlFor="key-selector">
                            <b>Select your Key:</b>
                        </label>
                        <select id="key-selector" className="spacing" value={selectedKey} onChange={e => setSelectedKey(e.target.value as Key)}>
                            <option value="DEFAULT" disabled>
                                Select a Key
                            </option>
                            <option value="ARCHER">ARCHER</option>
                            <option value="CROSS">CROSS</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label htmlFor="morse-input">Enter your Morse Code:</label>
                        <input type="text" id="morse-input" className="spacing" style={{ width: '100%' }} value={morseInput} onChange={e => setMorseInput(e.target.value)} placeholder="e.g. .- .-. -.-. .... . .-." />
                    </div>

                    {error && (
                        <div style={{ color: 'red', marginTop: '8px', marginBottom: '8px' }}>
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                </fieldset>

                {result && (
                    <div className="solver-output">
                        <div style={{ marginBottom: '12px' }}>
                            <p>
                                <strong>Cypher Decryption Key:</strong> {result.key}
                            </p>
                            <p>
                                <strong>Decoded Morse Code:</strong> {result.isKeyMessage ? 'N/A (Key message was entered)' : result.decodedText}
                            </p>
                            <p>
                                <strong>Deciphered Morse Code:</strong> {result.isKeyMessage ? 'N/A (Key message was entered)' : result.decryptedText}
                            </p>
                            <p>
                                <strong>Extracted Number:</strong>{' '}
                                {result.isKeyMessage ? (
                                    'N/A (Key message was entered)'
                                ) : result.isPartial ? (
                                    <span style={{ color: 'orange', fontWeight: 'bold' }}>⚠ TWENTY or TWENTYFIVE — Continue entering morse code to determine which one.</span>
                                ) : result.killNumber ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>{result.killNumber}</span>
                                ) : (
                                    'N/A (Number not detected)'
                                )}
                            </p>
                        </div>

                        {!result.isKeyMessage && !result.isPartial && result.morseOutputCode && (
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid rgba(255,255,255,0.2)' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>🎮 Morse Code to Input on Panel:</p>
                                <div
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: '1.2em',
                                        marginTop: '8px',
                                        padding: '8px',
                                        background: 'rgba(0,0,0,0.3)',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {result.morseOutputCode}
                                </div>
                                <button type="button" className="btn-base" onClick={copyToClipboard} style={{ marginTop: '8px' }}>
                                    📋 Copy Morse Code
                                </button>
                            </div>
                        )}

                        {result.isPartial && (
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid rgba(255,255,255,0.2)' }}>
                                <p>
                                    <strong>🎮 Morse Code to Input on Panel:</strong> N/A (Enter more morse code)
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
