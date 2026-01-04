import React from 'react';

const words: string[] = ['ACTORS', 'AFTERLIFE', 'ANCESTOR', 'ARCADE', 'ARTHUR', 'AUDITION', 'BASEMENT', 'BEVERLYHILLS', 'BLACKCAT', 'BOAT', 'BREEDER', 'BROADWAY', 'BRUTE', 'BUMPERCARS', 'CHARMS', 'COMICBOOKS', 'CRANE', 'CRYPTID', 'DANCE', 'DAVIDARCHER', 'DEATH', 'DIRECTOR', 'DISCO', 'DRAGON', 'DRCROSS', 'FAIRIES', 'FORGEFREEZE', 'GEYSER', 'GHETTO', 'HARPOON', 'HIVES', 'INFERNO', 'KATANA', 'KEVINSMITH', 'KRAKEN', 'KUNGFU', 'LOSANGELES', 'MCINTOSH', 'MEMORIES', 'MEPHISTOPHELES', 'NEWYORK', 'NIGHTFALL', 'NUNCHUCKS', 'OBELISK', 'OCTONIAN', 'PAMGRIER', 'PINKCAT', 'PUNKS', 'RATKING', 'REALITYTV', 'REDWOODS', 'ROLLERCOASTER', 'ROLLERSKATES', 'SAMANTHA', 'SHAOLIN', 'SHIELD', 'SHUFFLE', 'SLASHER', 'SIXTYMILLION', 'SLASHER', 'SLIDE', 'SNAKE', 'SPACELAND', 'STAFF', 'SUBWAY', 'TIGER', 'TREES', 'WEREWOLFPOETS', 'WINONAWYLER', 'YETIEYES', 'ZAPPER'];

function filterWordsByPrefix(prefix: string): string[][] {
    // Filter the words that start with the given prefix
    const filtered_words: string[] = words.filter(word => {
        return word.toLowerCase().startsWith(prefix.toLowerCase());
    });

    let possible_letters: string[] = filtered_words
        .map(word => {
            return word.slice(prefix.length);
        })
        .filter(remaining => remaining.length > 0)
        .map(remaining => remaining.charAt(0));

    possible_letters = [...new Set(possible_letters)];

    return [filtered_words, possible_letters];
}

export default function IWMainQuestWordFilter() {
    const [inputString, setInputString] = React.useState<string>('');
    const [filteredWords, setFilteredWords] = React.useState<string[]>(words);
    const [possibleLetters, setPossibleLetters] = React.useState<string[]>([]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const input: string = e.target.value;
        setInputString(input);

        if (input === '') {
            handleClearInput();
        } else {
            let [filtered_words, possible_letters] = filterWordsByPrefix(input);
            setFilteredWords(filtered_words);
            setPossibleLetters(possible_letters);
        }
    }

    function handleClearInput() {
        setInputString('');
        setFilteredWords(words);
        setPossibleLetters([]);
    }

    return (
        <div className="solver-container">
            <p className="solver-instructions">Enter letters to filter the word list. The solver shows matching words and possible next letters based on your current input.</p>
            <div className="form-row">
                <label htmlFor="prefix-input">Enter letters: </label>
                <input id="prefix-input" type="text" className="solver" value={inputString} onChange={handleInputChange} placeholder="Type letters..." />
            </div>

            {possibleLetters.length > 0 && (
                <div className="solver-output">
                    <h3>Next Possible Letters ({possibleLetters.length}):</h3>
                    <div className="letter-symbols-container">
                        {possibleLetters.sort().map((letter, index) => (
                            <div key={index} className="letter-symbol-box">
                                <div className="letter-text-side">{letter}</div>
                                <div className="letter-image-side">
                                    <img src={`/games/IW/wyler_language_symbols/${letter.toLowerCase()}.webp`} alt={letter} className="letter-symbol-image" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="solver-output">
                <h3>Matching Words ({filteredWords.length}):</h3>
                <div className="matching-words-grid">
                    {filteredWords.map((word, index) => (
                        <div key={index} className="word-item">
                            {word}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
