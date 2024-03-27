// Get references to HTML elements
const inputNumber = document.getElementById("inputNumber");
const calculateBtn = document.getElementById("calculateBtn");
const resultElement = document.getElementById("result");

// Define the function that calculates and displays the result
function calculateAndDisplay() {
    const inputValue = parseFloat(inputNumber.value);

    if (!isNaN(inputValue)) {
        const result = inputValue * 2;
        resultElement.textContent = `Result: ${result}`;
    } else {
        resultElement.textContent = "Please enter a valid number.";
    }
}

// Attach event listener to the "Calculate" button
calculateBtn.addEventListener("click", calculateAndDisplay);
