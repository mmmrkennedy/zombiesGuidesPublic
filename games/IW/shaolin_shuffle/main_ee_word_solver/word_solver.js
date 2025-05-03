const words = [
    "ACTORS", "AFTERLIFE", "ANCESTOR", "ARCADE", "ARTHUR", "AUDITION",
    "BASEMENT", "BEVERLYHILLS", "BLACKCAT", "BOAT", "BREEDER", "BROADWAY",
    "BRUTE", "BUMPERCARS", "CHARMS", "COMICBOOKS", "CRANE", "CRYPTID",
    "DANCE", "DAVIDARCHER", "DEATH", "DIRECTOR", "DISCO", "DRAGON", "DRCROSS",
    "FAIRIES", "FORGEFREEZE", "GEYSER", "GHETTO", "HARPOON", "HIVES",
    "INFERNO", "KATANA", "KEVINSMITH", "KRAKEN", "KUNGFU", "LOSANGELES",
    "MCINTOSH", "MEMORIES", "MEPHISTOPHELES", "NEWYORK", "NIGHTFALL",
    "NUNCHUCKS", "OBELISK", "OCTONIAN", "PAMGRIER", "PINKCAT", "PUNKS",
    "RATKING", "REALITYTV", "REDWOODS", "ROLLERCOASTER", "ROLLERSKATES",
    "SAMANTHA", "SHAOLIN", "SHIELD", "SHUFFLE", "SLASHER", "SIXTYMILLION",
    "SLASHER", "SLIDE", "SNAKE", "SPACELAND", "STAFF", "SUBWAY", "TIGER",
    "TREES", "WEREWOLFPOETS", "WINONAWYLER", "YETIEYES", "ZAPPER"
];

const imgContainer = document.getElementById('word_filter_imgs');

function chopString(prefix, full_str) {
    if (full_str.startsWith(prefix.toUpperCase())) {
        return full_str.slice(prefix.length);
    } else {
        return null; // Or full_str if you want to return the unchanged string
    }
}

function filterWordsByPrefix(prefix) {
    // Filter the words that start with the given prefix
    const filteredWords = words.filter(word => {
        return word.toLowerCase().startsWith(prefix.toLowerCase());
    });

    // Select the <ul> element by its ID
    const wordList = document.getElementById("word_list");
    const possible_letters_p_tag = document.getElementById("possible_letters");

    imgContainer.innerHTML = '';
    document.getElementById("word_list").innerHTML = "";

    let possible_letters = [];

    // Loop through the words array and create <li> elements for each word
    filteredWords.forEach(word => {
        const listItem = document.createElement("li"); // Create an <li> element
        listItem.textContent = word; // Set the text content to the word
        wordList.appendChild(listItem); // Append the <li> to the <ul>
        let letter = chopString(prefix, word)[0];
        if (!possible_letters.includes(letter)) {
            possible_letters.push(letter);
        }
    });


    if (filteredWords.length === 0) {
        const listItem = document.createElement("li"); // Create an <li> element
        listItem.textContent = "No Words Found."; // Set the text content to the word
        wordList.appendChild(listItem); // Append the <li> to the <ul>
    }

    if (possible_letters.length === 0 || prefix === "") {
        possible_letters_p_tag.textContent = "No valid words to find letters for.";
    } else {
        possible_letters_p_tag.textContent = "";
        generate_letter_img(possible_letters);
    }

}

function generate_letter_img(possible_letters) {
    // Get the container for the images
    const imgContainer = document.getElementById('word_filter_imgs');
    imgContainer.className = 'img-container'; // Add the container class

    // Loop through each possible letter
    for (let i = 0; i < possible_letters.length; i++) {
        let letter = possible_letters[i];

        // Create a wrapper div for the image and label
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.display = "inline-block"; // Ensure they are inline
        wrapperDiv.style.textAlign = "center"; // Center text below the image
        wrapperDiv.style.margin = "5px";

        // Create the <img> element
        const img = document.createElement('img');
        img.src = `/zombiesGuidesPublic/games/IW/wyler_language_symbols/${letter.toLowerCase()}.webp`; // Path to the image
        img.alt = letter.toUpperCase(); // Alt text (uppercase letter)
        img.style.height = "60px";
        img.style.width = "60px";

        // Create the label (e.g., <p> or <span>)
        const label = document.createElement('p');
        label.textContent = letter.toUpperCase(); // Set the letter as the text
        label.style.fontSize = "14px";
        label.style.margin = "0";

        // Append the image and label to the wrapper div
        wrapperDiv.appendChild(img);
        wrapperDiv.appendChild(label);

        // Append the wrapper div to the container
        imgContainer.appendChild(wrapperDiv);
    }
}


document.addEventListener("shaolin_ee_word_solver_template", function () {
    // Select the <ul> element by its ID
    const wordList = document.getElementById("word_list");

    // Loop through the words array and create <li> elements for each word
    words.forEach(word => {
        const listItem = document.createElement("li"); // Create an <li> element
        listItem.textContent = word; // Set the text content to the word
        wordList.appendChild(listItem); // Append the <li> to the <ul>
    });
    
    // JavaScript to toggle the 'active' class
    const filter_button = document.getElementById('word_filter_button');

    if (!filter_button) {
        return;
    }


    // Get the div
    const filter_div = document.getElementById('word_filter');
    const input_item = filter_div.querySelector('input');

    filter_button.addEventListener('click', () => {
        // Toggle the 'active' class
        filter_button.classList.toggle('active');
        input_item.value = "";
        filterWordsByPrefix("");

        if (imgContainer){
            imgContainer.innerHTML = "";
        }

        if (filter_button.classList.contains('active')) {
            filter_div.style.display = 'block';
        } else {
            filter_div.style.display = 'none';
        }
    });
});

