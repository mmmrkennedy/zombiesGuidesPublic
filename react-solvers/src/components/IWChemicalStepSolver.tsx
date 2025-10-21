import React, { useState, useEffect } from 'react';

const ingredient_number_data: Record<string, number[]> = {
    'Racing Fuel': [5, 6, 6, 6, 6, 8, 11, 13, 14, 14, 14, 16],
    'Insect Repellent': [11, 9, 15, 7, 16, 12, 7, 14, 10, 15, 6, 3],
    Vodka: [11, 12, 4, 4, 11, 6, 16, 9, 16, 11, 16, 11],
    'Baking Soda': [18, 10, 13, 12, 14, 10, 6, 16, 11, 13, 11, 8],
    Detergent: [16, 14, 11, 8, 13, 13, 16, 10, 16, 8, 6, 9],
    'Food Coloring': [15, 10, 16, 13, 17, 11, 12, 11, 12, 11, 6, 13],
    'Drain Opener': [14, 9, 10, 14, 15, 11, 7, 9, 6, 8, 16, 13],
    Quarters: [7, 10, 11, 12, 12, 13, 9, 9, 4, 5, 12, 8],
    'Glass Cleaner': [7, 15, 7, 10, 10, 18, 8, 13, 13, 10, 16, 7],
    'Nail Polish Remover': [5, 6, 9, 14, 9, 11, 17, 8, 9, 5, 9, 7],
    Pennies: [14, 13, 17, 13, 5, 11, 14, 7, 8, 11, 7, 14],
    'Pool Cleaner': [10, 14, 16, 7, 17, 16, 16, 3, 11, 15, 10, 16],
    'Plant Food': [11, 9, 10, 3, 13, 17, 13, 10, 13, 11, 7, 16],
    Paint: [16, 12, 13, 4, 8, 10, 15, 5, 3, 7, 5, 8],
    Vinegar: [6, 11, 18, 16, 10, 6, 11, 2, 7, 5, 6, 11],
    Ice: [14, 10, 8, 9, 3, 13, 2, 7, 6, 10, 10, 13],
    Bleach: [16, 13, 15, 13, 5, 11, 6, 7, 4, 10, 7, 10],
    'Powdered Milk': [4, 8, 7, 12, 12, 8, 2, 10, 10, 15, 7, 10],
    Fat: [8, 8, 10, 12, 12, 14, 12, 12, 15, 16, 10, 5],
    'Motor Oil': [7, 7, 11, 9, 14, 9, 9, 8, 11, 15, 9, 8],
    'Wheel Cleaner': [11, 13, 6, 12, 13, 10, 13, 10, 8, 6, 13, 10],
    'Table Salt': [17, 16, 8, 12, 16, 8, 8, 8, 9, 7, 15, 7],
    Acetaldehyde: [10, 15, 12, 15, 9, 12, 12, 8, 12, 12, 8, 9],
    Glycerol: [11, 14, 4, 11, 11, 12, 18, 10, 10, 13, 9, 9],
    Methylbenzene: [10, 15, 10, 17, 11, 10, 12, 10, 17, 7, 8, 12],
    'Nitrated Glycerol Solution': [5, 7, 13, 11, 12, 13, 10, 8, 16, 9, 14, 13],
    'Mixed Acid Solution': [12, 11, 14, 16, 12, 15, 16, 5, 13, 5, 8, 8],
    Hexamine: [10, 8, 15, 11, 6, 5, 11, 6, 12, 14, 8, 8],
    'Phenolsulfonic Acid': [12, 12, 17, 9, 4, 8, 10, 14, 15, 17, 13, 9],
    Phenol: [17, 14, 13, 11, 7, 13, 11, 4, 8, 8, 10, 7],
    Sludge: [11, 8, 15, 4, 15, 11, 8, 18, 10, 11, 7, 12],
    Formaldehyde: [6, 12, 9, 9, 13, 12, 13, 11, 10, 13, 14, 11],
    Dinitro: [12, 11, 13, 8, 13, 9, 9, 10, 12, 15, 7, 12],
};

const INSECT_MAP = {
    3: 'L',
    6: 'K',
    9: 'B',
    10: 'I',
    11: 'A',
    12: 'F',
    14: 'H',
    16: 'E',
} as const;

const RACING_MAP = {
    6: 'C',
    7: 'D',
    11: 'G',
    14: 'J',
} as const;

const ingredient_links: Record<string, string> = {
    'Baking Soda': 'pictures/ingredients/baking_soda.webp',
    Detergent: 'pictures/ingredients/detergent.webp',
    'Drain Opener': 'pictures/ingredients/drain_opener.webp',
    Fat: 'pictures/ingredients/fat.webp',
    'Glass Cleaner': 'pictures/ingredients/glass_cleaner.webp',
    Ice: 'pictures/ingredients/ice.webp',
    'Insect Repellent': 'pictures/ingredients/insect.webp',
    'Motor Oil': 'pictures/ingredients/motor_oil.webp',
    'Nail Polish Remover': 'pictures/ingredients/nail_polish.webp',
    Paint: 'pictures/ingredients/paint.webp',
    Pennies: 'pictures/ingredients/pennies.webp',
    'Plant Food': 'pictures/ingredients/plant_food.webp',
    Quarters: 'pictures/ingredients/quarters.webp',
    'Racing Fuel': 'pictures/ingredients/racing_fuel.webp',
    Vinegar: 'pictures/ingredients/vinegar.webp',
    Vodka: 'pictures/ingredients/vodka.webp',
    'Wheel Cleaner': 'pictures/ingredients/wheel_cleaner.webp',
};

type InsectKey = keyof typeof INSECT_MAP;
type RacingKey = keyof typeof RACING_MAP;
type ChemicalType = 'chem_1' | 'chem_2' | 'chem_3' | 'chem_4' | 'chem_5' | 'default';

interface Formula {
    name: string;
    ingredients: string[];
}

const isInsectKey = (num: number): num is InsectKey => num in INSECT_MAP;
const isRacingKey = (num: number): num is RacingKey => num in RACING_MAP;

function getValidONums(mNum: number, possibleFinalNums: number[]): [number[], number[]] {
    const defaultONums: number[] = [2, 4, 5, 6, 8, 9, 11, 15];
    const possibleTVNumbers: number[] = [];
    const possibleONums: number[] = [];

    for (let index = 0; index < defaultONums.length; index++) {
        const colourNum = mNum * defaultONums[index];

        if (possibleFinalNums.includes(colourNum)) {
            possibleTVNumbers.push(colourNum);
            possibleONums.push(defaultONums[index]);
        }
    }
    return [possibleTVNumbers, possibleONums];
}

function getColorOption(possibleTVNumbers: number[], possibleFinalNums: number[]): string | undefined {
    if (possibleTVNumbers.length === 0) return undefined;

    const options = ['Top Colour', 'Middle Colour', 'Bottom Colour'];

    if (possibleTVNumbers.length === 1) {
        return options[possibleFinalNums.indexOf(possibleTVNumbers[0])];
    }

    return possibleTVNumbers.map(num => options[possibleFinalNums.indexOf(num)]).join(' or ');
}

function getLetter(insectNum: number, racingNum: number): string {
    if (insectNum === 0) {
        return 'Enter your Insect Number';
    }

    if (isInsectKey(insectNum)) {
        return INSECT_MAP[insectNum];
    }

    if (insectNum === 7 || insectNum === 15) {
        if (isRacingKey(racingNum)) {
            return RACING_MAP[racingNum];
        }
        return 'Invalid Racing Num';
    }

    return 'Invalid Insect Num';
}

function getTvOptionWithONum(oNum: number, mNum: number, lowerBound: number): string {
    const possibleFinalNums = [lowerBound - 1, lowerBound + 1, lowerBound + 3];
    const options = ['Top Colour', 'Middle Colour', 'Bottom Colour'];
    const realTvNumber = oNum * mNum;
    return options[possibleFinalNums.indexOf(realTvNumber)] || 'Invalid';
}

function mainLogic(mNum: number, lowerBound: number, insectNum: number, racingNum: number): string | [string, string | undefined, string, number[]] {
    const possibleFinalNums = [lowerBound - 1, lowerBound + 1, lowerBound + 3];
    const [possibleTVNumbers, possibleONums] = getValidONums(mNum, possibleFinalNums);

    if (possibleTVNumbers.length === 0 || possibleONums.length === 0) {
        return 'Invalid M number or TV number, please try again.';
    }

    let oNumStr = '';
    if (possibleONums.length === 1) {
        oNumStr = possibleONums[0].toString();
    } else {
        oNumStr = possibleONums.join(' or ');
    }

    return [oNumStr, getColorOption(possibleTVNumbers, possibleFinalNums), getLetter(insectNum, racingNum), possibleONums];
}

function calcChemNums(oNum: number, letter: string, chemical: ChemicalType): string {
    const columns = 'ABCDEFGHIJKL';
    const index = columns.indexOf(letter.toUpperCase());

    if (index === -1) return 'Invalid letter';

    let formulas: Formula[] = [];

    switch (chemical) {
        case 'chem_1':
            formulas = [
                { name: 'Formula 1', ingredients: ['Racing Fuel', 'Quarters'] },
                { name: 'Formula 2', ingredients: ['Vodka', 'Pennies'] },
                { name: 'Formula 3', ingredients: ['Detergent', 'Acetaldehyde', 'Formaldehyde'] },
                { name: 'Formula 4', ingredients: ['Nail Polish Remover', 'Sludge'] },
            ];
            break;
        case 'chem_2':
            formulas = [
                { name: 'Formula 1', ingredients: ['Motor Oil', 'Wheel Cleaner', 'Insect Repellent'] },
                { name: 'Formula 2', ingredients: ['Phenol', 'Drain Opener'] },
                { name: 'Formula 3', ingredients: ['Phenolsulfonic Acid', 'Detergent'] },
            ];
            break;
        case 'chem_3':
            formulas = [
                { name: 'Formula 1', ingredients: ['Racing Fuel', 'Quarters'] },
                { name: 'Formula 2', ingredients: ['Glass Cleaner', 'Formaldehyde'] },
                { name: 'Formula 3', ingredients: ['Vinegar', 'Plant Food', 'Detergent', 'Hexamine'] },
            ];
            break;
        case 'chem_4':
            formulas = [
                { name: 'Formula 1', ingredients: ['Paint', 'Detergent', 'Drain Opener'] },
                { name: 'Formula 2', ingredients: ['Baking Soda', 'Vinegar', 'Detergent', 'Methylbenzene'] },
                { name: 'Formula 3', ingredients: ['Racing Fuel', 'Dinitro'] },
            ];
            break;
        case 'chem_5':
            formulas = [
                { name: 'Formula 1', ingredients: ['Fat', 'Vodka'] },
                { name: 'Formula 2', ingredients: ['Detergent', 'Drain Opener'] },
                { name: 'Formula 3', ingredients: ['Ice', 'Glycerol', 'Mixed Acid Solution'] },
                { name: 'Formula 4', ingredients: ['Mixed Acid Solution', 'Baking Soda'] },
            ];
            break;
        default:
            return `Invalid Chemical. Chem Value Debug: ${chemical}`;
    }

    let resultStr = '';
    formulas.forEach(({ name, ingredients }) => {
        let formulaResult = 0;
        const linkedIngredients = ingredients.map(ing => {
            formulaResult += ingredient_number_data[ing][index];
            const link = ingredient_links[ing];
            return link ? `<a href="${link}">${ing}</a>` : ing;
        });
        formulaResult -= oNum;
        const ingredientList = linkedIngredients.join(' + ');
        resultStr += `${name}: ${ingredientList} <b>---</b> Number: ${formulaResult}\n`;
    });

    return resultStr;
}

function formatResult(oNum: string | number, colourOption: string | undefined): string {
    const oNumStr = `O Number: ${oNum}.`;
    const colourStr = `Colour Option: ${colourOption || 'Unknown'} on the TV.`;
    return `${oNumStr}\n${colourStr}`;
}

export default function IWChemicalStepSolver() {
    const [mNum, setMNum] = useState<number>(0);
    const [lowerBound, setLowerBound] = useState<number>(0);
    const [insectNum, setInsectNum] = useState<number>(0);
    const [racingNum, setRacingNum] = useState<number>(0);
    const [oNum, setONum] = useState<number>(0);
    const [finalChem, setFinalChem] = useState<ChemicalType>('default');
    const [result, setResult] = useState<string>('');

    // Visibility states
    const [showStep2, setShowStep2] = useState<boolean>(false);
    const [showStep3, setShowStep3] = useState<boolean>(false);
    const [showInsectContainer, setShowInsectContainer] = useState<boolean>(false);
    const [showRacingContainer, setShowRacingContainer] = useState<boolean>(false);
    const [showONumContainer, setShowONumContainer] = useState<boolean>(false);
    const [showFinalChemContainer, setShowFinalChemContainer] = useState<boolean>(false);

    const resetAll = () => {
        setMNum(0);
        setLowerBound(0);
        setInsectNum(0);
        setRacingNum(0);
        setONum(0);
        setFinalChem('default');
        setResult('');
        setShowStep2(false);
        setShowStep3(false);
        setShowInsectContainer(false);
        setShowRacingContainer(false);
        setShowONumContainer(false);
        setShowFinalChemContainer(false);
    };

    const noHandHolding = () => {
        setShowStep2(true);
        setShowStep3(true);
        setShowInsectContainer(true);
        setShowRacingContainer(true);
        setShowONumContainer(true);
        setShowFinalChemContainer(true);
    };

    const calculate = () => {
        let resultText = '';

        if (mNum === 0 || lowerBound === 0) {
            return;
        }

        let validONum = true;
        let racingNumNeeded = false;
        let insectNumNeeded = false;

        const calcResults = mainLogic(mNum, lowerBound, insectNum, racingNum);

        if (typeof calcResults === 'string') {
            setResult(calcResults);
            return;
        }

        let [oNumResult, colourOptionTv, letter, oNumNumbers] = calcResults;
        let finalONum: string | number = oNumResult;

        if (oNum !== 0) {
            if (oNumNumbers.includes(oNum)) {
                finalONum = oNum;
                colourOptionTv = getTvOptionWithONum(oNum, mNum, lowerBound);
            } else {
                resultText += `Enter one of the possible correct O Numbers: ${oNumResult}.\n`;
            }
        }

        setShowStep2(true);

        if (letter === 'Invalid Insect Num') {
            resultText += 'Insect Number is Invalid, please enter a valid Insect Number\n';
            setShowInsectContainer(true);
            insectNumNeeded = true;
        } else if (letter === 'Enter your Insect Number') {
            resultText += letter + '.\n';
            setShowInsectContainer(true);
            insectNumNeeded = true;
        }

        if (String(finalONum).includes('or')) {
            resultText += "Please enter the correct O Number (The correct one couldn't be determined due to there being multiple potential 'correct' options based on the given info). O Number options listed below.\n\n";
            setShowONumContainer(true);
            setShowStep3(true);
            validONum = false;
        }

        if (letter === 'Invalid Racing Num') {
            resultText += 'Unable to calculate result only using the Insect Repellent Number, please enter the Racing Fuel Number and try again.\n';
            setShowRacingContainer(true);
            setShowStep3(true);
            racingNumNeeded = true;
        }

        if (finalChem === 'default') {
            resultText += 'Enter the final chemical.\n\n';
            setShowFinalChemContainer(true);
        } else if (showStep2) {
            setShowFinalChemContainer(true);
        }

        resultText += formatResult(finalONum, colourOptionTv);

        if (!validONum || finalChem === 'default' || racingNumNeeded || insectNumNeeded) {
            setResult(resultText);
            return;
        }

        const oNumValue = typeof finalONum === 'string' ? parseInt(finalONum) : finalONum;
        if (!isNaN(oNumValue)) {
            resultText += '\n\n' + calcChemNums(oNumValue, letter, finalChem);
        }

        setResult(resultText);
    };

    // M = 12, <## = 105, Insect = 6, Racing = 14

    return (
        <div className="solver-container left">
            <h2>Attack Chemical Step Solver</h2>

            <p className="sub-sub-step">Step 1</p>
            <div>
                <label htmlFor="mNum">Enter the M Number: </label>
                <input type="text" pattern="[0-9]*" inputMode="numeric" id="mNum" className="solver" value={mNum || ''} onChange={e => setMNum(Number(e.target.value))} />
            </div>

            <div>
                <label htmlFor="lowerBound">Enter the Top Number on TV (&lt; ##): </label>
                <input type="text" pattern="[0-9]*" inputMode="numeric" id="lowerBound" className="solver" value={lowerBound || ''} onChange={e => setLowerBound(Number(e.target.value))} />
            </div>

            {showStep2 && <p className="sub-sub-step">Step 2</p>}

            {showInsectContainer && (
                <div>
                    <label htmlFor="insectNum">Enter Insect Repellent Number (Top Num + Left Num) in given colour mode: </label>
                    <input type="text" pattern="[0-9]*" inputMode="numeric" id="insectNum" className="solver" value={insectNum || ''} onChange={e => setInsectNum(Number(e.target.value))} />
                </div>
            )}

            {showFinalChemContainer && (
                <div>
                    <label htmlFor="finalChem">Select Final Chemical: </label>
                    <select id="finalChem" className="spacing" value={finalChem} onChange={e => setFinalChem(e.target.value as ChemicalType)}>
                        <option value="default" disabled>
                            Select Chemical
                        </option>
                        <option value="chem_1">3,4-di-nitroxy-methyl-propane</option>
                        <option value="chem_2">1,3,5 tera-nitro-phenol</option>
                        <option value="chem_3">Octa-hydro-2,5-nitro-3,4,7-para-zokine</option>
                        <option value="chem_4">3-methyl-2,4-di-nitrobenzene</option>
                        <option value="chem_5">2,4-propane-3,5-tetra-nitrite</option>
                    </select>
                </div>
            )}

            {showStep3 && <p className="sub-sub-step">Step 3</p>}

            {showRacingContainer && (
                <div>
                    <label htmlFor="racingNum">Enter Racing Fuel Number (Top Num + Left Num): </label>
                    <input type="text" pattern="[0-9]*" inputMode="numeric" id="racingNum" className="solver" value={racingNum || ''} onChange={e => setRacingNum(Number(e.target.value))} />
                </div>
            )}

            {showONumContainer && (
                <div>
                    <label htmlFor="oNum">Enter O Number: </label>
                    <input type="text" pattern="[0-9]*" inputMode="numeric" id="oNum" className="solver" value={oNum || ''} onChange={e => setONum(Number(e.target.value))} />
                </div>
            )}

            <button className="btn-base solver-button" onClick={calculate}>
                Calculate
            </button>
            <button className="btn-base solver-button" onClick={resetAll}>
                Reset All
            </button>
            <button className="btn-base solver-button" onClick={noHandHolding}>
                I know what I'm doing
            </button>

            <div className="solver-output">
                <p>
                    <span dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br>') }}></span>
                </p>
            </div>
        </div>
    );
}
