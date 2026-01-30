console.log('[DEBUG] scripts.js loaded at:', new Date().toISOString());

/*
=======================================
GLOBAL FUNCTION WRAPPERS FOR HTML COMPATIBILITY
=======================================
 */

// Wrapper functions for HTML onclick handlers
function scrollToTop() {
    window.ScrollManager.scrollToTop();
}

function navigateToIndex() {
    window.NavUtils.navigateToIndex();
}

function toggleHamburgerMenu() {
    const overlay = document.getElementById('hamburgerMenuOverlay');
    if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    } else {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scrolling when menu is open
    }
}

/*
=======================================
LAZY LOAD IMAGES
=======================================
 */
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Disable preloading on mobile devices to save bandwidth
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            console.log('Preloading disabled on mobile devices');
            return;
        }

        // Cache for loaded images
        const imageCache = new Map();

        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, falling back to immediate image loading');
            loadAllImagesImmediately();
            return;
        }

        // Options for the IntersectionObserver
        const observerOptions = {
            root: null, // viewport
            rootMargin: '1000px', // load images 1000px before they enter the viewport
            threshold: 0.01, // trigger when at least 1% of the element is visible
        };

        // Helper function to determine which image size to load based on viewport AND pixel ratio
        function getAppropriateImageUrl(href, srcset) {
            if (!srcset) return href;

            const viewportWidth = window.innerWidth;
            const dpr = window.devicePixelRatio || 1;
            const effectiveWidth = viewportWidth * dpr;

            // Parse srcset to get available sizes
            const sources = srcset
                .split(',')
                .map(s => {
                    const parts = s.trim().split(' ');
                    return { url: parts[0], width: parseInt(parts[1]) };
                })
                .sort((a, b) => a.width - b.width); // Sort by width

            // Find the smallest image that's >= effective width
            const selected = sources.find(s => s.width >= effectiveWidth);

            // If no image is large enough, use the largest available
            return selected ? selected.url : sources[sources.length - 1].url;
        }

        // Callback for the IntersectionObserver
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const aTag = entry.target;
                    const imgUrl = aTag.getAttribute('href');
                    const srcset = aTag.getAttribute('data-srcset');

                    if (!imgUrl) {
                        console.warn('Image link missing href attribute:', aTag);
                        return;
                    }

                    // Get the appropriate image URL for current viewport
                    const imageToLoad = getAppropriateImageUrl(imgUrl, srcset);

                    // If image isn't in cache, load it
                    if (!imageCache.has(imageToLoad)) {
                        loadImage(imageToLoad, imageCache);
                    }

                    // Unobserve since we've loaded it and it's now cached
                    observer.unobserve(aTag);
                }
            });
        };

        // Helper function to load individual image
        function loadImage(imgUrl, cache) {
            const img = new Image();

            img.onload = function () {
                // console.log('Image loaded successfully:', imgUrl);
            };

            img.onerror = function () {
                console.error('Failed to load image:', imgUrl);
            };

            img.src = imgUrl;
            cache.set(imgUrl, img);
        }

        // Fallback function for browsers without IntersectionObserver
        function loadAllImagesImmediately() {
            const imageLinks = document.querySelectorAll('a.glightbox');
            imageLinks.forEach(aTag => {
                const imgUrl = aTag.getAttribute('href');
                const srcset = aTag.getAttribute('data-srcset');
                const imageToLoad = getAppropriateImageUrl(imgUrl, srcset);
                if (imageToLoad) {
                    loadImage(imageToLoad, imageCache);
                }
            });
        }

        // Create the observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all glightbox links
        const imageLinks = document.querySelectorAll('a.glightbox');

        if (imageLinks.length === 0) {
            console.log('No image links found to observe');
            return;
        }

        imageLinks.forEach(aTag => {
            observer.observe(aTag);
        });

        console.log(`Observing ${imageLinks.length} image links for lazy loading`);
    } catch (error) {
        console.error('Error initializing lazy loading:', error);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    try {
        // Track which pages we've already prefetched
        const prefetchedUrls = new Set();

        // Helper function to prefetch a page
        function prefetchPage(url) {
            // Skip if already prefetched
            if (prefetchedUrls.has(url)) {
                return;
            }

            // Mark as prefetched
            prefetchedUrls.add(url);

            // Create prefetch link element
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.as = 'document';

            // Optional: Add event listeners to track success/failure
            link.onload = () => {
                console.log('Prefetched:', url);
            };

            link.onerror = () => {
                console.warn('Failed to prefetch:', url);
                // Remove from set so we can retry if needed
                prefetchedUrls.delete(url);
            };

            // Add to document head
            document.head.appendChild(link);
        }

        // Find all internal HTML links (excluding disabled ones)
        const htmlLinks = document.querySelectorAll('a[href$=".html"]:not(.disabled)');

        if (htmlLinks.length === 0) {
            console.log('No HTML links found to prefetch');
            return;
        }

        // Add hover listeners to all links
        htmlLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Skip external links, anchors, and disabled links
            if (!href || href.startsWith('http') || href.startsWith('#')) {
                return;
            }

            // Prefetch on hover (mouseenter is better than mouseover)
            link.addEventListener(
                'mouseenter',
                () => {
                    console.log(`Prefetched: ${link.getAttribute('href')}`);
                    prefetchPage(href);
                },
                { once: true }
            ); // 'once: true' removes listener after first trigger
        });

        console.log(`Hover prefetch enabled for ${htmlLinks.length} links`);

        // Optional: Expose helper for debugging
        window.isPrefetched = function (url) {
            return prefetchedUrls.has(url);
        };

        window.getPrefetchedUrls = function () {
            return Array.from(prefetchedUrls);
        };
    } catch (error) {
        console.error('Error initializing page prefetch:', error);
    }
});

// Enhanced link clicking with cached content feedback
document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href$=".html"]:not(.disabled)');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    // If we have cached HTML and CSS, the page should load very fast
    if (window.isHtmlCached && window.isHtmlCached(href)) {
        console.log('Fast load: Content preloaded for', href);
        // Optional: Add visual feedback
        link.style.opacity = '0.7';
        setTimeout(() => (link.style.opacity = '1'), 100);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const versionDisplay = document.querySelector('.version-display');
    const versionNumber = document.getElementById('version-number');

    if (versionDisplay && versionNumber) {
        const version = versionDisplay.getAttribute('data-version') || '0';
        versionNumber.textContent = version.toString().slice(-6); // Last 6 digits
    }
});

async function includeSolverComponent() {
    try {
        const solverInserts = document.querySelectorAll('.solver-insert');

        if (solverInserts.length === 0) {
            // console.log('No solver components found to load');
            return;
        }

        const event_names = [];
        const loadPromises = [];

        // Use Promise.allSettled to handle partial failures gracefully
        for (const insert of solverInserts) {
            if (!insert.dataset.solverHtmlPath) {
                console.warn('Solver insert missing solverHtmlPath data attribute:', insert);
                continue;
            }

            const loadPromise = loadSolverComponent(insert);
            loadPromises.push(loadPromise);
        }

        const results = await Promise.allSettled(loadPromises);

        // Collect event names from successful loads
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                event_names.push(result.value);
            } else if (result.status === 'rejected') {
                console.error(`Solver component ${index} failed to load:`, result.reason);
            }
        });

        // Dispatch events for successfully loaded components
        for (const eventName of event_names) {
            try {
                document.dispatchEvent(new CustomEvent(eventName));
                console.log(`Dispatched event: ${eventName}`);
            } catch (error) {
                console.error(`Error dispatching event ${eventName}:`, error);
            }
        }

        console.log(`Loaded ${event_names.length} solver components successfully`);
    } catch (error) {
        console.error('Error in includeSolverComponent:', error);
    }
}

async function loadSolverComponent(insert) {
    try {
        const response = await fetch(insert.dataset.solverHtmlPath);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        if (!html.trim()) {
            throw new Error('Empty response received');
        }

        insert.innerHTML = html;

        // Extract event name from path
        return insert.dataset.solverHtmlPath
            .split('/')
            .pop()
            .replace(/\.html$/, '');
    } catch (error) {
        console.error(`Error loading solver component at ${insert.dataset.solverHtmlPath}:`, error);
        insert.innerHTML = `<p class="error" style="color: red; padding: 10px; border: 1px solid red; background: rgba(255,0,0,0.1);">
            Failed to load solver component: ${error.message}
        </p>`;
        return null;
    }
}

/*
=======================================
MAIN INITIALIZATION
=======================================
 */
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Initialize core utilities with error handling
        const initializationSteps = [
            { name: 'Scroll Manager', fn: () => window.ScrollManager?.initHistoryManagement() },
            {
                name: 'Scroll Manager Clear',
                fn: () => window.ScrollManager?.clearHashAndScrollTop(),
            },
            { name: 'Mobile Detection', fn: () => window.MobileDetection?.updateMobileText() },
            { name: 'Scroll Anchors', fn: () => window.ScrollManager?.scrollToAnchors() },
            { name: 'Tutorial System', fn: () => window.TutorialSystem?.tutorialPopupInit() },
            { name: 'Solver Buttons', fn: () => window.LinkProcessor?.setupSolverButtons() },
            { name: 'Quick Links', fn: () => window.QuickLinks?.initializeQuickLinks() },
            { name: 'Lightbox Container', fn: () => window.Lightbox?.addLightboxContainer() },
            { name: 'Lightbox Class', fn: () => window.Lightbox?.addLightboxClass() },
            { name: 'Lightbox Init', fn: () => window.Lightbox?.initLightbox() },
            { name: 'Solver Components', fn: includeSolverComponent },
        ];

        // Execute initialization steps with error handling
        for (const step of initializationSteps) {
            try {
                if (typeof step.fn === 'function') {
                    step.fn();
                } else {
                    console.warn(`${step.name} function not available`);
                }
            } catch (error) {
                console.error(`Error initializing ${step.name}:`, error);
            }
        }
    } catch (error) {
        console.error('Critical error during website initialization:', error);
    }
});
