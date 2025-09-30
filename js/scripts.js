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

function closeHamburgerMenu() {
    const overlay = document.getElementById('hamburgerMenuOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

function setupHamburgerMenuLinks() {
    // This function will be called after quick links are generated
    // Add click handlers to all links to close the menu
    const hamburgerMenuLinks = document.getElementById('hamburgerMenuLinks');
    const overlay = document.getElementById('hamburgerMenuOverlay');
    
    if (!hamburgerMenuLinks || !overlay) {
        return;
    }
    
    // Add click handlers to all links to close the menu
    const allLinks = hamburgerMenuLinks.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('click', closeHamburgerMenu);
    });
    
    // Add click-outside-to-close functionality
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeHamburgerMenu();
        }
    });
}

/*
=======================================
LAZY LOAD IMAGES
=======================================
 */
document.addEventListener('DOMContentLoaded', function () {
    try {
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
            threshold: 0.01 // trigger when at least 1% of the element is visible
        };

        // Callback for the IntersectionObserver
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const aTag = entry.target;
                    const imgUrl = aTag.getAttribute('href');

                    if (!imgUrl) {
                        console.warn('Image link missing href attribute:', aTag);
                        return;
                    }

                    // If image isn't in cache, load it
                    if (!imageCache.has(imgUrl)) {
                        loadImage(imgUrl, imageCache);
                    }

                    // Unobserve since we've loaded it and it's now cached
                    observer.unobserve(aTag);
                }
            });
        };

        // Helper function to load individual image
        function loadImage(imgUrl, cache) {
            const img = new Image();
            
            img.onload = function() {
                // console.log('Image loaded successfully:', imgUrl);
            };
            
            img.onerror = function() {
                console.error('Failed to load image:', imgUrl);
            };
            
            img.src = imgUrl;
            cache.set(imgUrl, img);
        }

        // Fallback function for browsers without IntersectionObserver
        function loadAllImagesImmediately() {
            const imageLinks = document.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".gif"], a[href$=".webp"]');
            imageLinks.forEach(aTag => {
                const imgUrl = aTag.getAttribute('href');
                if (imgUrl) {
                    loadImage(imgUrl, imageCache);
                }
            });
        }

        // Create the observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all a tags with href pointing to an image
        const imageLinks = document.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".gif"], a[href$=".webp"]');
        
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
            link.addEventListener('mouseenter', () => {
                prefetchPage(href);
            }, { once: true }); // 'once: true' removes listener after first trigger
        });

        console.log(`Hover prefetch enabled for ${htmlLinks.length} links`);

        // Optional: Expose helper for debugging
        window.isPrefetched = function(url) {
            return prefetchedUrls.has(url);
        };

        window.getPrefetchedUrls = function() {
            return Array.from(prefetchedUrls);
        };

    } catch (error) {
        console.error('Error initializing page prefetch:', error);
    }
});

// Enhanced link clicking with cached content feedback
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href$=".html"]:not(.disabled)');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    // If we have cached HTML and CSS, the page should load very fast
    if (window.isHtmlCached && window.isHtmlCached(href)) {
        console.log('Fast load: Content preloaded for', href);
        // Optional: Add visual feedback
        link.style.opacity = '0.7';
        setTimeout(() => link.style.opacity = '1', 100);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const versionDisplay = document.querySelector('.version-display');
    const versionNumber = document.getElementById('version-number');

    if (versionDisplay && versionNumber) {
        const version = versionDisplay.getAttribute('data-version') || '0';
        versionNumber.textContent = version.toString().slice(-6);  // Last 6 digits
    }
});

async function includeSolverComponent() {
    try {
        const solverInserts = document.querySelectorAll('.solver-insert');
        
        if (solverInserts.length === 0) {
            // console.log('No solver components found to load');
            return;
        }

        let event_names = [];
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
        return insert.dataset.solverHtmlPath.split("/").pop().replace(/\.html$/, '');
        
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
document.addEventListener("DOMContentLoaded", function () {
    try {
        // console.log('Initializing Zombies Guides website...');
        
        // Initialize core utilities with error handling
        const initializationSteps = [
            { name: 'Scroll Manager', fn: () => window.ScrollManager?.initHistoryManagement() },
            { name: 'Feature Utils', fn: () => window.FeatureUtils?.initSubsteps() },
            { name: 'Scroll Manager Clear', fn: () => window.ScrollManager?.clearHashAndScrollTop() },
            { name: 'Mobile Detection', fn: () => window.MobileDetection?.touchScreenInit() },
            { name: 'Media Preloader', fn: () => window.MediaPreloader?.preloadImages() },
            { name: 'Scroll Anchors', fn: () => window.ScrollManager?.scrollToAnchors() },
            { name: 'Tutorial System', fn: () => window.TutorialSystem?.tutorialPopupInit() },
            { name: 'Solver Buttons', fn: () => window.LinkProcessor?.setupSolverButtons() },
            { name: 'Quick Links', fn: () => window.QuickLinks?.initializeQuickLinks() },
            { name: 'Hamburger Menu', fn: setupHamburgerMenuLinks },
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
                    // console.log(`✓ ${step.name} initialized successfully`);
                } else {
                    console.warn(`${step.name} function not available`);
                }
            } catch (error) {
                console.error(`✗ Error initializing ${step.name}:`, error);
                // Continue with other initialization steps even if one fails
            }
        }

        // console.log('Website initialization completed');
        
    } catch (error) {
        console.error('Critical error during website initialization:', error);
    }
});