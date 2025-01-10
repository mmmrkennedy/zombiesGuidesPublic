function setActiveButton(element) {
    const container = element.parentElement.parentElement; // Get the main container

    // Loop through all children of the container
    for (let i = 0; i < container.children.length; i++) {
        const imgContainer = container.children[i]; // Each child is an img-container div

        // Check if the child contains an image
        const img = imgContainer.querySelector('img');
        if (img && img.alt !== element.alt) {
            imgContainer.style.display = 'none'; // Hide the entire img-container
        }
    }
}

function resetAllButtons() {
    const id_names = ['symbol_1', 'symbol_2', 'symbol_3', 'symbol_4'];

    for (let i = 0; i < id_names.length; i += 1) {
        const container = document.getElementById(id_names[i]);

        // Loop through all children of the container (img-container divs)
        for (let j = 0; j < container.children.length; j++) {
            const imgContainer = container.children[j]; // Each child is an img-container div

            // Reset visibility of the img-container
            imgContainer.style.display = 'inline-block'; // Restore visibility
            const img = imgContainer.querySelector('img');
            if (img) {
                img.classList.remove('hidden');
            }
        }
    }

    // Reset the result text
    let resultElement = document.getElementById("result_gns");
    resultElement.innerHTML = "Select 4 Symbols and Enter the Word.";

    // Clear the word input field
    let wordElement = document.getElementById('word');
    wordElement.value = "default";
}

function generate_all_letter_images(){
    const id_names = ['symbol_1', 'symbol_2', 'symbol_3', 'symbol_4'];

    for (let i = 0; i < id_names.length; i += 1) {
        generate_images(id_names[i])
    }
}

function generate_images(div_id_name) {
    // Get the container by its ID
    const container = document.getElementById(div_id_name);

    // Apply flexbox styling to ensure images are displayed in a horizontal line
    container.style.display = 'flex'; // Set container to flexbox
    container.style.flexWrap = 'wrap'; // Allow wrapping to the next line if necessary
    container.style.gap = '10px'; // Add spacing between images (optional)

    // Loop through each letter of the alphabet
    for (let charCode = 97; charCode <= 122; charCode++) {
        const letter = String.fromCharCode(charCode); // Convert char code to letter

        // Create a container div for each image
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container'; // Add the container class
        imgContainer.style.position = 'relative'; // Ensure the container is positioned inline

        // Create an <img> element
        const img = document.createElement('img');
        img.src = `../wyler_language_symbols/${letter}.webp`; // Path to the image
        img.alt = letter.toUpperCase(); // Alt text (uppercase letter)
        img.setAttribute('onclick', 'setActiveButton(this)'); // Onclick event
        img.setAttribute('onmouseover', 'showAltText(this)'); // Onmouseover event
        img.setAttribute('onmouseout', 'hideAltText(this)'); // Onmouseout event
        img.style.margin = '-5px'; // Set spacing between images

        // Create a div for the alt text
        const altTextDiv = document.createElement('div');
        altTextDiv.className = 'alt-text'; // Add the alt-text class
        altTextDiv.style.position = 'absolute'; // Position it relative to the container
        altTextDiv.style.top = '0';
        altTextDiv.style.right = '0';
        altTextDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        altTextDiv.style.color = 'white';
        altTextDiv.style.padding = '5px';
        altTextDiv.style.fontSize = '12px';
        altTextDiv.style.borderRadius = '3px';
        altTextDiv.style.display = 'none'; // Initially hidden

        // Append the img and alt-text div to the container
        imgContainer.appendChild(img);
        imgContainer.appendChild(altTextDiv);

        // Append the img container to the main container
        container.appendChild(imgContainer);
    }
}

function showAltText(imgElement) {
    const altTextDiv = imgElement.nextElementSibling;
    altTextDiv.textContent = imgElement.alt;
    altTextDiv.style.display = 'block';
}

function hideAltText(imgElement) {
    const altTextDiv = imgElement.nextElementSibling;
    altTextDiv.style.display = 'none';
}


document.addEventListener('DOMContentLoaded', generate_all_letter_images);
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('word').value = 'default';
});
