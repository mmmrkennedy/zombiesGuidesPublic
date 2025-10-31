import React, { ChangeEvent, useState } from 'react';

type ElementObj = {
    symbol: string;
    name: string;
    number: number;
};

const periodicElements: ElementObj[] = [
    { symbol: 'H', name: 'Hydrogen', number: 1 },
    { symbol: 'He', name: 'Helium', number: 2 },
    { symbol: 'Li', name: 'Lithium', number: 3 },
    { symbol: 'Be', name: 'Beryllium', number: 4 },
    { symbol: 'B', name: 'Boron', number: 5 },
    { symbol: 'C', name: 'Carbon', number: 6 },
    { symbol: 'N', name: 'Nitrogen', number: 7 },
    { symbol: 'O', name: 'Oxygen', number: 8 },
    { symbol: 'F', name: 'Fluorine', number: 9 },
    { symbol: 'Ne', name: 'Neon', number: 10 },
    { symbol: 'Na', name: 'Sodium', number: 11 },
    { symbol: 'Mg', name: 'Magnesium', number: 12 },
    { symbol: 'Al', name: 'Aluminum', number: 13 },
    { symbol: 'Si', name: 'Silicon', number: 14 },
    { symbol: 'P', name: 'Phosphorus', number: 15 },
    { symbol: 'S', name: 'Sulfur', number: 16 },
    { symbol: 'Cl', name: 'Chlorine', number: 17 },
    { symbol: 'Ar', name: 'Argon', number: 18 },
    { symbol: 'K', name: 'Potassium', number: 19 },
    { symbol: 'Ca', name: 'Calcium', number: 20 },
    { symbol: 'Sc', name: 'Scandium', number: 21 },
    { symbol: 'Ti', name: 'Titanium', number: 22 },
    { symbol: 'V', name: 'Vanadium', number: 23 },
    { symbol: 'Cr', name: 'Chromium', number: 24 },
    { symbol: 'Mn', name: 'Manganese', number: 25 },
    { symbol: 'Fe', name: 'Iron', number: 26 },
    { symbol: 'Co', name: 'Cobalt', number: 27 },
    { symbol: 'Ni', name: 'Nickel', number: 28 },
    { symbol: 'Cu', name: 'Copper', number: 29 },
    { symbol: 'Zn', name: 'Zinc', number: 30 },
    { symbol: 'Ga', name: 'Gallium', number: 31 },
    { symbol: 'Ge', name: 'Germanium', number: 32 },
    { symbol: 'As', name: 'Arsenic', number: 33 },
    { symbol: 'Se', name: 'Selenium', number: 34 },
    { symbol: 'Br', name: 'Bromine', number: 35 },
    { symbol: 'Kr', name: 'Krypton', number: 36 },
    { symbol: 'Rb', name: 'Rubidium', number: 37 },
    { symbol: 'Sr', name: 'Strontium', number: 38 },
    { symbol: 'Y', name: 'Yttrium', number: 39 },
    { symbol: 'Zr', name: 'Zirconium', number: 40 },
    { symbol: 'Nb', name: 'Niobium', number: 41 },
    { symbol: 'Mo', name: 'Molybdenum', number: 42 },
    { symbol: 'Tc', name: 'Technetium', number: 43 },
    { symbol: 'Ru', name: 'Ruthenium', number: 44 },
    { symbol: 'Rh', name: 'Rhodium', number: 45 },
    { symbol: 'Pd', name: 'Palladium', number: 46 },
    { symbol: 'Ag', name: 'Silver', number: 47 },
    { symbol: 'Cd', name: 'Cadmium', number: 48 },
    { symbol: 'In', name: 'Indium', number: 49 },
    { symbol: 'Sn', name: 'Tin', number: 50 },
    { symbol: 'Sb', name: 'Antimony', number: 51 },
    { symbol: 'Te', name: 'Tellurium', number: 52 },
    { symbol: 'I', name: 'Iodine', number: 53 },
    { symbol: 'Xe', name: 'Xenon', number: 54 },
    { symbol: 'Cs', name: 'Cesium', number: 55 },
    { symbol: 'Ba', name: 'Barium', number: 56 },
    { symbol: 'La', name: 'Lanthanum', number: 57 },
    { symbol: 'Ce', name: 'Cerium', number: 58 },
    { symbol: 'Pr', name: 'Praseodymium', number: 59 },
    { symbol: 'Nd', name: 'Neodymium', number: 60 },
    { symbol: 'Pm', name: 'Promethium', number: 61 },
    { symbol: 'Sm', name: 'Samarium', number: 62 },
    { symbol: 'Eu', name: 'Europium', number: 63 },
    { symbol: 'Gd', name: 'Gadolinium', number: 64 },
    { symbol: 'Tb', name: 'Terbium', number: 65 },
    { symbol: 'Dy', name: 'Dysprosium', number: 66 },
    { symbol: 'Ho', name: 'Holmium', number: 67 },
    { symbol: 'Er', name: 'Erbium', number: 68 },
    { symbol: 'Tm', name: 'Thulium', number: 69 },
    { symbol: 'Yb', name: 'Ytterbium', number: 70 },
    { symbol: 'Lu', name: 'Lutetium', number: 71 },
    { symbol: 'Hf', name: 'Hafnium', number: 72 },
    { symbol: 'Ta', name: 'Tantalum', number: 73 },
    { symbol: 'W', name: 'Tungsten', number: 74 },
    { symbol: 'Re', name: 'Rhenium', number: 75 },
    { symbol: 'Os', name: 'Osmium', number: 76 },
    { symbol: 'Ir', name: 'Iridium', number: 77 },
    { symbol: 'Pt', name: 'Platinum', number: 78 },
    { symbol: 'Au', name: 'Gold', number: 79 },
    { symbol: 'Hg', name: 'Mercury', number: 80 },
    { symbol: 'Tl', name: 'Thallium', number: 81 },
    { symbol: 'Pb', name: 'Lead', number: 82 },
    { symbol: 'Bi', name: 'Bismuth', number: 83 },
    { symbol: 'Po', name: 'Polonium', number: 84 },
    { symbol: 'At', name: 'Astatine', number: 85 },
    { symbol: 'Rn', name: 'Radon', number: 86 },
    { symbol: 'Fr', name: 'Francium', number: 87 },
    { symbol: 'Ra', name: 'Radium', number: 88 },
    { symbol: 'Ac', name: 'Actinium', number: 89 },
    { symbol: 'Th', name: 'Thorium', number: 90 },
    { symbol: 'Pa', name: 'Protactinium', number: 91 },
    { symbol: 'U', name: 'Uranium', number: 92 },
    { symbol: 'Np', name: 'Neptunium', number: 93 },
    { symbol: 'Pu', name: 'Plutonium', number: 94 },
    { symbol: 'Am', name: 'Americium', number: 95 },
    { symbol: 'Cm', name: 'Curium', number: 96 },
    { symbol: 'Bk', name: 'Berkelium', number: 97 },
    { symbol: 'Cf', name: 'Californium', number: 98 },
    { symbol: 'Es', name: 'Einsteinium', number: 99 },
    { symbol: 'Fm', name: 'Fermium', number: 100 },
    { symbol: 'Md', name: 'Mendelevium', number: 101 },
    { symbol: 'No', name: 'Nobelium', number: 102 },
    { symbol: 'Lr', name: 'Lawrencium', number: 103 },
    { symbol: 'Rf', name: 'Rutherfordium', number: 104 },
    { symbol: 'Db', name: 'Dubnium', number: 105 },
    { symbol: 'Sg', name: 'Seaborgium', number: 106 },
    { symbol: 'Bh', name: 'Bohrium', number: 107 },
    { symbol: 'Hs', name: 'Hassium', number: 108 },
    { symbol: 'Mt', name: 'Meitnerium', number: 109 },
    { symbol: 'Ds', name: 'Darmstadtium', number: 110 },
    { symbol: 'Rg', name: 'Roentgenium', number: 111 },
    { symbol: 'Cn', name: 'Copernicium', number: 112 },
    { symbol: 'Nh', name: 'Nihonium', number: 113 },
    { symbol: 'Fl', name: 'Flerovium', number: 114 },
    { symbol: 'Mc', name: 'Moscovium', number: 115 },
    { symbol: 'Lv', name: 'Livermorium', number: 116 },
    { symbol: 'Ts', name: 'Tennessine', number: 117 },
    { symbol: 'Og', name: 'Oganesson', number: 118 },
];

function format_element_number(element_number: number): string {
    return '#' + element_number.toString().padStart(3, '0');
}

export default function BO6PeriodicTableSolver() {
    const [elementInput, setElementInput] = useState<string>('');
    const [result, setResult] = useState<React.ReactNode>(<div>Enter a symbol to find matching elements...</div>);

    function filter_elements(periodicElements: ElementObj[], element_input: string): React.ReactNode {
        const inputLower = element_input.toLowerCase();
        const inputReversed = element_input.split('').reverse().join('').toLowerCase();

        const exactMatches = periodicElements.filter(e => {
            const symbolLower = e.symbol.toLowerCase();
            return symbolLower === inputLower || symbolLower === inputReversed;
        });

        const possibleMatches = periodicElements.filter(e => {
            const symbolLower = e.symbol.toLowerCase();
            return symbolLower.includes(inputLower) && !(symbolLower === inputLower || symbolLower === inputReversed);
        });

        return (
            <div>
                {exactMatches.length > 0 && (
                    <div>
                        <strong>Exact Matches:</strong>
                        <ul>
                            {exactMatches.map(e => (
                                <li key={e.symbol}>
                                    <strong>{e.symbol}</strong> – {e.name} ({format_element_number(e.number)})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {possibleMatches.length > 0 && (
                    <div>
                        <strong>Possible Matches:</strong>
                        <ul>
                            {possibleMatches.map(e => (
                                <li key={e.symbol}>
                                    <strong>{e.symbol}</strong> – {e.name} ({format_element_number(e.number)})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {exactMatches.length === 0 && possibleMatches.length === 0 && <div>No matches found</div>}
            </div>
        );
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setElementInput(e.target.value);

        if (e.target.value !== '') {
            setResult(filter_elements(periodicElements, e.target.value));
        } else {
            setResult(<div>Enter a symbol to find matching elements...</div>);
        }
    }

    function reset_input() {
        setElementInput('');
        setResult(<div>Enter a symbol to find matching elements...</div>);
    }

    return (
        <div className="solver-container">
            <h3>Periodic Table Element Finder</h3>
            <p className="solver-instructions">Type 1-2 letters from the in-game monitors. The solver will automatically search forwards and backwards for the element (e.g., "fc" matches Californium "Cf"). Exact matches are shown first, followed by possible matches.</p>
            <div className="form-row">
                <label htmlFor="element-input">Element Letters (1-2 letters): </label>
                <input type="text" pattern="[^0-9]*" id="element-input" className="solver" placeholder="e.g., H, He, Li..." maxLength={2} value={elementInput} onChange={handleInputChange} />
            </div>

            <div className="solver-output">
                <div id="results-container">{result}</div>
            </div>
        </div>
    );
}
