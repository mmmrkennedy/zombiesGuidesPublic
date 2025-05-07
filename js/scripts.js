// console.log("Loaded Scripts")


function getCurrentPage() {
    return window.location.pathname.split("/").pop();
}


function setTitle() {
    if (getCurrentPage() === "index.html") {
        return;
    }
    
    let titleElement = document.getElementsByClassName("title-text")[0];
    let titleText = titleElement.innerHTML;

    if (document.title.toLowerCase() === "change me") {
        const fullPath = window.location.pathname;
        const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);

        // Remove .html extension
        const nameWithoutExtension = fileName.replace(/\.html$/, '');

        // Replace underscores with spaces
        const withSpaces = nameWithoutExtension.replace(/_/g, ' ');

        // Create a list of words that should remain lowercase
        const lowercaseWords = ["of", "the", "a", "an", "and", "but", "or", "for", "nor", "in", "on", "at", "to", "with", "by"];

        // Split into words, process each, then join back
        const words = withSpaces.split(' ');
        const titleCaseWords = words.map((word, index) => {
            // Always capitalize first and last word
            if (index === 0 || index === words.length - 1) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }

            // Check if the word should remain lowercase
            if (lowercaseWords.includes(word.toLowerCase())) {
                return word.toLowerCase();
            }

            // Otherwise capitalize first letter
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        document.title = titleCaseWords.join(' ');
    }

    if (titleText.toLowerCase() === "change me") {
        titleElement.innerHTML = document.title;
    }
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
    const isLocalEnvironment = window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes(".local");

    if (isLocalEnvironment) {
        window.location.href = "/ZombiesGuidesHolder/zombiesGuidesPublic/index.html";

    } else {
        window.location.href = "/zombiesGuidesPublic/index.html";
    }
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
    document.getElementById('totalPages').textContent = String(document.querySelectorAll('.tutorial-page').length);

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

function setupSolverButtons() {
    const solver_button_divs = document.getElementsByClassName('solver-with-button');

    if (!solver_button_divs) return;

    for (const solver_button_div of solver_button_divs) {
        const toggle_button = solver_button_div.querySelector('.square-button');
        const nested_container = solver_button_div.querySelector('div');

        if (!toggle_button || !nested_container) continue;

        toggle_button.addEventListener('click', () => {
            toggle_button.classList.toggle('active');
            nested_container.style.display = toggle_button.classList.contains('active') ? 'block' : 'none';
        });
    }
}

function isElementEmpty(element) {
    for (const child of element.childNodes) {
        if (child.nodeType !== Node.COMMENT_NODE && child.nodeType !== Node.DOCUMENT_TYPE_NODE) {
            if (child.nodeType === Node.ELEMENT_NODE ||
                (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '')) {
                return false;
            }
        }
    }
    return true;
}

function generateFontBox(parentElement) {
    if (!isElementEmpty(parentElement)) {
        font_loader_init();
        return false;
    }

    const fontOptions = [
        { value: "Arial", text: "Arial" },
        { value: "Verdana", text: "Verdana (Higher Readability)" },
        { value: "OpenDyslexic", text: "OpenDyslexic" }
    ];

    // Create elements
    const label = document.createElement("label");
    label.setAttribute("for", "fontSelector");
    label.textContent = "Select a Font:";

    const select = document.createElement("select");
    select.id = "fontSelector";

    // Add options to select
    fontOptions.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
    });

    // Append elements with line breaks
    parentElement.appendChild(document.createTextNode("\n"));
    parentElement.appendChild(label);
    parentElement.appendChild(document.createTextNode("\n"));
    parentElement.appendChild(select);
    parentElement.appendChild(document.createTextNode("\n"));

    font_loader_init();
    return true;
}

function initializeQuickLinks() {
    try {
        const page = getCurrentPage();

        if (page === "index.html") return;

        // Find or create the container
        let parentElement = document.querySelector(".content-container-top");

        if (!parentElement) {
            const smoothScrollElement = document.querySelector(".smooth-scroll");
            if (!smoothScrollElement) return;

            parentElement = document.createElement("div");
            parentElement.classList.add("content-container-top");

            if (smoothScrollElement.firstChild) {
                smoothScrollElement.insertBefore(parentElement, smoothScrollElement.firstChild);
            } else {
                smoothScrollElement.appendChild(parentElement);
            }
        }

        // Generate font box and quick links
        if (generateFontBox(parentElement)) {
            const elementsData = getQuickLinkElements();
            generateQuickLinks(parentElement, elementsData);
        }
    } catch (e) {
        console.error("Error initializing quick links:", e);
    }
}

function shouldExcludeElement(element) {
    // Check if the element itself or any of its ancestors is a solver-container
    let current = element;
    while (current) {
        if (current.classList &&
            (current.classList.contains('solver-container') ||
                current.classList.contains('stats') ||
                current.classList.contains('weapon-desc') ||
                current.classList.contains('warning') ||
                current.classList.contains('solver-output') ||
                current.classList.contains('solver-symbol-select') ||
                current.classList.contains('aligned-buttons') ||
                current.classList.contains('aligned-label'))) {
            return true;
        }
        current = current.parentElement;
    }

    return element.dataset && element.dataset.boolQuickLink === "false";
}

// Helper function to get just the title text from an element
function getElementTitle(element) {
    // If there's a custom title specified, use that
    if (element.dataset.customTitle) {
        return element.dataset.customTitle;
    }

    if (element.children.length !== 0) {
        return element.children[0].innerHTML;

    } else {
        return element.textContent;

    }
}

function getQuickLinkElements() {
    const results = [];

    // Get all div.content-container elements with data-section-ind
    // const containers = document.querySelectorAll("div.content-container[data-section-ind]");
    const containers = document.querySelectorAll("div.content-container");

    for (const container of containers) {
        // Skip if this container should be excluded
        if (shouldExcludeElement(container)) continue;

        // console.log(container.dataset.sectionInd)

        // Add the container itself as a section header
        results.push({
            element: container,
            indentLevel: 0,
            isSectionHeader: container.dataset.sectionInd !== undefined
        });

        // Find all step-group-title paragraphs in this container
        const titles = container.querySelectorAll("p.step-group-title, p.upgrade-title, p.sub-sub-step");

        // for (const title of titles) {
        for (const [title_counter, title] of titles.entries()) {

            // Skip if inside or related to solver-container
            if (shouldExcludeElement(title)) {
                continue;
            }

            // Determine indent level
            let indentLevel = 1; // Default is one level deeper than container

            // Add extra indent for sub-sub-step
            if (title.classList.contains("sub-sub-step") && title_counter !== 0) {
                indentLevel = 2;
            }

            // Handle custom quick links if present
            if (title.dataset.customQuickLink) {
                const customLinks = title.dataset.customQuickLink.split(";");
                title.id = customLinks[0];
                for (const customName of customLinks) {
                    results.push({
                        element: title,
                        indentLevel,
                        custom_name: customName
                    });
                }
            } else {
                results.push({
                    element: title,
                    indentLevel
                });
            }
        }
    }

    return results;
}

function generateQuickLinks(parentElement, elements) {
    if (!elements || elements.length === 0) return;

    let currentList = null;
    let listStack = [];
    let currentIndentLevel = 0;

    for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        const { element, indentLevel, isSectionHeader } = item;

        if (!element || indentLevel === undefined) continue;

        if (isSectionHeader) {
            // Create section header
            const sectionHeader = document.createElement("h2");
            sectionHeader.innerText = element.dataset.sectionInd;
            parentElement.appendChild(sectionHeader);

            // Create new list for this section
            currentList = document.createElement("ul");
            parentElement.appendChild(currentList);
            listStack = [currentList];
            currentIndentLevel = 0;
        }

        // Create root list if needed
        if (!currentList) {
            currentList = document.createElement("ul");
            parentElement.appendChild(currentList);
            listStack = [currentList];
            currentIndentLevel = 0;
        }

        // Create list item and link
        const listItem = document.createElement("li");
        const link = document.createElement("a");

        // Get element ID, fallback to previous element's ID if empty
        let elementId = element.id;
        if (elementId === "" && i > 0) {
            elementId = elements[i - 1].element.id || "";
        }

        if (elementId === "") continue; // Skip if no valid ID

        link.href = `#${elementId}`;

        // Set link text - using the improved title extraction
        if (item.custom_name) {
            link.innerText = item.custom_name;
        } else {
            link.innerText = getElementTitle(element);
        }

        listItem.appendChild(link);

        // Handle nesting
        if (indentLevel > currentIndentLevel) {
            // Need to create nested lists to reach the desired indent level
            while (currentIndentLevel < indentLevel) {
                const newList = document.createElement("ul");

                if (listStack[listStack.length - 1].lastElementChild) {
                    listStack[listStack.length - 1].lastElementChild.appendChild(newList);
                } else {
                    // If there's no last element, create a dummy item
                    const dummyItem = document.createElement("li");
                    dummyItem.textContent = "Untitled";
                    listStack[listStack.length - 1].appendChild(dummyItem);
                    dummyItem.appendChild(newList);
                }

                listStack.push(newList);
                currentIndentLevel++;
            }
        } else if (indentLevel < currentIndentLevel) {
            // Go back up the nesting levels
            while (listStack.length > 1 && currentIndentLevel > indentLevel) {
                listStack.pop();
                currentIndentLevel--;
            }
        }

        // Add list item to current list
        if (listStack.length > 0) {
            listStack[listStack.length - 1].appendChild(listItem);
        }
    }
}

/*
=======================================
LIGHTBOX FOR IMAGES AND VIDEOS
=======================================
 */
function addLightboxClass() {
    // Get all anchor tags on the page
    const anchorTags = document.querySelectorAll('a');

    // Common media file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const videoExtensions = ['.webm', '.mp4', '.ogg'];
    const mediaExtensions = [...imageExtensions, ...videoExtensions];

    // Loop through all anchor tags
    anchorTags.forEach(anchor => {
        const href = anchor.getAttribute('href');

        // Skip if no href attribute or null
        if (!href) return;

        // Check if the href ends with any media extension (case insensitive)
        const endsWithMediaExt = mediaExtensions.some(ext =>
            href.toLowerCase().endsWith(ext)
        );

        // Add the class if it's a media link
        if (endsWithMediaExt) {
            anchor.classList.add('lightbox-trigger');

            // Store the media type as a data attribute
            if (videoExtensions.some(ext => href.toLowerCase().endsWith(ext))) {
                anchor.dataset.mediaType = 'video';
            } else {
                anchor.dataset.mediaType = 'image';
            }
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
            <video id="lightbox-video" controls loop style="display: none; max-height: 80vh; object-fit: contain;">
                Your browser does not support the video tag.
            </video>
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
 * Preloads media adjacent to the current one
 * @param {number} currentIndex - Index of the current media item
 */
function preloadAdjacentMedia(currentIndex) {
    if (!allTriggers.length) return;

    // Preload next media (only preload images, not videos)
    if (currentIndex < allTriggers.length - 1) {
        const nextTrigger = allTriggers[currentIndex + 1];
        const mediaType = nextTrigger.dataset.mediaType;

        if (mediaType === 'image') {
            const nextImg = new Image();
            nextImg.src = nextTrigger.getAttribute('href');
        }
    }

    // Preload previous media (only preload images, not videos)
    if (currentIndex > 0) {
        const prevTrigger = allTriggers[currentIndex - 1];
        const mediaType = prevTrigger.dataset.mediaType;

        if (mediaType === 'image') {
            const prevImg = new Image();
            prevImg.src = prevTrigger.getAttribute('href');
        }
    }
}

/**
 * Opens the lightbox with the specified media source
 * @param {string} mediaSrc - Source URL of the media
 * @param {string} captionText - Text to display as caption
 * @param {number} index - Index of the media in the triggers array
 * @param {string} mediaType - Type of media ('image' or 'video')
 */
function openLightbox(mediaSrc, captionText, index, mediaType) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    if (!lightbox || !lightboxImg || !lightboxVideo || !lightboxCaption) return;

    // Update current index
    currentIndex = index;

    // Show a loading state
    lightbox.style.display = 'flex';
    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = 'none';
    lightboxCaption.textContent = 'Loading...';

    if (mediaType === 'image') {
        // Create a new image to load in the background
        const img = new Image();
        img.src = mediaSrc;

        img.onload = function() {
            // Set the source and display the image
            lightboxImg.setAttribute('src', mediaSrc);
            lightboxImg.style.display = 'block';
            lightboxCaption.textContent = captionText;

            // Preload adjacent media
            preloadAdjacentMedia(currentIndex);
        };

        img.onerror = function() {
            // Handle error case
            lightboxCaption.textContent = 'Error loading image';
            lightboxImg.style.display = 'none';
        };
    } else if (mediaType === 'video') {
        // Handle video content
        lightboxVideo.setAttribute('src', mediaSrc);
        lightboxVideo.style.display = 'block';
        lightboxCaption.textContent = captionText;

        // Set up event listeners for video loading
        lightboxVideo.onloadeddata = function() {
            // Video is loaded and can be played
            lightboxCaption.textContent = captionText;
        };

        lightboxVideo.onerror = function() {
            // Handle error case
            lightboxCaption.textContent = 'Error loading video';
            lightboxVideo.style.display = 'none';
        };

        // Start playing the video
        lightboxVideo.play().catch(e => {
            console.log('Auto-play prevented:', e);
            // This is expected on many browsers due to autoplay policies
        });
    }
}

/**
 * Navigate to the previous media
 */
function navigateToPrevious() {
    if (currentIndex > 0) {
        const prevTrigger = allTriggers[currentIndex - 1];
        const mediaSrc = prevTrigger.getAttribute('href');
        let captionText = prevTrigger.textContent.trim();
        captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
        const mediaType = prevTrigger.dataset.mediaType;
        openLightbox(mediaSrc, captionText, currentIndex - 1, mediaType);
    }
}

/**
 * Navigate to the next media
 */
function navigateToNext() {
    if (currentIndex < allTriggers.length - 1) {
        const nextTrigger = allTriggers[currentIndex + 1];
        const mediaSrc = nextTrigger.getAttribute('href');
        let captionText = nextTrigger.textContent.trim();
        captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
        const mediaType = nextTrigger.dataset.mediaType;
        openLightbox(mediaSrc, captionText, currentIndex + 1, mediaType);
    }
}

/**
 * Closes the lightbox and stops any playing videos
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');

    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }

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
    const mediaSrc = this.getAttribute('href');
    let captionText = this.textContent.trim();
    captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1); // Uppercase the first letter of the string
    const mediaType = this.dataset.mediaType || 'image'; // Default to image if not specified

    // Find index of this trigger in the allTriggers array
    const index = allTriggers.indexOf(this);
    openLightbox(mediaSrc, captionText, index, mediaType);
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

async function includeSolverComponent() {
    const solverInserts = document.querySelectorAll('.solver-insert');
    let event_names = [];
    
    // Use Promise.all to load all inserts simultaneously
    await Promise.all(Array.from(solverInserts).map(async (insert) => {
        try {
            const response = await fetch(insert.dataset.solverHtmlPath);
            event_names.push(insert.dataset.solverHtmlPath.split("/").pop().replace(/\.html$/, ''));
            if (!response.ok) throw new Error(`Failed to fetch ${insert.dataset.solverHtmlPath}`);

            const html = await response.text();
            insert.innerHTML = html;
        } catch (error) {
            console.error(`Error loading solver component at ${insert.dataset.solverHtmlPath}:`, error);
            insert.innerHTML = `<p class="error">Failed to load solver component</p>`;
        }
    }));

    for (const eventName of event_names) {
        document.dispatchEvent(new CustomEvent(eventName));
    }
}


document.addEventListener("DOMContentLoaded", function() {
    changeThemeColour();
    touchScreenInit();
    preloadImages();
    setDefaultFonts();
    scrollToAnchors();
    tutorialPopupInit();
    colourCodeAnchors();
    setTitle();
    setupSolverButtons();

    let start = performance.now();
    initializeQuickLinks();
    let end = performance.now();
    console.log(`initializeQuickLinks took ${end - start} milliseconds`);

    addLightboxContainer(); // First add the container to the DOM
    addLightboxClass(); // Then add classes to the appropriate anchor tags
    initLightbox(); // Finally initialize the lightbox functionality
    includeSolverComponent();
});

window.addEventListener("DOMContentLoaded", function () {
    incompleteATagInit();
});