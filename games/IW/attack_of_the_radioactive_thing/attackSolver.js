function main(mNum, lowerBound, upperBound, insectNum, racingNum = undefined) {
    const possibleFinalNums = [lowerBound - 1, lowerBound + 1, upperBound + 1];

    let [possibleTVNumbers, possibleONums] = getValidONums(mNum, possibleFinalNums);

    // === Determine 'oNum' String ===
    let oNumStr = "";
    let oNumStrCounter = 0;


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
        }
    }

    // === Return Results ===
    return [oNumStr, getColorOption(possibleTVNumbers, possibleFinalNums), getLetter(insectNum, racingNum)];
}

function getValidONums(mNum, possibleFinalNums) {
    // === Default O Numbers  ===
    const defaultONums = [2, 4, 5, 6, 8, 9, 11, 15]; // These are the only numbers the O-number can ever be.

    // === Calculate Possible Results ===
    let possibleTVNumbers = []; // A TV number is the number obtained by multiplying the mNum by an oNum. It is used to compare to the numbers on the TV to get the right colour.
    let possibleONums = [];

    for (let index = 0; index < defaultONums.length; index++) {
        let TVNum = mNum * defaultONums[index];

        if (TVNum === possibleFinalNums[0] || TVNum === possibleFinalNums[1] || TVNum === possibleFinalNums[2]) {
            possibleTVNumbers.push(TVNum);
            possibleONums.push(defaultONums[index]);
        }
    }
    return [possibleTVNumbers, possibleONums];
}

function getColorOption(possibleTVNumbers, possibleFinalNums) {
    if(possibleTVNumbers.length === 0){
        return undefined;

    } else if(possibleTVNumbers.length === 1){
        let index = possibleFinalNums.indexOf(possibleTVNumbers[0]);
        switch (index){
            case 0:
                return "Top Option";
            case 1:
                return "Middle Option";
            case 2:
                return "Bottom Option";
        }

    } else {
        let colourString = "";
        for (let i = 0; i < possibleTVNumbers.length; i++){
            if(i !== 0) {
                colourString += " or "
            }
            let index = possibleFinalNums.indexOf(possibleTVNumbers[i]);
            switch (index) {
                case 0:
                    colourString += "Top Option";
                    break;
                case 1:
                    colourString += "Middle Option";
                    break;
                case 2:
                    colourString += "Bottom Option";
                    break;
            }
        }
        return colourString;
    }

}

function getLetter(insectNum, racingNum) {
    // === Determine 'letter' ===
    let letter;
    switch (insectNum) {
        case 3:
            letter = "L";
            break;
        case 6:
            letter = "K";
            break;
        case 9:
            letter = "B";
            break;
        case 10:
            letter = "I";
            break;
        case 11:
            letter = "A";
            break;
        case 12:
            letter = "F";
            break;
        case 14:
            letter = "H";
            break;
        case 16:
            letter = "E";
            break;
        case 7:
        case 15:
            switch (racingNum) {
                case 6:
                    letter = "C";
                    break;
                case 7:
                    letter = "D";
                    break;
                case 11:
                    letter = "G";
                    break;
                case 14:
                    letter = "J";
                    break;
                default:
                    letter = "Invalid Racing Num";
            }
            break;
        default:
            letter = "Invalid Insect Num";
            break;
    }

    // === Handle Special Cases ===
    if (insectNum > 16) {
        letter = "Invalid Insect Num";
    }

    if (insectNum === 0 && racingNum === 0) {
        letter = "";
    }

    return letter;
}


// ++++ Testing ++++
console.log(main(4, 7, 9, 15, 14));
console.log(main(2, 19, 21, 9, 0));

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
}
