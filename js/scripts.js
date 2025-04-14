// console.log("Loaded Scripts")


function getCurrentPage() {
    let path = window.location.pathname.split("/").pop();
    console.log(path);
    return path;
}

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

/*
=======================================
PRELOAD IMAGES AND VIDEOS
=======================================
*/

function preloadImages() {
    // Preload Images if enabled in localStorage
    if (localStorage.getItem('preload') === 'true') {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const anchors = Array.from(document.querySelectorAll('a[href]'))
            .filter(anchor => imageExtensions.some(ext => anchor.href.endsWith(ext)));

        anchors.forEach(anchor => {
            new Image().src = anchor.href;
        });
    }
}


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


function setDefaultFonts() {
    let page = getCurrentPage();

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
}

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

function scrollToAnchors() {
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
}

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
    let page = getCurrentPage();

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

function touchScreenInit() {
    try {
        if (hasTouchScreen() || isMobile()) {
            document.getElementById('mobileContent').style.display = 'block';
            document.getElementById('nonMobileContent').style.display = 'none';
        } else {
            document.getElementById('mobileContent').style.display = 'none';
            document.getElementById('nonMobileContent').style.display = 'block';
        }
    } catch (e) {
        console.log(e);
    }
}

/*
=======================================
TUTORIAL BOX
=======================================
 */

function addTutorialBox() {
    const page = getCurrentPage();

    if (page === "index.html") {
        return;
    }

    const smoothScrollDiv = document.querySelector('div.smooth-scroll');

    if (!smoothScrollDiv) {
        console.log("SmoothScrollDiv is missing, unable to generate Tutorial Box");
        return;
    }

    if (smoothScrollDiv) {
        const tutorialHTML = `
    <div class="tutorial-overlay" id="tutorialOverlay">
            <div class="tutorial-popup">
                <div class="tutorial-header">
                    <h2 id="tutorialTitle">Welcome to Zombies Easter Egg Guides!</h2>
                    <div class="tutorial-page-indicator">
                        <span id="currentPage">1</span>/<span id="totalPages">4</span>
                    </div>
                </div>

                <!-- Tutorial Pages Container -->
                <div class="tutorial-pages-container">
                    <!-- Page 1 -->
                    <div class="tutorial-page" data-page="1">
                        <p>Welcome. Since it's your first time here, here's a quick walkthrough.</p>
                        <p>Our guides offer step-by-step instructions for completing Easter Eggs in various Call of Duty Zombies games.</p>
                    </div>

                    <!-- Page 2 -->
                    <div class="tutorial-page" data-page="2">
                        <a href="/games/IW/zombies_in_spaceland/pictures/main_ee/alien_example.webp" style="display: none;" data-caption="Example Image 1">Arrow Keyed IMG 1</a>
                        <p>Inside any guide, text shown in <a href="/zombiesGuidesPublic/dog_tut_example.webp" data-width="75%" data-height="75%" data-caption="Example Image 2">blue</a> is a clickable image link, except the links at the top of the page.</p>
                        <p>Clicking opens the image in an on-screen viewer. You can close it by clicking outside the image or hitting the X. Use the left/right arrow keys to move between images.</p>
                        <a href="/games/BO4/alpha_omega/pictures/ray_gun_mark_2/frame/frames_panel.webp" style="display: none;" data-caption="Example Image 3">Arrow Keyed IMG 2</a>
                    </div>

                    <!-- Page 3 -->
                    <div class="tutorial-page" data-page="3">
                        <p>Links in <a href="#">light blue</a> will take you to another part of the same page or to a different page on this site.</p>
                        <p>You can always use your browser’s back button to return to where you were.</p>
                    </div>

                    <!-- Page 4 -->
                    <div class="tutorial-page" data-page="4">
                        <p>Links in <a href="https://youtube.com">green</a> lead to other websites, like YouTube or Reddit.</p>
                        <p>We try to make it clear where each link goes before you click it.</p>
                    </div>

                    <!-- Page 5 -->
                    <div class="tutorial-page" data-page="5">
                        <p>If you ever need to jump to the top of a guide, just use the "Back to Top" button.</p>
                        <p>Also, the guides are open to anyone who wishes to contribute. Join the <a href="https://discord.com/invite/hQng3Yz48A">Discord Server</a> to start helping out.</p>
                        <p>Thanks for checking out the Website!</p>
                    </div>
                </div>
                
                <div class="tutorial-navigation">
                    <button id="prevPageBtn" class="tutorial-nav-btn" disabled>Previous</button>
                    <button id="nextPageBtn" class="tutorial-nav-btn">Next</button>
                    <button id="finishBtn" class="tutorial-nav-btn finish-btn" style="display: none;">Finish</button>
                </div>
                
                <div class="tutorial-progress-container">
                    <div class="tutorial-progress-bar">
                        <div class="tutorial-progress-fill" id="progressFill"></div>
                    </div>
                    <div class="tutorial-progress-text" id="progressText">Loading tutorial... 0%</div>
                </div>
            </div>
        </div>
    `;
        smoothScrollDiv.insertAdjacentHTML("beforebegin", tutorialHTML);
    }
}

function tutorialPopupInit() {
    // Check if tutorial has been shown before
    if (!localStorage.getItem('zombiesGuidesTutorialShown')) {
        addTutorialBox();
        initTutorial();

        // Load tutorial with slight delay for better UX
        setTimeout(() => {
            showTutorial();
        }, 800);

    } else {
        // Hide tutorial for returning users
        const tutorialOverlay = document.getElementById('tutorialOverlay')

        if (tutorialOverlay) {
            tutorialOverlay.style.display = 'none';
        }
    }
}

function initTutorial() {
    let tutorialOverlay = document.getElementById('tutorialOverlay');
    if (tutorialOverlay) {
        tutorialOverlay.style.display = 'flex';
    }

    // Initialize variables
    const totalPages = document.querySelectorAll('.tutorial-page').length;
    document.getElementById('totalPages').textContent = totalPages;

    // Set up event listeners
    document.getElementById('prevPageBtn').addEventListener('click', navigatePrevPage);
    document.getElementById('nextPageBtn').addEventListener('click', navigateNextPage);
    document.getElementById('finishBtn').addEventListener('click', finishTutorial);

    // Show first page
    showPage(1);
}

function showTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    overlay.style.display = 'flex';
}

function showPage(pageNum) {
    const pages = document.querySelectorAll('.tutorial-page');
    const totalPages = pages.length;
    const currentPageElement = document.getElementById('currentPage');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const finishBtn = document.getElementById('finishBtn');

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    document.querySelector(`.tutorial-page[data-page="${pageNum}"]`).classList.add('active');

    // Update page counter
    currentPageElement.textContent = pageNum;

    // Update button states
    prevBtn.disabled = pageNum === 1;

    // Handle last page differently
    if (pageNum === totalPages) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';

    } else {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
    }

    // Update progress bar
    updateProgressBar(pageNum, totalPages);
}

function navigateNextPage() {
    const currentPage = parseInt(document.getElementById('currentPage').textContent);

    showPage(currentPage + 1);
}

function navigatePrevPage() {
    const currentPage = parseInt(document.getElementById('currentPage').textContent);

    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

function finishTutorial() {
    document.getElementById('tutorialOverlay').style.display = 'none';
    localStorage.setItem('zombiesGuidesTutorialShown', 'true');
}

function updateProgressBar(currentPage, totalPages) {
    const progressPercentage = (currentPage / totalPages) * 100;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    document.getElementById('progressText').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Function to manually show tutorial
function resetTutorial() {
    console.log("Manually Reset Tutorial...");
    localStorage.removeItem('zombiesGuidesTutorialShown');
}

// console.log(localStorage.getItem('zombiesGuidesTutorialShown'));
// resetTutorial();

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

function incompleteATagInit() {
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
}


/*
=======================================
ADD LINK TO PAGE CLASS TO A TAGS
=======================================
 */

function colourCodeAnchors() {
    try {
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

    } catch (e) {
        console.log(e);
    }
}

/*
=======================================
AUTO GENERATE THE QUICK ACCESS TAGS
=======================================
 */

document.addEventListener('DOMContentLoaded', function () {
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
        console.log("No <div class='smooth-scroll'> found in the document.");
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
                console.log("Error finding element for line: ", trimmedLine.trim());
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
        console.log("Result array is empty or undefined.");
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
            try {
                element_id = result[item_index - 1].element.id;
            } catch (e) {
                console.error(e);
                continue;
            }

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
                console.log("Cannot create nested list. Missing parent <li>.");
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
            console.log("List stack is empty. Cannot append <li>.");
        }
    }
}


document.addEventListener("DOMContentLoaded", function() {
    try {
        let page = getCurrentPage();

        console.log(`Quick links page name: ${page}`);

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

        if (generate_font_box(parentElement)) {
            generate_quick_links(parentElement, getTagIndentLevelsFromHTML());
        }
    } catch (e) {
        console.log(e);
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
        console.log('No div with class "smooth-scroll" found');
    }
}

// Store all lightbox triggers for navigation
let allTriggers = [];
let currentIndex = -1;

/**
 * Preloads images adjacent to the current one
 * @param {number} currentIndex - Index of the current image
 */
function preloadAdjacentImages(currentIndex) {
    if (!allTriggers.length) return;

    // Preload next image
    if (currentIndex < allTriggers.length - 1) {
        const nextImg = new Image();
        nextImg.src = allTriggers[currentIndex + 1].getAttribute('href');
    }

    // Preload previous image
    if (currentIndex > 0) {
        const prevImg = new Image();
        prevImg.src = allTriggers[currentIndex - 1].getAttribute('href');
    }
}

/**
 * Opens the lightbox with the specified image source
 * @param {string} imgSrc - Source URL of the image
 * @param {string} captionText - Text to display as caption
 * @param {number} index - Index of the image in the triggers array
 */
function openLightbox(imgSrc, captionText, index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    // Update current index
    currentIndex = index;

    // Show a loading state
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

        // Preload adjacent images
        preloadAdjacentImages(currentIndex);
    };

    img.onerror = function() {
        // Handle error case
        lightboxCaption.textContent = 'Error loading image';
        lightboxImg.style.display = 'none';
    };
}

/**
 * Navigate to the previous image
 */
function navigateToPrevious() {
    if (currentIndex > 0) {
        const prevTrigger = allTriggers[currentIndex - 1];
        const imgSrc = prevTrigger.getAttribute('href');
        let captionText = prevTrigger.textContent.trim();
        captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
        openLightbox(imgSrc, captionText, currentIndex - 1);
    }
}

/**
 * Navigate to the next image
 */
function navigateToNext() {
    if (currentIndex < allTriggers.length - 1) {
        const nextTrigger = allTriggers[currentIndex + 1];
        const imgSrc = nextTrigger.getAttribute('href');
        let captionText = nextTrigger.textContent.trim();
        captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
        openLightbox(imgSrc, captionText, currentIndex + 1);
    }
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
    let captionText = this.textContent.trim();
    captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1); // Uppercase the first letter of the string

    // Find index of this trigger in the allTriggers array
    const index = allTriggers.indexOf(this);
    openLightbox(imgSrc, captionText, index);
}

/**
 * Initializes the lightbox by setting up event listeners
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close-lightbox');

    // Update our triggers collection
    allTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));

    if (!lightbox || !closeBtn) {
        console.log('Lightbox elements not found');
        return;
    }

    // Add click event listeners to triggers
    allTriggers.forEach(trigger => {
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
        if (lightbox.style.display !== 'flex') return;

        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            navigateToPrevious();
        } else if (event.key === 'ArrowRight') {
            navigateToNext();
        }
    });
}

// Single DOMContentLoaded event listener that handles everything in the right order
document.addEventListener('DOMContentLoaded', () => {
    console.log()
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


document.addEventListener("DOMContentLoaded", function() {
    changeThemeColour();
    touchScreenInit();
    preloadImages();
    setDefaultFonts();
    scrollToAnchors();
    tutorialPopupInit();
    colourCodeAnchors();
});

window.addEventListener("DOMContentLoaded", function () {
    incompleteATagInit();
});