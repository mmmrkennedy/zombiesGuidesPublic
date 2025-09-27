/**
 * Scroll management and history handling
 * Manages smooth scrolling, anchor navigation, and browser history
 */

/**
 * Scrolls to the top of the content window
 */
function scrollToTop(fromPopstate = false) {
    const contentWindow = document.querySelector('.content-window');
    if (contentWindow) {
        contentWindow.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Only add to history if this wasn't triggered by popstate
        if (!fromPopstate) {
            window.history.pushState({ anchor: null }, null, '#');
        }
    }
}

/**
 * Sets up click listeners for anchor links
 */
function scrollToAnchors() {
    document.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                // console.log('Anchor link clicked:', href);
                event.preventDefault();
                const elementId = href.substring(1);
                scrollToElement(elementId, 105); // This will add to history
            }
        }
    });
}

/**
 * Scrolls to a specific element by ID with offset
 */
function scrollToElement(elementId, offset, fromPopstate = false) {
    // console.log('scrollToElement called:', { elementId, offset, fromPopstate });

    const element = document.getElementById(elementId);
    const contentWindow = document.querySelector('.content-window');
    if (element && contentWindow) {
        const elementPosition = element.getBoundingClientRect().top;
        const contentWindowScrollTop = contentWindow.scrollTop;
        const targetY = elementPosition + contentWindowScrollTop - offset;

        // console.log('Scrolling to:', { elementId, targetY });

        contentWindow.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });

        // Only add to history if this wasn't triggered by popstate (back/forward button)
        if (!fromPopstate) {
            // console.log('Adding to history:', '#' + elementId);
            window.history.pushState({ anchor: elementId }, null, '#' + elementId);
        }
    }
}

/**
 * Clears hash from URL and scrolls to top
 */
function clearHashAndScrollTop() {
    // Clear hash from URL and scroll to top
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.href.split('#')[0]);
    }

    const contentWindow = document.querySelector('.content-window');
    if (contentWindow) {
        contentWindow.scrollTo({ top: 0, behavior: 'auto' });
    }
}

/**
 * Initialize popstate event handler for browser back/forward buttons
 */
function initHistoryManagement() {
    // Handle popstate events (back/forward button)
    window.addEventListener('popstate', function (event) {
        console.log('Popstate event triggered:', {
            hash: window.location.hash,
            state: event.state,
            historyLength: window.history.length
        });

        const hash = window.location.hash;
        if (hash && hash.length > 1) {
            const elementId = hash.substring(1);
            scrollToElement(elementId, 105, true);
        } else {
            const contentWindow = document.querySelector('.content-window');
            if (contentWindow && contentWindow.scrollTop > 0) {
                scrollToTop(true);
            } else {
                window.history.back();
            }
        }
    });
}

// Make functions available globally
window.ScrollManager = {
    scrollToTop,
    scrollToAnchors,
    scrollToElement,
    clearHashAndScrollTop,
    initHistoryManagement
};