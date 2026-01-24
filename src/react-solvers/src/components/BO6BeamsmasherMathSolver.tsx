import React, { useState } from 'react';

type SymbolKey = 'X' | 'Y' | 'Z';
type SelectedSymbolValue = 0 | 10 | 11 | 20 | 21 | 22 | null;
type SelectedSymbols = {
    X: number | null;
    Y: number | null;
    Z: number | null;
};

const selectedSymbols: SelectedSymbols = { X: null, Y: null, Z: null };

function check_enabled_images(
  image_value: SelectedSymbolValue | undefined,
  letter: SymbolKey,
  img_value: SelectedSymbolValue,
  selectedSymbols: SelectedSymbols
): string {
  if (image_value === img_value) {
    return 'selected';

  } else if (image_value !== null && image_value !== undefined) {
    return 'img-disabled';

  } else {
    // Check if this value is already selected by a different letter
    const otherValues = Object.entries(selectedSymbols)
      .filter(([k]) => k !== letter)
      .map(([_, v]) => v);

    if (otherValues.includes(img_value)) {
      return 'img-disabled';
    }

    return '';
  }
}

function calculateFormulas(selectedSymbols: SelectedSymbols) {
    const { X, Y, Z } = selectedSymbols;

    if (X !== null && Y !== null && Z !== null) {
        // Calculate each formula
        let formula1: number | string = 2 * X + 11;
        let formula2: number | string = 2 * Z + Y - 5;
        let formula3: number | string = Math.abs(Y + Z - X);

        if (formula1 < 0 || formula2 < 0 || formula3 < 0) {
            return 'Invalid Selection (a formula returned a negative number)';
        }

        if (formula1 < 10) {
            formula1 = '0' + String(formula1);
        }

        if (formula2 < 10) {
            formula2 = '0' + String(formula2);
        }

        if (formula3 < 10) {
            formula3 = '0' + String(formula3);
        }

        // Display results
        return 'Code: ' + formula1 + ' - ' + formula2 + ' - ' + formula3;
    } else {
        // Display "N/A" if not all symbols are selected
        return 'N/A';
    }
}

export default function BO6BeamsmasherMathSolver() {
    const [selectedX, setSelectedX] = React.useState<SelectedSymbolValue>();
    const [selectedY, setSelectedY] = React.useState<SelectedSymbolValue>();
    const [selectedZ, setSelectedZ] = React.useState<SelectedSymbolValue>();
    const [result, setResult] = React.useState<string>('N/A');
    const IMG_0 = '/games/BO6/terminus/pictures/beamsmasher/0.webp';
    const IMG_10 = '/games/BO6/terminus/pictures/beamsmasher/10.webp';
    const IMG_11 = '/games/BO6/terminus/pictures/beamsmasher/11.webp';
    const IMG_20 = '/games/BO6/terminus/pictures/beamsmasher/20.webp';
    const IMG_21 = '/games/BO6/terminus/pictures/beamsmasher/21.webp';
    const IMG_22 = '/games/BO6/terminus/pictures/beamsmasher/22.webp';

    function selectSymbol(selectedSymbols: SelectedSymbols, letter: SymbolKey, value: SelectedSymbolValue) {
        letter = letter.toUpperCase() as SymbolKey;

        // Toggle selection
        if (selectedSymbols[letter] === value) {
            // Unselect if the same symbol is clicked again
            selectedSymbols[letter] = null;

            if (letter === 'X') {
                setSelectedX(null);
            }

            if (letter === 'Y') {
                setSelectedY(null);
            }

            if (letter === 'Z') {
                setSelectedZ(null);
            }
        } else {
            selectedSymbols[letter] = value;

            const otherValues = Object.entries(selectedSymbols)
              .filter(([k]) => k !== letter)
              .map(([_, v]) => v);

            if (otherValues.includes(value)){
              return;
            }

            if (letter === 'X') {
                setSelectedX(value);
            }

            if (letter === 'Y') {
                setSelectedY(value);
            }

            if (letter === 'Z') {
                setSelectedZ(value);
            }
        }

        // Calculate formulas
        setResult(calculateFormulas(selectedSymbols));
    }

    function resetAll(selectedSymbols: SelectedSymbols) {
        selectedSymbols['X'] = null;
        selectedSymbols['Y'] = null;
        selectedSymbols['Z'] = null;

        setSelectedX(null);
        setSelectedY(null);
        setSelectedZ(null);

        setResult('N/A');
    }

    return (
        <div className="solver-container beamsmasher">
            <p className="solver-instructions">Click the symbol images that match the sticky notes on the in-game computer (one for X, one for Y, one for Z). The solver will automatically calculate and display the three-part code.</p>

            <div className="solver-symbol-select form-row" id="xSymbols">
                <p>X Symbol:</p>
                <div className={'beamsmasher-img-row'}>
                    <img className={check_enabled_images(selectedX, 'X', 0, selectedSymbols)} src={IMG_0} alt="X0" onClick={() => selectSymbol(selectedSymbols, 'X', 0)} />
                    <img className={check_enabled_images(selectedX, 'X', 10, selectedSymbols)} src={IMG_10} alt="X10" onClick={() => selectSymbol(selectedSymbols, 'X', 10)} />
                    <img className={check_enabled_images(selectedX, 'X', 11, selectedSymbols)} src={IMG_11} alt="X11" onClick={() => selectSymbol(selectedSymbols, 'X', 11)} />
                    <img className={check_enabled_images(selectedX, 'X', 20, selectedSymbols)} src={IMG_20} alt="X20" onClick={() => selectSymbol(selectedSymbols, 'X', 20)} />
                    <img className={check_enabled_images(selectedX, 'X', 21, selectedSymbols)} src={IMG_21} alt="X21" onClick={() => selectSymbol(selectedSymbols, 'X', 21)} />
                    <img className={check_enabled_images(selectedX, 'X', 22, selectedSymbols)} src={IMG_22} alt="X22" onClick={() => selectSymbol(selectedSymbols, 'X', 22)} />
                </div>
            </div>

            <div className="solver-symbol-select form-row" id="ySymbols">
                <p>Y Symbol:</p>
                <div className={'beamsmasher-img-row'}>
                    <img className={check_enabled_images(selectedY, 'Y', 0, selectedSymbols)} src={IMG_0} alt="Y0" onClick={() => selectSymbol(selectedSymbols, 'Y', 0)} />
                    <img className={check_enabled_images(selectedY, 'Y', 10, selectedSymbols)} src={IMG_10} alt="Y10" onClick={() => selectSymbol(selectedSymbols, 'Y', 10)} />
                    <img className={check_enabled_images(selectedY, 'Y', 11, selectedSymbols)} src={IMG_11} alt="Y11" onClick={() => selectSymbol(selectedSymbols, 'Y', 11)} />
                    <img className={check_enabled_images(selectedY, 'Y', 20, selectedSymbols)} src={IMG_20} alt="Y20" onClick={() => selectSymbol(selectedSymbols, 'Y', 20)} />
                    <img className={check_enabled_images(selectedY, 'Y', 21, selectedSymbols)} src={IMG_21} alt="Y21" onClick={() => selectSymbol(selectedSymbols, 'Y', 21)} />
                    <img className={check_enabled_images(selectedY, 'Y', 22, selectedSymbols)} src={IMG_22} alt="Y22" onClick={() => selectSymbol(selectedSymbols, 'Y', 22)} />
                </div>
            </div>

            <div className="solver-symbol-select form-row" id="zSymbols">
                <p>Z Symbol:</p>
                <div className={'beamsmasher-img-row'}>
                    <img className={check_enabled_images(selectedZ, 'Z', 0, selectedSymbols)} src={IMG_0} alt="Z0" onClick={() => selectSymbol(selectedSymbols, 'Z', 0)} />
                    <img className={check_enabled_images(selectedZ, 'Z', 10, selectedSymbols)} src={IMG_10} alt="Z10" onClick={() => selectSymbol(selectedSymbols, 'Z', 10)} />
                    <img className={check_enabled_images(selectedZ, 'Z', 11, selectedSymbols)} src={IMG_11} alt="Z11" onClick={() => selectSymbol(selectedSymbols, 'Z', 11)} />
                    <img className={check_enabled_images(selectedZ, 'Z', 20, selectedSymbols)} src={IMG_20} alt="Z20" onClick={() => selectSymbol(selectedSymbols, 'Z', 20)} />
                    <img className={check_enabled_images(selectedZ, 'Z', 21, selectedSymbols)} src={IMG_21} alt="Z21" onClick={() => selectSymbol(selectedSymbols, 'Z', 21)} />
                    <img className={check_enabled_images(selectedZ, 'Z', 22, selectedSymbols)} src={IMG_22} alt="Z22" onClick={() => selectSymbol(selectedSymbols, 'Z', 22)} />
                </div>
            </div>

            <div className="solver-output" id="codeOutput">
                <p>{result}</p>
            </div>
            <button type="reset" className="btn-base solver-button" onClick={() => resetAll(selectedSymbols)}>
                Reset All
            </button>
        </div>
    );
}
