function main_logic(mNum, lowerBound, insectNum, racingNum = undefined) {
    /*
    if (lowerBound > upperBound) {
        let [lowerBound, upperBound] = [upperBound, lowerBound]
    } else if (lowerBound === upperBound) {
        return "Top number can't be the same Bottom number"
    }
     */

    const possibleFinalNums = [lowerBound - 1, lowerBound + 1, lowerBound + 3];

    // getValidONums checks the given mNum against the possible oNums to see which matches the given TV numbers (possibleFinalNums)
    const [possibleTVNumbers, possibleONums] = getValidONums(mNum, possibleFinalNums);

    // === Determine 'oNum' String ===
    let oNumStr = "";
    let oNumStrCounter = 0;
    let oNumNumbers = [];

    if (possibleONums.length === 1) {
        oNumStr += possibleONums[0];

    } else if (possibleONums.length >= 2) {
        for (const index of possibleONums) {
            if (oNumStrCounter === 0) {
                oNumStr += index
                oNumStrCounter += 1;
            } else {
                oNumStr += " or " + index;
            }
            oNumNumbers.push(index)
        }
    }

    // === Return Results ===
    return [oNumStr, getColorOption(possibleTVNumbers, possibleFinalNums), getLetter(insectNum, racingNum), oNumNumbers];
}

function getValidONums(mNum, possibleFinalNums) {
    // === Default O Numbers  ===
    const defaultONums = [2, 4, 5, 6, 8, 9, 11, 15]; // These are the only numbers the O-number can ever be.

    // === Calculate Possible Results ===
    let possibleTVNumbers = []; // A TV number is a number that can be obtained by multiplying the mNum by an oNum. It is used to compare to the numbers on the TV to get the right colour.
    let possibleONums = [];

    for (let index = 0; index < defaultONums.length; index++) {
        let colourNum = mNum * defaultONums[index];

        if (colourNum === possibleFinalNums[0] || colourNum === possibleFinalNums[1] || colourNum === possibleFinalNums[2]) {
            possibleTVNumbers.push(colourNum);
            possibleONums.push(defaultONums[index]);
        }
    }
    return [possibleTVNumbers, possibleONums];
}

function getColorOption(possibleTVNumbers, possibleFinalNums) {
    if (possibleTVNumbers.length === 0)
        return undefined;

    const options = ["Top Colour", "Middle Colour", "Bottom Colour"];

    if (possibleTVNumbers.length === 1) {
        return options[possibleFinalNums.indexOf(possibleTVNumbers[0])];
    }

    return possibleTVNumbers
        .map(num => options[possibleFinalNums.indexOf(num)])
        .join(" or ");
}

function getLetter(insectNum, racingNum) {
    const insectMap = {
        3: "L",
        6: "K",
        9: "B",
        10: "I",
        11: "A",
        12: "F",
        14: "H",
        16: "E"
    };

    const racingMap = {
        6: "C",
        7: "D",
        11: "G",
        14: "J"
    };

    if (insectMap[insectNum]) {
        return insectMap[insectNum];
    } else if (insectNum === 7 || insectNum === 15) {
        return racingMap[racingNum] || "Invalid Racing Num";
    } else {
        return "Invalid Insect Num";
    }
}

function get_tv_option_with_o_num(oNum, mNum, lowerBound){
    const possibleFinalNums = [lowerBound - 1, lowerBound + 1, lowerBound + 3];
    const options = ["Top Colour", "Middle Colour", "Bottom Colour"];

    const [possibleTVNumbers, possibleONums] = getValidONums(mNum, possibleFinalNums);

    let real_tv_number = oNum * mNum;

    return options[possibleTVNumbers.indexOf(real_tv_number)]
}

function calc_chem_nums(o_num, letter, chemical){
    const columns = "ABCDEFGHIJKL";
    const ingredient_data = {
        "Racing Fuel": [5, 6, 6, 6, 6, 8, 11, 13, 14, 14, 14, 16],
        "Insect Repellent": [11, 9, 15, 7, 16, 12, 7, 14, 10, 15, 6, 3],
        "Vodka": [11, 12, 4, 4, 11, 6, 16, 9, 16, 11, 16, 11],
        "Baking Soda": [18, 10, 13, 12, 14, 10, 6, 16, 11, 13, 11, 8],
        "Detergent": [16, 14, 11, 8, 13, 13, 16, 10, 16, 8, 6, 9],
        "Food Coloring": [15, 10, 16, 13, 17, 11, 12, 11, 12, 11, 6, 13],
        "Drain Opener": [14, 9, 10, 14, 15, 11, 7, 9, 6, 8, 16, 13],
        "Quarters": [7, 10, 11, 12, 12, 13, 9, 9, 4, 5, 12, 8],
        "Glass Cleaner": [7, 15, 7, 10, 10, 18, 8, 13, 13, 10, 16, 7],
        "Nail Polish Remover": [5, 6, 9, 14, 9, 11, 17, 8, 9, 5, 9, 7],
        "Pennies": [14, 13, 17, 13, 5, 11, 14, 7, 8, 11, 7, 14],
        "Pool Cleaner": [10, 14, 16, 7, 17, 16, 16, 3, 11, 15, 10, 16],
        "Plant Food": [11, 9, 10, 3, 13, 17, 13, 10, 13, 11, 7, 16],
        "Paint": [16, 12, 13, 4, 8, 10, 15, 5, 3, 7, 5, 8],
        "Vinegar": [6, 11, 18, 16, 10, 6, 11, 2, 7, 5, 6, 11],
        "Ice": [14, 10, 8, 9, 3, 13, 2, 7, 6, 10, 10, 13],
        "Bleach": [16, 13, 15, 13, 5, 11, 6, 7, 4, 10, 7, 10],
        "Powdered Milk": [4, 8, 7, 12, 12, 8, 2, 10, 10, 15, 7, 10],
        "Fat": [8, 8, 10, 12, 12, 14, 12, 12, 15, 16, 10, 5],
        "Motor Oil": [7, 7, 11, 9, 14, 9, 9, 8, 11, 15, 9, 8],
        "Wheel Cleaner": [11, 13, 6, 12, 13, 10, 13, 10, 8, 6, 13, 10],
        "Table Salt": [17, 16, 8, 12, 16, 8, 8, 8, 9, 7, 15, 7],
        "Acetaldehyde": [10, 15, 12, 15, 9, 12, 12, 8, 12, 12, 8, 9],
        "Glycerol": [11, 14, 4, 11, 11, 12, 18, 10, 10, 13, 9, 9],
        "Methylbenzene": [10, 15, 10, 17, 11, 10, 12, 10, 17, 7, 8, 12],
        "Nitrated Glycerol Solution": [5, 7, 13, 11, 12, 13, 10, 8, 16, 9, 14, 13],
        "Mixed Acid Solution": [12, 11, 14, 16, 12, 15, 16, 5, 13, 5, 8, 8],
        "Hexamine": [10, 8, 15, 11, 6, 5, 11, 6, 12, 14, 8, 8],
        "Phenolsulfonic Acid": [12, 12, 17, 9, 4, 8, 10, 14, 15, 17, 13, 9],
        "Phenol": [17, 14, 13, 11, 7, 13, 11, 4, 8, 8, 10, 7],
        "Sludge": [11, 8, 15, 4, 15, 11, 8, 18, 10, 11, 7, 12],
        "Formaldehyde": [6, 12, 9, 9, 13, 12, 13, 11, 10, 13, 14, 11],
        "Dinitro": [12, 11, 13, 8, 13, 9, 9, 10, 12, 15, 7, 12]
    };

    let result_str = "";
    const index = columns.indexOf(letter.toUpperCase());
    let formulas;

    if (chemical === "chem_1") {  // 3,4-di-nitroxy-methyl-propane
        formulas = [
            { name: "Formula 1", ingredients: ['Racing Fuel', 'Quarters'] },
            { name: "Formula 2", ingredients: ['Vodka', 'Pennies'] },
            { name: "Formula 3", ingredients: ['Detergent', 'Acetaldehyde', 'Formaldehyde'] },
            { name: "Formula 4", ingredients: ['Nail Polish Remover', 'Sludge'] }
        ];

    } else if (chemical === "chem_2") {  // 1,3,5 tera-nitro-phenol
        formulas = [
            { name: "Formula 1", ingredients: ['Motor Oil', 'Wheel Cleaner', 'Insect Repellent'] },
            { name: "Formula 2", ingredients: ['Phenol', 'Drain Opener'] },
            { name: "Formula 3", ingredients: ['Phenolsulfonic Acid', 'Detergent'] }
        ];

    } else if (chemical === "chem_3") {  // Octa-hydro-2,5-nitro-3,4,7-para-zokine
        formulas = [
            { name: "Formula 1", ingredients: ['Racing Fuel', 'Quarters'] },
            { name: "Formula 2", ingredients: ['Glass Cleaner', 'Formaldehyde'] },
            { name: "Formula 3", ingredients: ['Vinegar', 'Plant Food', 'Detergent', 'Hexamine'] }
        ];

    } else if (chemical === "chem_4") {  // 3-methyl-2,4-di-nitrobenzene
        formulas = [
            { name: "Formula 1", ingredients: ['Paint', 'Detergent', 'Drain Opener'] },
            { name: "Formula 2", ingredients: ['Baking Soda', 'Vinegar', 'Detergent', 'Methylbenzene'] },
            { name: "Formula 3", ingredients: ['Racing Fuel', 'Dinitro'] }
        ];

    } else if (chemical === "chem_5"){  // 2,4-propane-3,5-tetra-nitrite
        formulas = [
            { name: "Formula 1", ingredients: ['Fat', 'Vodka'] },
            { name: "Formula 2", ingredients: ['Detergent', 'Drain Opener'] },
            { name: "Formula 3", ingredients: ['Ice', 'Glycerol', 'Mixed Acid Solution'] },
            { name: "Formula 4", ingredients: ['Mixed Acid Solution', 'Baking Soda'] }
        ];

    } else {
        return "Invalid Chemical. Chem Value Debug: " + chemical
    }

    // Calculate results dynamically
    formulas.forEach(({ name, ingredients }) => {
        let formula_result = 0; // Initialize the result
        ingredients.forEach(ing => {
            formula_result += ingredient_data[ing][index]; // Add each ingredient's value
        });
        formula_result -= o_num; // Subtract o_num
        const ingredient_list = ingredients.join(" + ");
        result_str += `${name}: ${ingredient_list} --- Number: ${formula_result}\n`;
    });

    return result_str;
}

function format_result(oNum, colour_option) {
    oNum = "O Number: " + oNum + ".";
    colour_option = "Colour Option: " + colour_option + " on the TV.";

    return oNum + "\n" + colour_option;
}

function main() {
    let result = "";
    let resultElement = document.getElementById("result");
    resultElement.innerHTML = "";

    const mNumElement = Number(document.getElementById("mNum").value);
    const lowerBoundElement = Number(document.getElementById("lowerBound").value);
    const insectNumElement = Number(document.getElementById("insectNum").value);
    const racingNumElement = Number(document.getElementById("racingNum").value);
    const oNumElement = document.getElementById("oNum");
    const finalChemElement = document.getElementById("finalChem").value;

    const racingFuelContainer = document.getElementById("racingFuelContainer");
    const oNumContainerElement = document.getElementById("oNumContainer");

    if (mNumElement === 0 || lowerBoundElement === 0 || insectNumElement === 0) {
        return 0;
    }

    let valid_o_num = true;
    let racing_num_needed = false;

    let calc_results = main_logic(mNumElement, lowerBoundElement, insectNumElement, racingNumElement);

    let o_num = calc_results[0]
    let colour_option_tv = calc_results[1]
    let letter = calc_results[2];
    let oNumNumbers = calc_results[3];

    if (oNumElement.value.length !== 0) {
        o_num = Number(oNumElement.value)
        if (oNumNumbers.includes(o_num)){
            colour_option_tv = get_tv_option_with_o_num(o_num, mNumElement, lowerBoundElement)
        } else {
            resultElement.innerHTML = `Enter one of the possible correct O Numbers: ${o_num}.\n`;
            return;
        }
    }

    if (String(o_num).includes("or")){
        result += "Please enter the correct O Number (The correct one couldn't be determined due to there being multiple potential 'correct' options based on the given info). O Number options listed below.\n\n"
        oNumContainerElement.style.display = "block";
        valid_o_num = false;
    }

    if (letter === "Invalid Racing Num"){
        result += "Unable to calculate result only using the Insect Repellent Number, please enter the Racing Fuel Number and try again.";
        racingFuelContainer.style.display = "block";
        racing_num_needed = true;
    }

    if (finalChemElement === "default"){
        result += "Enter the final chemical.\n\n"
    }

    if (!racing_num_needed) {
        result += format_result(o_num, colour_option_tv);
    }

    resultElement.innerHTML = result.replace(/\n/g, "<br>");

    if (!valid_o_num || finalChemElement === "default" || racing_num_needed) {
        return;
    }

    result += "\n\n" + calc_chem_nums(o_num, letter, finalChemElement)
    resultElement.innerHTML = result.replace(/\n/g, "<br>");
}

/*
// ++++ Testing ++++
console.log(main(4, 7, 9, 15, 14));
console.log(main(2, 19, 21, 9, 0));
const inputValue = parseFloat(inputNumber.value);

try {
    document.getElementById("calculateButton").addEventListener("click", function () {
        const mNum = parseFloat(document.getElementById("mNum").value);
        const upperBound = parseFloat(document.getElementById("upperBound").value);
        const lowerBound = parseFloat(document.getElementById("lowerBound").value);
        const insectNum = parseInt(document.getElementById("insectNum").value);
        const racingNum = parseInt(document.getElementById("racingNum").value);

        const [oNumStr, colourOption, letter] = main(mNum, upperBound, lowerBound, insectNum, racingNum);

        const resultElement = document.getElementById("result");
        resultElement.innerHTML = `O Number: ${oNumStr}<br>Colour Option: ${colourOption}<br>Letter: ${letter}`;
    });
} catch (error){
    console.log("")

*/

function resetAll() {
    document.getElementById("mNum").value = null;
    document.getElementById("lowerBound").value = null;
    document.getElementById("insectNum").value = null;
    document.getElementById("racingNum").value = null;
    document.getElementById("result").innerHTML = null;

    const racingFuelContainer = document.getElementById("racingFuelContainer");
    const oNumContainerElement = document.getElementById("oNumContainer");

    racingFuelContainer.style.display = "none";
    oNumContainerElement.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("finalChem").value = "default";
});