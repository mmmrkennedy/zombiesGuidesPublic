/*
 * Navigation utilities
 * Handles navigation between pages and environment detection
 */

/**
 * Navigates to the index page
 */
function navigateToIndex() {
    if (checkLocalEnvironment()) {
        window.location.href = "/index.html";
    } else {
        window.location.href = window.PageUtils.BASE_PATH + "index.html";
    }
}

/**
 * Opens the settings page in a new tab
 */
function navigateToSettings() {
    if (checkLocalEnvironment()) {
        window.open("/settings/settings.html", "_blank");
    } else {
        window.open(window.PageUtils.BASE_PATH + "settings/settings.html", "_blank");
    }
}

/**
 * Checks if the current environment is local development
 */
function checkLocalEnvironment() {
    return window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes(".local");
}

// Make functions available globally
window.NavUtils = {
    navigateToIndex,
    navigateToSettings,
    checkLocalEnvironment
};