import React, { useState } from 'react';

// Type definitions
type Color = 'red' | 'green' | 'blue' | 'black' | 'yellow' | 'white';
type ButtonCount = 3 | 4 | 5 | 6;

interface ColorCounts {
    red: number;
    green: number;
    blue: number;
    black: number;
    yellow: number;
    white: number;
}

const COLORS: Color[] = ['red', 'green', 'blue', 'black', 'yellow', 'white'];

// Helper functions converted from venom_x_box.js
function calcS(arr: Color[]): number {
    return new Set(arr).size;
}

function BL(arr: Color[], colour: Color): number {
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === colour) {
            index = i;
        }
    }
    return index + 1;
}

function isAnyEven(arr: number[]): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0 && arr[i] !== 0) {
            return true;
        }
    }
    return false;
}

function areAllLessThanEqual(arr: number[], num: number): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > num) {
            return false;
        }
    }
    return true;
}

function processArr(buttonArr: Color[]): { counts: ColorCounts; S: number; W: number[]; X: number } {
    const counts: ColorCounts = {
        red: 0,
        green: 0,
        blue: 0,
        black: 0,
        yellow: 0,
        white: 0,
    };

    const X = buttonArr.length;

    for (let i = 0; i < X; i++) {
        const color = buttonArr[i].toLowerCase() as Color;
        counts[color]++;
    }

    const S = calcS(buttonArr);
    const W = [counts.red, counts.green, counts.blue, counts.black, counts.yellow, counts.white];

    return { counts, S, W, X };
}

function venomBoxCalc(buttonArr: Color[]): string {
    const { counts, S, W, X } = processArr(buttonArr);

    if (X === 3) {
        // c1, (!bl) ? B3 : c2;
        if (counts.black === 0) {
            return 'Press Button #3';
        }

        // c2, (BL = g) ? B1 : c3;
        if (buttonArr[X - 1] === 'green') {
            return 'Press Button #1';
        }

        // c3, (sum(r) > 1) ? BL(r) : c4;
        if (counts.red > 1) {
            return `Press Button #${BL(buttonArr, 'red')}`;
        }

        // c4, B2
        return 'Press Button #2';
    } else if (X === 4) {
        // c1, ((sum(y) > 1) && S >= 2 ? BL(y) : c2;
        if (counts.yellow > 1 && S >= 2) {
            return `Press Button #${BL(buttonArr, 'yellow')}`;
        }

        // c2, ((BL(w) && sum(b) = 0) ? B1 : c3;
        if (buttonArr[X - 1] === 'white' && counts.blue === 0) {
            return 'Press Button #1';
        }

        // c3, (sum(bl) > 1) ? BL : c4;
        if (counts.black > 1) {
            return `Press Button #${X}`;
        }

        // c4, B3
        return 'Press Button #3';
    } else if (X === 5) {
        // c1, (W <= 3) ? W1 : c2;
        if (areAllLessThanEqual(W, 3)) {
            return 'Press Button #1';
        }

        // c2, (sum(w) = 1 && sum(b) > 1) ? W2 : c3;
        if (counts.white === 1 && counts.blue > 1) {
            return 'Press Button #2';
        }

        // c3, (sum(r) = 0 && W % 2 = 0 && S < 4) ? WL : c4;
        if (counts.red === 0 && isAnyEven(W) && S < 4) {
            return 'Press Button #5';
        }

        // c4, W1
        return 'Press Button #1';
    } else if (X === 6) {
        // c1, (sum(y) != 0)
        if (counts.yellow !== 0) {
            return 'Press Button #3';
        }

        // c2, (sum(bl) = 1 && sum(w) > 1) ? W4 : c3;
        if (counts.black === 1 && counts.white > 1) {
            return 'Press Button #4';
        }

        // c3, (S >=1 && sum(r) > 1) ? W5 : c4;
        if (S >= 1 && counts.red > 1) {
            return 'Press Button #5';
        }

        // c4, BL
        return 'Press Button #6';
    }

    return '';
}

export default function IWBeastVenomXBoxSolver() {
    const [buttonCount, setButtonCount] = useState<ButtonCount>(3);
    const [selectedColors, setSelectedColors] = useState<Color[]>(['red', 'red', 'red']);

    const handleButtonCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCount = parseInt(e.target.value) as ButtonCount;
        setButtonCount(newCount);
        // Initialize colors array when button count changes
        const initialColors = Array(newCount).fill('red') as Color[];
        setSelectedColors(initialColors);
    };

    const handleColorChange = (index: number, color: Color) => {
        const newColors = [...selectedColors];
        newColors[index] = color;
        setSelectedColors(newColors);
    };

    // Calculate result directly from state
    const result = selectedColors.length === buttonCount ? venomBoxCalc(selectedColors) : '';

    return (
        <div className="solver-container">
            <p className="solver-instructions">Select the number of buttons, then set each buttons colour to the same order as the ones in-game (from top to bottom). The Solution will automatically appear.</p>
            <div className="form-row">
                <label htmlFor="venom-x-box-button-selector">Select the number of buttons:</label>
                <select id="venom-x-box-button-selector" name="venom-x-box" value={buttonCount} onChange={handleButtonCountChange}>
                    <option value="3">3 Buttons</option>
                    <option value="4">4 Buttons</option>
                    <option value="5">5 Buttons</option>
                    <option value="6">6 Buttons</option>
                </select>
            </div>

            <div id="venom-x-box-buttons" className="venom-box-buttons">
                {Array.from({ length: buttonCount }, (_, i) => (
                    <div className="form-row">
                        <div key={i} className="venom-box-row">
                            <label htmlFor={`venom-button-${i}`} className="venom-box-label">
                                Button {i + 1}:
                            </label>
                            <select id={`venom-button-${i}`} name="venom-button" value={selectedColors[i]} onChange={e => handleColorChange(i, e.target.value as Color)}>
                                {COLORS.map(color => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <div className="solver-output" id="venom-x-box-result">
                <p>{result}</p>
            </div>
        </div>
    );
}
