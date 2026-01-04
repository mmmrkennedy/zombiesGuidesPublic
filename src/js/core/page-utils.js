/**
 * Page-level utility functions
 * Handles page identification and title management
 */

const BASE_PATH = window.location.origin + '/';

/**
 * Gets the current page filename from the URL
 */
function getCurrentPage() {
    return window.location.pathname.split('/').pop();
}

// Make functions available globally
window.PageUtils = {
    BASE_PATH,
    getCurrentPage,
};
