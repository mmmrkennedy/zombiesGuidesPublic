/**
 * Media preloading utilities
 * Handles preloading of images and videos based on user preferences
 */

/**
 * Preloads images if enabled in localStorage
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

// Make functions available globally
window.MediaPreloader = {
    preloadImages
};