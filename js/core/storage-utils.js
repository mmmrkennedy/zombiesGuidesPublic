/**
 * Storage and theme management utilities
 * Handles localStorage events and theme switching
 */

/**
 * Changes theme color based on localStorage setting
 */
function changeThemeColour() {
    const savedColorMode = localStorage.getItem('colourMode');
    if (savedColorMode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

/**
 * Initialize storage event listeners
 */
function initStorageListeners() {
    window.addEventListener('storage', function (event) {
        switch (event.key) {
            case 'preload':
                if (localStorage.getItem("preload") === 'true') {
                    window.location.reload();
                }
                break;
            case 'colourMode':
                changeThemeColour();
                break;
            case 'substeps':
                if (window.FeatureUtils && window.FeatureUtils.substeps) {
                    window.FeatureUtils.substeps((localStorage.getItem("substeps") === 'true'));
                }
                if (localStorage.getItem("substeps") === 'true') {
                    window.location.href = window.location.href.split("#")[0];
                }
                break;
            case 'close_setting_auto':
                break;
            default:
                console.log("Unknown Storage Event", event);
        }
    });
}

// Make functions available globally
window.StorageUtils = {
    changeThemeColour,
    initStorageListeners
};