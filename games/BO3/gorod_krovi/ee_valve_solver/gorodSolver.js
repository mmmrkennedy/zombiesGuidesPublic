function main_logic(greenValve, pinkValue){
    const lookup_table = {
        "department_store": {
            "supply_depot": [1, undefined, 2, 3, 1, 1],
            "armory": [3, 2, undefined, 2, 2, 3],
            "infirmary": [3, 2, 2, undefined, 1, 1],
            "tank_factory": [2, 2, 2, 3, undefined, 1],
            "dragon_command": [2, 1, 1, 2, 3, undefined]
        },
        "supply_depot": {
            "department_store": [undefined, 1, 3, 2, 3, 3],
            "armory": [3, 2, undefined, 2, 2, 3],
            "infirmary": [3, 2, 2, undefined, 1, 1],
            "tank_factory": [2, 2, 2, 3, undefined, 1],
            "dragon_command": [2, 1, 1, 2, 3, undefined]
        },
        "armory": {
            "department_store": [undefined, 3, 1, 3, 1, 2],
            "supply_depot": [3, undefined, 2, 1, 1, 1],
            "infirmary": [2, 1, 2, undefined, 2, 2],
            "tank_factory": [2, 3, 3, 3, undefined, 1],
            "dragon_command": [2, 1, 3, 2, 2, undefined]
        },
        "infirmary": {
            "department_store": [undefined, 3, 3, 3, 3, 1],
            "supply_depot": [1, undefined, 2, 3, 2, 2],
            "armory": [1, 1, undefined, 2, 2, 2],
            "tank_factory": [1, 3, 1, 3, undefined, 2],
            "dragon_command": [3, 2, 2, 2, 2, undefined]
        },
        "tank_factory": {
            "department_store": [undefined, 2, 3, 3, 1, 1],
            "supply_depot": [1, undefined, 1, 3, 1, 2],
            "armory": [3, 2, undefined, 1, 1, 1],
            "infirmary": [3, 2, 2, undefined, 2, 3],
            "dragon_command": [1, 1, 1, 1, 1, undefined]
        },
        "dragon_command": {
            "department_store": [undefined, 2, 2, 1, 1, 1],
            "supply_depot": [2, undefined, 1, 2, 3, 2],
            "armory": [1, 3, undefined, 1, 1, 1],
            "infirmary": [2, 3, 3, undefined, 3, 1],
            "tank_factory": [1, 3, 1, 1, undefined, 3]
        }
    };

    return lookup_table[greenValve][pinkValue];
}

function format_list_as_str(list_of_correct_vals) {
    let result = "";
    let loc_name;

    if (list_of_correct_vals === undefined) {
        return list_of_correct_vals;
    }

    for (let i = 0; i < list_of_correct_vals.length; i++) {
        if (list_of_correct_vals[i] === undefined || list_of_correct_vals[i] === 0) {
            continue
        }

        if (i === 0) {
            loc_name = "Department Store"
        } else if (i === 1) {
            loc_name = "Supply Depot"
        } else if (i === 2) {
            loc_name = "Armory"
        } else if (i === 3) {
            loc_name = "Infirmary"
        } else if (i === 4) {
            loc_name = "Tank Factory"
        } else if (i === 5) {
            loc_name = "Dragon Command"
        }

        if (list_of_correct_vals[i] > 3){
            console.log("ERROR: Value for %s is greater than 3 (%s)", loc_name, list_of_correct_vals[i]);
        }

        result += "Set " + loc_name + " to: " + list_of_correct_vals[i] + "\n";
    }

    return result;
}

function main() {
    const greenValve = document.getElementById("greenValve").value;
    const pinkValve = document.getElementById("pinkValve").value;
    const resultElement = document.getElementById("result");

    let result = "";

    if (greenValve === "default" || pinkValve === "default"){
        resultElement.innerHTML = "Select the Locations of the Green Light and Pink Cylinder";
        return 0;

    } else if (greenValve === pinkValve) {
        resultElement.innerHTML = "";
        result = "Locations cannot be the same";

    } else {
        resultElement.innerHTML = "";
        result = main_logic(greenValve, pinkValve);
        result = format_list_as_str(result);
    }

    resultElement.innerHTML = result.replace(/\n/g, "<br>");
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("greenValve").value = "default";
    document.getElementById("pinkValve").value = "default";
});