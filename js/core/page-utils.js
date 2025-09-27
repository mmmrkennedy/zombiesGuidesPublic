/**
 * Page-level utility functions
 * Handles page identification and title management
 */

const BASE_PATH = window.location.origin + "/";

/**
 * Gets the current page filename from the URL
 */
function getCurrentPage() {
    return window.location.pathname.split("/").pop();
}

/**
 * Sets the page title based on filename if title is "change me"
 */
function setTitle() {
    const currentPage = getCurrentPage();
    if (currentPage === "index.html" || currentPage === "") {
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

// Make functions available globally
window.PageUtils = {
    BASE_PATH,
    getCurrentPage,
    setTitle
};