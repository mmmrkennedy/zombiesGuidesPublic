import { useState } from "preact/hooks";

const possibleWords: string[] = [
    "DAMNATION", // Nuke
    "REAPER", // Insta-Kill
    "GEISTKRAFT", // Full Charge
    "FAMISHED", // Max Ammo
    "GLUTTONY", // Double Jolts
    "WONDER", // Tesla Gun & Ripsaw
    "THEJACKBOX", // Jack-in-the-Boxes
];

function suggestNextLetter(revealedSequence: string, guessedLetters: string): string[] {
    revealedSequence = revealedSequence.toUpperCase();
    guessedLetters = guessedLetters.toUpperCase();

    return possibleWords.filter((word) => {
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

export default function WW2HangmanSolver({ title }: { title?: string }) {
    // State for user input
    const [revealedLetters, setRevealedLetters] = useState<string>("");
    const [guessedLetters, setGuessedLetters] = useState<string>("");

    // Calculate suggestion whenever input changes
    const result = suggestNextLetter(revealedLetters, guessedLetters);

    return (
        <div className="solver-container">
            {title && <h2 className="solver-title">{title}</h2>}
            <form onSubmit={(e) => e.preventDefault()}>
                <p className="solver-instructions">
                    Enter the correct letters in order and any incorrect guesses to find possible words.
                </p>

                <div className="form-row">
                    <label htmlFor="revealed-letters">Correct Letters:</label>
                    <input
                        type="text"
                        id="revealed-letters"
                        value={revealedLetters}
                        onInput={(e) => setRevealedLetters((e.target as HTMLInputElement).value)}
                        placeholder="Correct letters in order"
                        className="solver"
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="guessed-letters">Incorrect Letters:</label>
                    <input
                        type="text"
                        id="guessed-letters"
                        value={guessedLetters}
                        onInput={(e) => setGuessedLetters((e.target as HTMLInputElement).value)}
                        placeholder="Wrong letters"
                        className="solver"
                    />
                </div>

                <div className="solver-output" role="status" aria-live="polite">
                    <h3>Possible Words:</h3>
                    <ul>
                        {result.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                </div>
            </form>
        </div>
    );
}
