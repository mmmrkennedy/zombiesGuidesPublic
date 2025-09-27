/**
 * Mobile and touch device detection utilities
 * Handles device-specific functionality and responsive behavior
 */

/**
 * Detects if the device has a touch screen
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

/**
 * Detects if the device is mobile based on user agent
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Initializes mobile-specific UI elements
 */
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

// Make functions available globally
window.MobileDetection = {
    hasTouchScreen,
    isMobile,
    touchScreenInit
};