/**
 * Mobile and touch device detection utilities
 * Handles device-specific functionality and responsive behaviour
 */

/**
 * Detects if the device is mobile based on user agent
 */
function isMobileUserAgent() {
    // console.log("User Agent: ", navigator.userAgent);
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Detects if the device is mobile based on screen size
 */
function isMobileScreenSize() {
    return window.innerWidth <= 768;
}

/**
 * Initializes mobile-specific UI elements
 */
function updateMobileText() {
    // const isMobileDevice = isMobileUserAgent() || isMobileScreenSize();
    const isMobileDevice = isMobileScreenSize();

    // console.log("updateMobileText called", isMobileScreenSize());

    const contentElements = [
        { id: 'mobileContent', showOnMobile: true },
        { id: 'nonMobileContent', showOnMobile: false },
    ];

    contentElements.forEach(contentItem => {
        try {
            const element = document.getElementById(contentItem.id);
            if (element) {
                element.style.display = isMobileDevice === contentItem.showOnMobile ? 'block' : 'none';
            } else {
                console.log(`${contentItem.id} not found`);
            }
        } catch (error) {
            console.log(`Error handling ${contentItem.id}:`, error);
        }
    });
}

// Make functions available globally
window.MobileDetection = {
    isMobileUserAgent,
    isMobileScreenSize,
    updateMobileText,
};

// Run once on page load
window.addEventListener('DOMContentLoaded', window.MobileDetection.updateMobileText);

// Update dynamically on resize
window.addEventListener('resize', window.MobileDetection.updateMobileText);
