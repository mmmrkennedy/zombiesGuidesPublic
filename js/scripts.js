// console.log("Loaded Scripts")

/*
=======================================
LIGHT AND DARK MODE FUNCTIONALITIES
=======================================
*/

function toggleLightMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
}

function changeThemeColour(){
    const savedColorMode = localStorage.getItem('colourMode');
    if(savedColorMode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    changeThemeColour();
});

/*
=======================================
PRELOAD IMAGES AND VIDEOS
=======================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Preload Images if enabled in localStorage
    if (localStorage.getItem('preload') === 'true') {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const anchors = Array.from(document.querySelectorAll('a[href]'))
            .filter(anchor => imageExtensions.some(ext => anchor.href.endsWith(ext)));

        anchors.forEach(anchor => {
            new Image().src = anchor.href;
        });
    }
});


/*
=======================================
STORAGE EVENT LISTENERS
=======================================
*/

window.addEventListener('storage', function(event) {
    switch(event.key) {
        case 'preload':
            if(localStorage.getItem("preload") === 'true') {
                window.location.reload();
            }
            break;
        case 'colourMode':
            changeThemeColour();
            break;
        case 'substeps':
            substeps((localStorage.getItem("substeps") === 'true'));
            if(localStorage.getItem("substeps") === 'true') {
                window.location.href = window.location.href.split("#")[0];
            }
            break;
        case 'close_setting_auto':
            break;
        case 'fontSelector':
            window.location.reload()
            break;
        default:
            console.log("Unknown Storage Event", event);
    }
});


/*
=======================================
USING DEFAULT FONTS
=======================================
*/
document.addEventListener('DOMContentLoaded', function() {
    let path = window.location.pathname;
    let page = path.split("/").pop();

    if (page !== "index.html") {
        let savedFont = localStorage.getItem('fontSelector');

        // First Load protection, so the user has a populated font selection box the first time they load the page
        if (savedFont == null) {
            savedFont = "Verdana";
        }

        const smoothScroll = document.querySelector('.smooth-scroll');
        let fontSelector = document.getElementById('fontSelector');
        if (fontSelector == null){
            return
        }

        fontSelector.value = savedFont;

        if (savedFont === 'OpenDyslexic') {
            smoothScroll.classList.remove('verdana');
            smoothScroll.classList.add('open-dyslexic');
        } else if (savedFont === 'Verdana') {
            smoothScroll.classList.remove('open-dyslexic');
            smoothScroll.classList.add('verdana');
        } else if (savedFont === 'Arial') {
            smoothScroll.classList.remove('open-dyslexic');
            smoothScroll.classList.remove('verdana');
        }
    }
});

/*
=======================================
NAVIGATION UTILITIES
=======================================
*/

function navigateToIndex() {
    window.location.href = "/zombiesGuidesPublic/index.html";
}

function navigateToSettings() {
    window.open("/zombiesGuidesPublic/settings/settings.html", "_blank");
}

/*
=======================================
SCROLL FUNCTIONS
=======================================
*/

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
    window.history.pushState(null, null, '#');
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                const elementId = href.substring(1);
                scrollToElement(elementId, 105);
            }
        }
    });
});

function scrollToElement(elementId, offset) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const targetY = elementPosition + window.scrollY - offset;
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }
}

/*
=======================================
FONT SELECTOR FUNCTIONALITIES
=======================================
*/

function font_loader_init() {
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector == null){
        return;
    }

    const smoothScroll = document.querySelector('.smooth-scroll');
    let path = window.location.pathname;
    let page = path.split("/").pop();

    if (page !== "index.html") {
        fontSelector.addEventListener('change', () => {
            const selectedFont = fontSelector.value;
            if (selectedFont === 'OpenDyslexic') {
                smoothScroll.classList.remove('verdana');
                smoothScroll.classList.add('open-dyslexic');
            } else if (selectedFont === 'Verdana') {
                smoothScroll.classList.remove('open-dyslexic');
                smoothScroll.classList.add('verdana');
            } else if (selectedFont === 'Arial') {
                smoothScroll.classList.remove('open-dyslexic');
                smoothScroll.classList.remove('verdana');
            }
        });
    }
}

/*
=======================================
MOBILE DETECTION AND HANDLING
=======================================
*/

function hasTouchScreen() {
    let hasTouchScreen;

    if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
        let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
        if (mQ && mQ.media === "(pointer:coarse)") {
            hasTouchScreen = !!mQ.matches;
        } else if ('orientation' in window) {
            hasTouchScreen = true; // deprecated, but good fallback
        } else {
            // Only as a last resort, fall back to user agent sniffing
            let UA = navigator.userAgent;
            hasTouchScreen = (
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
            );
        }
    }
    return hasTouchScreen;
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


document.addEventListener("DOMContentLoaded", function() {
    if (hasTouchScreen() || isMobile()) {
        document.getElementById('mobileContent').style.display = 'block';
        document.getElementById('nonMobileContent').style.display = 'none';
    } else {
        document.getElementById('mobileContent').style.display = 'none';
        document.getElementById('nonMobileContent').style.display = 'block';
    }
});

/*
=======================================
HISTORY MANAGEMENT FOR ANCHOR LINKS
=======================================
*/

document.addEventListener('click', function(event) {
    let target = event.target;
    if (target.tagName.toLowerCase() === 'a' && target.hash) {
        window.history.pushState({hash: target.hash}, '', target.hash);
    }
});

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.hash) {
        window.location.hash = event.state.hash;
    }
});


/*
=======================================
SUBSTEP FUNCTIONALITIES
=======================================
 */
function substeps(check) {
    let displayStyle;
    if (check) {
        displayStyle = 'block';
    } else {
        displayStyle = 'none';
    }

    let i = 1;
    while(true) {
        try{
            document.getElementById('substeps' + i).style.display = displayStyle;
        } catch (e) {
            break;
        }
        i++;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    substeps((localStorage.getItem('substeps') === 'true'));
});

/*
=======================================
INCOMPLETE PATH FOR A TAGS
=======================================
 */
window.addEventListener("DOMContentLoaded", function () {
    const allATags = document.querySelectorAll('a');

    allATags.forEach(function (tag) {
        const hrefValue = tag.getAttribute('href');

        // Skip if hrefValue starts with # (anchor link) or http/https (absolute URL).
        if (hrefValue.startsWith('#') || hrefValue.startsWith('http://') || hrefValue.startsWith('https://')) {
            return;
        }

        if (hrefValue.endsWith("/")) {
            tag.classList.add('incomplete-path');
            return;

        }

        if (!(hrefValue.includes(".webp") || hrefValue.includes(".html") || hrefValue.includes(".webm") || hrefValue.includes(".gif"))) {
            tag.classList.add('wrong_file_type');
            return;

        }

        /*
        fetch(hrefValue, { method: 'HEAD' })
            .then(response => {
                if (!response.ok && !response.url.endsWith("/")) {
                    tag.classList.add('file-doesnt-exist');
                }
            })
            .catch(() => {
                tag.classList.add('file-doesnt-exist');
            });
         */
    });
});

/*
=======================================
ADD LINK TO PAGE CLASS TO A TAGS
=======================================
 */
document.addEventListener("DOMContentLoaded", function() {
    // Select all <a> tags in the document that are not inside .content-container-top
    const links = document.querySelectorAll("a:not(.content-container-top a)");

    // Loop through each <a> tag
    links.forEach(function(link) {
        let link_href = link.getAttribute("href");

        if (link_href.includes("#")) {
            link.classList.add("link-to-page");
        }

        if (link_href.includes("youtu.be") || link_href.includes("youtube") || link_href.includes(".com") || link_href.includes("http")) {
            link.classList.add("youtube-link");
        }
    });
});

/*
=======================================
AUTO GENERATE THE QUICK ACCESS TAGS
=======================================
 */

document.addEventListener("DOMContentLoaded", function () {
    // JavaScript to toggle the 'active' class
    const solver_button_divs = document.getElementsByClassName('solver-with-button');

    if (!solver_button_divs) {
        return;
    }

    for (let i = 0; i < solver_button_divs.length; i++) {
        let solver_button_div = solver_button_divs[i];

        // Get the button inside the parent div
        const toggle_button = solver_button_div.querySelector('.square-button');

        // Get the solverContainer div inside the parent div
        const nested_container = solver_button_div.querySelector('div');

        toggle_button.addEventListener('click', () => {
            // Toggle the 'active' class
            toggle_button.classList.toggle('active');

            if (toggle_button.classList.contains('active')) {
                nested_container.style.display = 'block';
            } else {
                nested_container.style.display = 'none';
            }
        });
    }
});


/*
=======================================
AUTO GENERATE THE QUICK ACCESS TAGS
=======================================
 */
function isElementEmpty(element) {
    // Loop through all child nodes of the element
    for (let child of element.childNodes) {
        // If the child is not a comment and has meaningful content, return false
        if (child.nodeType !== Node.COMMENT_NODE && child.nodeType !== Node.DOCUMENT_TYPE_NODE) {
            if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '')) {
                return false;
            }
        }
    }
    // If no non-comment or meaningful content is found, the element is empty
    return true;
}

function generate_font_box(parentElement){
    if (!isElementEmpty(parentElement)) {
        font_loader_init();
        return false;
    }

    // console.log("Auto generating font box/quick links...");

    // Create the label element
    const label = document.createElement("label");
    label.setAttribute("for", "fontSelector");
    label.textContent = "Select a Font:";

    // Create the select element
    const select = document.createElement("select");
    select.id = "fontSelector";

    // Create the options for the select dropdown
    const options = [
        { value: "Arial", text: "Arial" },
        { value: "Verdana", text: "Verdana (Higher Readability)" },
        { value: "OpenDyslexic", text: "OpenDyslexic" }
    ];

    options.forEach(optionData => {
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = optionData.text;
        select.appendChild(option);
    });

    // Append the label and select to the parent element
    parentElement.appendChild(document.createTextNode("\n")); // Add a line break before the label
    parentElement.appendChild(label);
    parentElement.appendChild(document.createTextNode("\n")); // Add a line break before the select
    parentElement.appendChild(select);
    parentElement.appendChild(document.createTextNode("\n")); // Add a line break after the select

    font_loader_init();

    return true;
}

function calculateIndentLevel(line) {
    /**
     * Calculate the indentation level of a line based on leading spaces.
     * Tabs are assumed to be 4 spaces.
     */
    const spaces = line.replace(/\t/g, "    "); // Replace tabs with 4 spaces
    const leadingSpaces = spaces.length - spaces.trimStart().length;
    return Math.floor(leadingSpaces / 4); // Assuming 4 spaces per indent
}

function getTagIndentLevelsFromHTML() {
    /**
     * Reads the HTML of the current document and extracts an indexable list of
     * <div> and <p> tags with their corresponding indent levels and HTML elements.
     * Ensures there are no gaps greater than 1 in indent levels for <p> tags.
     */
    const rootElement = document.querySelector(".smooth-scroll");

    if (!rootElement) {
        console.error("No <div class='smooth-scroll'> found in the document.");
        return [];
    }

    // Classes to check for in <p> tags
    const allowedClasses = ["step-group-title", "upgrade-title", "sub-sub-step"];
    const disallowedClasses = ["content-container-top", "weapon-desc", "warning", "stats", "solver-container", "solver-output", "solver-symbol-select"];

    // Get the innerHTML of the root element and split it into lines
    const html_lines_no_comments = rootElement.innerHTML.replace(/<!--[\s\S]*?-->/g, '');
    const htmlLines = html_lines_no_comments.split("\n");
    const result = [];
    let lastAdjustedIndentLevel = null; // Track the last adjusted indent level for <p> tags
    let lastAdjustedRawIndentLevel = null; // Track the raw indent level of the last adjusted <p> tag

    htmlLines.forEach((line) => {
        const trimmedLine = line.trim();

        const hasDisallowedClass = disallowedClasses.some((cls) => trimmedLine.includes(cls));
        if (hasDisallowedClass) {
            return;
        }

        // Check if the line is a <div> or <p> tag
        if (trimmedLine.startsWith("<div") || trimmedLine.startsWith("<p")) {
            // Calculate the raw indent level
            const rawIndentLevel = calculateIndentLevel(line) - 1;
            let indentLevel = rawIndentLevel;
            let elements = [];

            if (trimmedLine.includes("data-bool-quick-link=\"false\"")){
                return;
            }

            // Create a temporary container to extract the actual DOM element
            if (trimmedLine.startsWith("<div")) {
                elements = document.querySelectorAll("div.smooth-scroll div");
            } else if (trimmedLine.startsWith("<p")) {
                elements = document.querySelectorAll("div.smooth-scroll p");
            }

            // Extract the class value from the string
            const extractAttributesFromStr = (trimmedLine) => {
                const classMatch = trimmedLine.match(/class="([^"]*)"/); // Match the class attribute
                const idMatch = trimmedLine.match(/id="([^"]*)"/); // Match the id attribute

                return {
                    class: classMatch ? classMatch[1] : "", // Return the class value or null
                    id: idMatch ? idMatch[1] : "" // Return the id value or ""
                };
            };

            // Extracted class value from the string
            const { class: strClass, id: strId } = extractAttributesFromStr(trimmedLine);

            if (strClass === "" && strId === "") {
                return;
            }

            if (trimmedLine.startsWith("<p")) {
                // Skip processing <p> tags without allowed classes
                if (!allowedClasses.some((cls) => strClass.includes(cls))) {
                    return; // Skip this <p> tag
                }
            } else if (trimmedLine.startsWith("<div")) {
                if (strClass.length === 0) {
                    return;
                }
            }

            let found_element = undefined;

            for (let i = 0; i < elements.length; i++) {
                const el = elements[i]; // Access the current element

                if (strId === el.id && el.classList.contains(strClass)) {
                    if (trimmedLine.includes("<p")) {
                        const decoded_line = new DOMParser().parseFromString(trimmedLine, "text/html").body.textContent;
                        if (trimmedLine.includes(el.innerText) || (decoded_line.includes(el.innerText) || el.innerText.includes(decoded_line))) {
                            found_element = el;
                            break;
                        }
                    } else {
                        found_element = el;
                        break;
                    }
                }
            }

            if (!found_element) {
                console.error("Error finding element for line: ", trimmedLine.trim());
                return;
            }

            if (trimmedLine.startsWith("<p")) {
                // Skip processing <p> tags without allowed classes
                const hasAllowedClass = allowedClasses.some((cls) => strClass.includes(cls));
                if (!hasAllowedClass) {
                    return; // Skip this <p> tag
                }

                // Adjust <p> tag indent level if needed
                if (lastAdjustedIndentLevel !== null && rawIndentLevel === lastAdjustedRawIndentLevel) {
                    indentLevel = lastAdjustedIndentLevel;
                } else if (result.length > 0) {
                    const previousIndentLevel = result[result.length - 1].indentLevel;
                    if (indentLevel > previousIndentLevel + 1) {
                        indentLevel = previousIndentLevel + 1;
                        lastAdjustedIndentLevel = indentLevel;
                        lastAdjustedRawIndentLevel = rawIndentLevel;
                    }
                }
            } else {
                // Reset adjustment tracking for <div> tags
                lastAdjustedIndentLevel = null;
                lastAdjustedRawIndentLevel = null;
            }

            if (found_element.dataset.boolQuickLink === "false") {
                return;
            }

            if (found_element.classList.contains("sub-sub-step")) {
                indentLevel++;
            }

            const tagName = trimmedLine.match(/^<(\w+)/)?.[1]; // Extract the tag name

            if (found_element.dataset.customQuickLink) {
                const custom_els = found_element.dataset.customQuickLink.split(";");
                for (let i = 0; i < custom_els.length; i++) {
                    result.push({
                        tagName,
                        rawIndentLevel, // Store the original unedited indent level
                        indentLevel, // Store the adjusted indent level
                        element: found_element,
                        line,
                        custom_name: custom_els[i]
                    });
                }

            } else {
                if (!strClass.includes("content-container-top")) {
                    result.push({
                        tagName,
                        rawIndentLevel, // Store the original unedited indent level
                        indentLevel, // Store the adjusted indent level
                        element: found_element,
                        line
                    });
                }
            }
        }
    });

    return result;
}

function generate_quick_links(parentElement, result) {
    // console.log(result);

    if (!result || result.length === 0) {
        console.error("Result array is empty or undefined.");
        return;
    }

    let currentList = null; // The current <ul>
    let listStack = []; // Stack to manage nested lists
    let currentIndentLevel = 0;

    for (let item_index = 0; item_index < result.length; item_index++) {
        let item = result[item_index];

        if (item.element.classList.contains("content-container-top")) {
            continue;
        }

        const { element, indentLevel } = item;
        let isSectionHeader = false;

        if (element.dataset.sectionInd) {
            isSectionHeader = true;
        }

        if (!element || indentLevel === undefined) {
            continue; // Skip invalid items
        }

        if (isSectionHeader) {
            // Create an <h2> for the section header
            const sectionHeader = document.createElement("h2");
            sectionHeader.innerText = element.dataset.sectionInd;
            parentElement.appendChild(sectionHeader);

            // Create a new <ul> for this section and reset the stack
            currentList = document.createElement("ul");
            parentElement.appendChild(currentList);
            listStack = [currentList];
            currentIndentLevel = 0;
        }

        // If no currentList exists (e.g., first item is not a section header), create a root <ul>
        if (!currentList) {
            currentList = document.createElement("ul");
            parentElement.appendChild(currentList);
            listStack = [currentList];
            currentIndentLevel = 0;
        }

        // Create a new <li> and <a> for the current element
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        let element_id = element.id;

        if (element_id === "") {
            element_id = result[item_index - 1].element.id;
        }

        link.href = `#${element_id}`;

        if (item.custom_name){
            link.innerText = item.custom_name;
        } else {
            link.innerText =
                element.firstElementChild?.innerText.trim() ||
                element.innerText.trim() ||
                "Untitled";
        }

        listItem.appendChild(link);

        // Handle nesting based on indentLevel
        if (indentLevel > currentIndentLevel) {
            // Create a new nested <ul> and append it to the last <li>
            const newNestedList = document.createElement("ul");
            const lastListItem = listStack[listStack.length - 1].lastElementChild;

            if (lastListItem) {
                lastListItem.appendChild(newNestedList);
                listStack.push(newNestedList); // Push the new <ul> onto the stack
                currentIndentLevel = indentLevel;
            } else {
                console.error("Cannot create nested list. Missing parent <li>.");
            }
        } else if (indentLevel < currentIndentLevel) {
            // Pop lists from the stack until the current level matches the indentLevel
            while (listStack.length > 1 && currentIndentLevel > indentLevel) {
                listStack.pop();
                currentIndentLevel--;
            }
        }

        // Append the current <li> to the current <ul>
        if (listStack.length > 0) {
            listStack[listStack.length - 1].appendChild(listItem);
        } else {
            console.error("List stack is empty. Cannot append <li>.");
        }
    }
}


document.addEventListener("DOMContentLoaded", function() {
    let path = window.location.pathname;
    let page = path.split("/").pop();

    if (page === "index.html") {
        return;
    }

    // Target the parent element where you want to append the elements
    let parentElement = document.getElementsByClassName("content-container-top")[0];

    if (parentElement === undefined) {
        const smoothScrollElement = document.getElementsByClassName("smooth-scroll")[0];
        parentElement = document.createElement("div");
        parentElement.classList.add("content-container-top");
        // Check if the smoothScrollElement has any child elements
        if (smoothScrollElement.firstChild) {
            // Insert the parentElement at the top, before the first child
            smoothScrollElement.insertBefore(parentElement, smoothScrollElement.firstChild);
        } else {
            // If there are no child elements, just append it as usual
            smoothScrollElement.appendChild(parentElement);
        }
    }

    if (generate_font_box(parentElement)){
        generate_quick_links(parentElement, getTagIndentLevelsFromHTML());
    }
})


/*
=======================================
LIGHTBOX FOR IMAGES
=======================================
 */
function addLightboxClass() {
    // Get all anchor tags on the page
    const anchorTags = document.querySelectorAll('a');

    // Common image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

    // Loop through all anchor tags
    anchorTags.forEach(anchor => {
        const href = anchor.getAttribute('href');

        // Skip if no href attribute or null
        if (!href) return;

        // Check if the href ends with any image extension (case insensitive)
        const endsWithImageExt = imageExtensions.some(ext =>
            href.toLowerCase().endsWith(ext)
        );

        // Add the class if it's an image link
        if (endsWithImageExt) {
            anchor.classList.add('lightbox-trigger');
        }
    });
}


function addLightboxContainer() {
    const smoothScrollDiv = document.querySelector('div.smooth-scroll');

    if (smoothScrollDiv) {

        const lightboxHTML = `
    <div id="lightbox" class="lightbox">
        <span class="close-lightbox">&times;</span>
        <div class="lightbox-content">
            <div class="lightbox-caption"></div>
            <img id="lightbox-img" src="" alt="Enlarged image">
        </div>
    </div>
    `;
        smoothScrollDiv.insertAdjacentHTML('afterend', lightboxHTML);

        // console.log('Lightbox container added successfully');
    } else {
        console.error('No div with class "smooth-scroll" found');
    }
}

/**
 * Opens the lightbox with the specified image source
 * @param {string} imgSrc - Source URL of the image
 * @param {string} captionText - Text to display as caption
 */
function openLightbox(imgSrc, captionText) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    // Show a loading state (optional)
    lightbox.style.display = 'flex';
    lightboxImg.style.display = 'none';
    lightboxCaption.textContent = 'Loading...';

    // Create a new image to load in the background
    const img = new Image();
    img.src = imgSrc;

    img.onload = function() {
        // Set the source and display the image
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.style.display = 'block';
        lightboxCaption.textContent = captionText;
    };

    img.onerror = function() {
        // Handle error case
        lightboxCaption.textContent = 'Error loading image';
        lightboxImg.style.display = 'none';
    };
}


/**
 * Closes the lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}

/**
 * Event handler for lightbox trigger clicks
 * @param {Event} event - Click event
 */
function handleTriggerClick(event) {
    event.preventDefault();
    const imgSrc = this.getAttribute('href');
    let captionText = this.textContent.trim()
    captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1); // Uppercase the first letter of the string
    openLightbox(imgSrc, captionText);
}

/**
 * Initializes the lightbox by setting up event listeners
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close-lightbox');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (!lightbox || !closeBtn) {
        console.error('Lightbox elements not found');
        return;
    }

    // Add click event listeners to triggers
    triggers.forEach(trigger => {
        trigger.addEventListener('click', handleTriggerClick);
    });

    // Add close button event listener
    closeBtn.addEventListener('click', closeLightbox);

    // Add lightbox background click listener
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Add keyboard event listener
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
}

// Single DOMContentLoaded event listener that handles everything in the right order
document.addEventListener('DOMContentLoaded', () => {
    addLightboxContainer(); // First add the container to the DOM
    addLightboxClass(); // Then add classes to the appropriate anchor tags
    initLightbox(); // Finally initialize the lightbox functionality
});


/*
=======================================
LAZY LOAD IMAGES
=======================================
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cache for loaded images
    const imageCache = new Map();

    // Options for the IntersectionObserver
    const observerOptions = {
        root: null, // viewport
        rootMargin: '100px', // load images 100px before they enter the viewport
        threshold: 0.01 // trigger when at least 1% of the element is visible
    };

    // Callback for the IntersectionObserver
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const aTag = entry.target;
                const imgUrl = aTag.getAttribute('href');

                // If image isn't in cache, load it
                if (!imageCache.has(imgUrl)) {
                    const img = new Image();
                    img.src = imgUrl;
                    imageCache.set(imgUrl, img);

                    // Optional: You could preload by adding to DOM (hidden)
                    // img.style.display = 'none';
                    // document.body.appendChild(img);
                }

                // Unobserve since we've loaded it and it's now cached
                observer.unobserve(aTag);
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all a tags with href pointing to an image
    document.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".gif"], a[href$=".webp"]').forEach(aTag => {
        observer.observe(aTag);
    });
});