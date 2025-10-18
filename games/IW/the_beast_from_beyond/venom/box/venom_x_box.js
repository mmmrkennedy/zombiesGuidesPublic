let blue_count = 0;
let red_count = 0;
let green_count = 0;
let yellow_count = 0;
let black_count = 0;
let white_count = 0;
let X = 0; // Number of Buttons
let S = 0; // The number of different colours
let W = []; // The amount of each colour

/*
C <- [r, g, b, bl, y, w]
W <- [1, 2, 3, 4, 5, ...N]
S <- (W)
B <- (B1, B2, ...BL)
X <- sum(B)
f(x) <- [3, 4, 5, 6] <- [c1 / c2 / c3 / c4 ...cN]
 */

function process_arr(button_arr) {
    blue_count = 0;
    red_count = 0;
    green_count = 0;
    yellow_count = 0;
    black_count = 0;
    white_count = 0;
    X = button_arr.length;

    for (let i = 0; i < X; i++) {
        button_arr[i] = button_arr[i].toLowerCase();

        if (button_arr[i] === 'blue') {
            blue_count++;
        } else if (button_arr[i] === 'red') {
            red_count++;
        } else if (button_arr[i] === 'green') {
            green_count++;
        } else if (button_arr[i] === 'yellow') {
            yellow_count++;
        } else if (button_arr[i] === 'black') {
            black_count++;
        } else if (button_arr[i] === 'white') {
            white_count++;
        }
    }

    S = calc_S(button_arr);
    W = [red_count, green_count, blue_count, black_count, yellow_count, white_count];
}

function calc_S(arr) {
    return new Set(arr).size;
}

function BL(arr, colour) {
    let index = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === colour) {
            index = i;
        }
    }

    return index + 1;
}

function is_any_even(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0 && arr[i] !== 0) {
            return true;
        }
    }

    return false;
}

function are_all_less_than_equal(arr, num) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > num) {
            return false;
        }
    }

    return true;
}

function venom_box_calc(button_arr) {
    process_arr(button_arr);

    // console.log(S);
    // console.log(W);

    if (X === 3) {
        // c1, (!bl) ? B3 : c2;
        if (black_count === 0) {
            console.log('x = 3, c1');
            return 'Press Button #3';
        }

        // c2, (BL = g) ? B1 : c3;
        if (button_arr[X - 1] === 'green') {
            console.log('x = 3, c2');
            return 'Press Button #1';
        }

        // c3, (sum(r) > 1) ? BL(r) : c4;
        if (red_count > 1) {
            console.log('x = 3, c3');
            return `Press Button #${BL(button_arr, 'red')}`;
        }

        // c4, B2
        console.log('x = 3, c4');
        return 'Press Button #2';
    } else if (X === 4) {
        // c1, ((sum(y) > 1) && S >= 2 ? BL(y) : c2;
        if (yellow_count > 1 && S >= 2) {
            console.log('x = 4, c1');
            return `Press Button #${BL(button_arr, 'yellow')}`;
        }

        // c2, ((BL(w) && sum(b) = 0) ? B1 : c3;
        if (button_arr[X - 1] === 'white' && blue_count === 0) {
            console.log('x = 4, c2');
            return 'Press Button #1';
        }

        // c3, (sum(bl) > 1) ? BL : c4;
        if (black_count > 1) {
            console.log('x = 4, c3');
            return `Press Button #${X}`;
        }

        // c4, B3
        console.log('x = 4, c4');
        return 'Press Button #3';
    } else if (X === 5) {
        // c1, (W <= 3) ? W1 : c2;
        if (are_all_less_than_equal(W, 3)) {
            console.log('x = 5, c1');
            return 'Press Button #1';
        }

        // c2, (sum(w) = 1 && sum(b) > 1) ? W2 : c3;
        if (white_count === 1 && blue_count > 1) {
            console.log('x = 5, c2');
            return 'Press Button #2';
        }

        // c3, (sum(r) = 0 && W % 2 = 0 && S < 4) ? WL : c4;
        if (red_count === 0 && is_any_even(W) && S < 4) {
            console.log('x = 5, c3');
            return 'Press Button #5';
        }

        // c4, W1
        console.log('x = 5, c4');
        return 'Press Button #1';
    } else if (X === 6) {
        // c1, (sum(y) != 0)
        if (yellow_count !== 0) {
            console.log('x = 6, c1');
            return 'Press Button #3';
        }

        // c2, (sum(bl) = 1 && sum(w) > 1) ? W4 : c3;
        if (black_count === 1 && white_count > 1) {
            console.log('x = 6, c2');
            return 'Press Button #4';
        }

        // c3, (S >=1 && sum(r) > 1) ? W5 : c4;
        if (S >= 1 && red_count > 1) {
            console.log('x = 6, c3');
            return 'Press Button #5';
        }

        // c4, BL
        console.log('x = 6, c4');
        return 'Press Button #6';
    }
}

let selected_colours = [];
const venom_box_result = document.getElementById('venom-x-box-result');

function venom_box_solve() {
    const venom_box_buttons = document.querySelectorAll('#venom-button');

    selected_colours = [];

    for (let i = 0; i < venom_box_buttons.length; i++) {
        const curr_select = venom_box_buttons[i];
        for (let j = 0; j < curr_select.length; j++) {
            const curr_button = curr_select[j];
            if (curr_button.selected === true) {
                selected_colours.push(curr_button.value);
            }
        }
    }

    venom_box_result.innerText = venom_box_calc(selected_colours);
}
