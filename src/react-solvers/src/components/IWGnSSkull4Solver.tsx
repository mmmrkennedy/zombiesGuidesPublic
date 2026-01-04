import React, { useState } from 'react';

const ALPHABET: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
const VALID_WORDS: string[] = ['aldehydes', 'allomer', 'benzene', 'chlorination', 'ethers', 'ethyl', 'hydrogenation', 'neutrino', 'nitriles', 'oxidation', 'reduction', 'solvolysis', 'sublimation', 'zwitterion'];

function letterToNumber(letter: string): number {
    return letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
}

function wordToNumbers(word: string): number[] {
    return word.split('').map(letterToNumber);
}

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

function isValidCombination(second: number, third: number, fourth: number) {
    return !((second === 0 && (third !== 0 || fourth !== 0)) || (third === 0 && fourth !== 0));
}

function calculateSequenceModulo(first: number, second: number, third: number, fourth: number, letterValues: number[]): number {
    const valueOne = letterValues[first];
    const valueTwo = 3 * second + letterValues[second];
    const valueThree = 3 * third * 2 + letterValues[third];
    const valueFour = 3 * fourth * 3 + letterValues[fourth];
    return (valueOne + valueTwo + valueThree + valueFour) % 26;
}

function generateSequenceId(first: number, second: number, third: number, fourth: number): number {
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

function hasDuplicates(array: string[]): boolean {
    const seen = new Set();
    for (const item of array) {
        if (seen.has(item)) {
            return true; // Duplicate found
        }
        seen.add(item);
    }
    return false; // No duplicates
}

function solveCipher(targetWord: string, swingsetLettersArr: string[]): string {
    targetWord = targetWord.toLowerCase();
    let swingsetLetters: string = swingsetLettersArr.join('').toLowerCase();

    // Validate input
    if (swingsetLetters.length !== 4) {
        return 'Error: Swingset letters must be exactly 4 characters.';
    } else if (hasDuplicates(swingsetLettersArr)) {
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

export default function IWGnSSkull4Solver() {
    const [word, setWord] = useState('');
    const [selectedSymbols, setSelectedSymbols] = useState(['', '', '', '']);
    const [result, setResult] = useState('Enter the Word and select 4 symbols.');

    const handleSymbolClick = (letter: string) => {
        // Don't allow selecting already chosen letters
        if (selectedSymbols.includes(letter)) return;

        // Find first empty slot
        const emptyIndex = selectedSymbols.findIndex(s => s === '');
        if (emptyIndex !== -1) {
            const newSymbols = [...selectedSymbols];
            newSymbols[emptyIndex] = letter;
            setSelectedSymbols(newSymbols);
        }
    };

    const handleSolve = () => {
        if (!word.trim()) {
            setResult('Error: Enter a word.');
            return;
        }

        const filledSymbols = selectedSymbols.filter(s => s !== '');
        if (filledSymbols.length !== 4) {
            setResult('Error: Must select exactly 4 symbols.');
            return;
        }

        const solution = solveCipher(word.trim(), selectedSymbols);
        setResult(solution);
    };

    const handleReset = () => {
        setWord('');
        setSelectedSymbols(['', '', '', '']);
        setResult('Enter the Word and select 4 symbols.');
    };

    const isLetterSelected = (letter: string): boolean => selectedSymbols.includes(letter);
    const isSelectionFull = selectedSymbols.filter(s => s !== '').length >= 4;

    return (
        <div className="solver-container">
            <p className="solver-instructions">Select the target word from the dropdown, then click the 4 letter symbols that match the in-game swingset symbols. Click "Calculate" to get the code sequence.</p>
            <div className="form-row">
                <label className="solver-symbol-select" htmlFor="word">
                    Select Word:
                </label>
                <select id="word" className="solver" value={word} onChange={e => setWord(e.target.value)}>
                    <option value="">Choose a word...</option>
                    {VALID_WORDS.map(validWord => (
                        <option key={validWord} value={validWord}>
                            {validWord}
                        </option>
                    ))}
                </select>
            </div>

            <div className="letter-symbols-container">
                {ALPHABET.map(letter => {
                    const isSelected = isLetterSelected(letter);
                    const isDisabled = isSelected || isSelectionFull;

                    return (
                        <div key={letter} className={`letter-symbol-box ${isSelected ? 'selected' : ''} ${isDisabled ? 'img-disabled' : ''}`} onClick={() => !isDisabled && handleSymbolClick(letter)}>
                            <div className="letter-text-side">{letter.toUpperCase()}</div>
                            <div className="letter-image-side">
                                <img src={`/games/IW/wyler_language_symbols/${letter}.webp`} alt={letter.toUpperCase()} className="letter-symbol-image" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="solver-symbol-select">
                <p>Selected Symbols:</p>
                <div className="skull-selected-symbols">
                    {selectedSymbols.map((symbol, index) => (
                        <div
                            key={index}
                            className={`skull-symbol-slot ${symbol ? 'filled' : 'empty'}`}
                            onClick={() => {
                                if (symbol) {
                                    const newSymbols = [...selectedSymbols];
                                    newSymbols[index] = '';
                                    setSelectedSymbols(newSymbols);
                                }
                            }}
                        >
                            {symbol ? (
                                <>
                                    <span className="skull-symbol-label">{symbol.toUpperCase()}</span>
                                    <img src={`/games/IW/wyler_language_symbols/${symbol}.webp`} alt={symbol.toUpperCase()} className="skull-symbol-image" />
                                </>
                            ) : (
                                <span className="skull-slot-number">{index + 1}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <button className="solver-button btn-base" onClick={handleSolve}>
                Calculate
            </button>

            <button className="solver-button btn-base" onClick={handleReset}>
                Reset All
            </button>

            <div className="solver-output">
                <p>
                    <span id="result">{result}</span>
                </p>
            </div>
        </div>
    );
}
