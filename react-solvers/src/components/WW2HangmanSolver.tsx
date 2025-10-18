import React from 'react';

const possibleWords: string[] = [
    'DAMNATION', // Nuke
    'REAPER', // Insta-Kill
    'GEISTKRAFT', // Full Charge
    'FAMISHED', // Max Ammo
    'GLUTTONY', // Double Jolts
    'WONDER', // Tesla Gun & Ripsaw
    'THEJACKBOX', // Jack-in-the-Boxes
];

function suggestNextLetter(revealedSequence: string, guessedLetters: string): string[] {
    revealedSequence = revealedSequence.toUpperCase();
    guessedLetters = guessedLetters.toUpperCase();

    return possibleWords.filter(word => {
        let wordIndex = 0;
        for (const letter of revealedSequence) {
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

        for (const letter of guessedLetters) {
            if (!word.includes(letter)) {
                continue;
            }
            if (!revealedSequence.includes(letter)) {
                return false;
            }
        }

        return true;
    });
}

export default function WW2HangmanSolver() {
    // State for user input
    const [revealedLetters, setRevealedLetters] = React.useState<string>('');
    const [guessedLetters, setGuessedLetters] = React.useState<string>('');

    // Calculate suggestion whenever input changes
    const result = suggestNextLetter(revealedLetters, guessedLetters);

    return (
        <div className="solver-container" style={{ minWidth: '400px', width: 'auto' }}>
            <h2>Hangman Word Solver</h2>

            <div>
                <label htmlFor="revealed-letters">Correct Letters:</label> <input type="text" id="revealed-letters" value={revealedLetters} onChange={e => setRevealedLetters(e.target.value)} placeholder="All the correct letters in order (e.g. WND, DMN)" className="solver" style={{ width: '350px' }} />
            </div>

            <div>
                <label htmlFor="guessed-letters">Incorrect Letters:</label> <input type="text" id="guessed-letters" value={guessedLetters} onChange={e => setGuessedLetters(e.target.value)} placeholder="Any wrong letters (e.g. ZUQI)" className="solver" style={{ width: '350px' }} />
            </div>

            <div className="solver-output">
                <h3>Possible Words:</h3>
                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    {result.map((word, index) => (
                        <li key={index}>{word}</li>
                    ))}
                </ul>
            </div>

            <div className="solver-output" style={{ display: 'none' }}>
                <h3>Reference Words:</h3>
                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    <li>DAMNATION: Nuke</li>
                    <li>REAPER: Insta-Kill</li>
                    <li>GEISTKRAFT: Full Charge</li>
                    <li>FAMISHED: Max Ammo</li>
                    <li>GLUTTONY: Double Jolts</li>
                    <li>WONDER: Tesla Gun & Ripsaw</li>
                    <li>THEJACKBOX: Jack-in-the-Boxes</li>
                </ul>
            </div>
        </div>
    );
}
