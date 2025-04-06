const boards = [
    ["OSTUHJLD", "QPGAFR", "YZKWX", "NI", "ECVB", "M"],
    ["E", "BCDSTVWXZ", "KLMNPQR", "OUY", "FGHJ", "AI"],
    ["AIO", "QX", "BCDEFGH", "S", "LMNPRTVW", "JKZ"],
    ["BCDEF", "XYZ", "GHILNO", "M", "JKQU", "APRSTVW"]
]

const words = ["WORM", "MOTH", "CRAB", "YETI"]

function solve_board_word() {
    let word = document.getElementById("word").value
    let board_id = document.getElementById("board").value
    let output = document.getElementById("solver_code")

    if (word === "default" || board_id === "default") {
        output.innerHTML = "Invalid input, input both board and word.";
        return;
    } else {
        output.innerHTML = "";
    }

    board_id = Number(board_id.split("_")[1]) - 1;
    const board = boards[board_id];
    let number_str = "";

    for (let j = 0; j < word.length; j++) {
        for (let i = 0; i < board.length; i++) {
            if (board[i].includes(word[j])) {
                number_str += board[i].length;
                break;
            }
        }
    }

    output.innerHTML = number_str;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("word").value = "default";
    document.getElementById("board").value = "default";
});

