/*
 * Navigation utilities
 * Handles navigation between pages and environment detection
 */

/**
 * Navigates to the index page
 */
function navigateToIndex() {
    if (checkLocalEnvironment()) {
        window.location.href = '/index.html';
    } else {
        window.location.href = window.PageUtils.BASE_PATH + 'index.html';
    }
}

/**
 * Checks if the current environment is local development
 */
function checkLocalEnvironment() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('.local');
}

// Make functions available globally
window.NavUtils = {
    navigateToIndex,
    checkLocalEnvironment,
};
