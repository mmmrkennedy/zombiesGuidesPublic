const boards = [
    ['OSTUHJLD', 'QPGAFR', 'YZKWX', 'NI', 'ECVB', 'M'],
    ['E', 'BCDSTVWXZ', 'KLMNPQR', 'OUY', 'FGHJ', 'AI'],
    ['AIOUY', 'QX', 'BCDEFGH', 'S', 'LMNPRTVW', 'JKZ'],
    ['BCDEF', 'XYZ', 'GHILNO', 'M', 'JKQU', 'APRSTVW'],
];

const words = ['WORM', 'MOTH', 'CRAB', 'YETI'];

function solve_board_word() {
    const word = document.getElementById('word').value;
    let board_id = document.getElementById('board').value;
    const output = document.getElementById('solver_code');

    if (word === 'default' || board_id === 'default') {
        output.innerHTML = 'Invalid input, input both board and word.';
        return;
    } else {
        output.innerHTML = '';
    }

    board_id = Number(board_id.split('_')[1]) - 1;
    const board = boards[board_id];
    let number_str = '';

    for (let j = 0; j < word.length; j++) {
        for (let i = 0; i < board.length; i++) {
            const board_str = board[i].toUpperCase();
            const letter = word[j].toUpperCase();

            if (board_str.includes(letter)) {
                number_str += String(board[i].length);
                break;
            }
        }
    }

    if (number_str.length !== 4) {
        output.innerHTML = `Unable to calculate number, number is not 4 digits (tell Mark on discord the board and word)`;
    } else {
        output.innerHTML = number_str;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('word').value = 'default';
    document.getElementById('board').value = 'default';
});
