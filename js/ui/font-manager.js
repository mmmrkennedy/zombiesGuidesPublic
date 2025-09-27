/**
 * Font management utilities
 * Handles font selection, loading, and application
 */

/**
 * Sets default fonts based on localStorage settings
 */
function setDefaultFonts() {
    let page = window.PageUtils.getCurrentPage();

    if (page === "index.html") {
        return;
    }

    let savedFont = localStorage.getItem('fontSelector');

    if (savedFont == null) {
        savedFont = "Verdana";
    }

    const smoothScroll = document.querySelector('.smooth-scroll');

    function waitForFontSelector() {
        const fontSelector = document.getElementById('fontSelector');
        if (fontSelector) {
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
        } else {
            setTimeout(waitForFontSelector, 100); // Check again in 100ms
        }
    }

    waitForFontSelector();
}

/**
 * Initializes font loader event listeners
 */
function font_loader_init() {
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector == null) {
        return;
    }

    const smoothScroll = document.querySelector('.smooth-scroll');

    if (window.PageUtils.getCurrentPage() === "index.html") {
        return;
    }

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

/**
 * Checks if an element is empty (contains only whitespace or comments)
 */
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

/**
 * Generates font selection box in the specified parent element
 */
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

// Make functions available globally
window.FontManager = {
    setDefaultFonts,
    font_loader_init,
    isElementEmpty,
    generateFontBox
};