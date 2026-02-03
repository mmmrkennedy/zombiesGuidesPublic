/**
 * Tutorial system for first-time users
 * Handles tutorial popup, navigation, and progress tracking
 */

/**
 * Checks if tutorial CSS is loaded by looking for the stylesheet
 */
function isTutorialCSSLoaded() {
    // Check for link element with tutorial CSS
    const linkElement = document.querySelector('link[href*="tutorial_box.css"]');
    if (linkElement) {
        return true;
    }

    // Alternative check - look through all stylesheets
    for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        if (sheet.href && sheet.href.includes('tutorial_box.css')) {
            return true;
        }
    }

    return false;
}

/**
 * Adds the tutorial box HTML to the page
 */
function addTutorialBox() {
    const contentWindowDiv = document.querySelector('div.content-window');

    if (!contentWindowDiv) {
        console.log('contentWindowDiv is missing, unable to generate Tutorial Box');
        return false;
    }

    // Check if CSS is loaded before adding HTML
    if (!isTutorialCSSLoaded()) {
        console.warn('Tutorial CSS not loaded, skipping tutorial box creation');
        return false;
    }

    const tutorialHTML = `
    <div class="tutorial-overlay" id="tutorialOverlay">
            <div class="tutorial-popup">
                <div class="tutorial-header">
                    <h2 id="tutorialTitle">Welcome to Zombies Easter Egg Guides!</h2>
                    <div class="tutorial-page-indicator">
                        <span id="currentPage">1</span>/<span id="totalPages">4</span>
                    </div>
                </div>

                <!-- Tutorial Pages Container -->
                <div class="tutorial-pages-container">
                    <!-- Page 1 -->
                    <div class="tutorial-page" data-page="1">
                        <p>Welcome. Since it's your first time here, here's a quick walkthrough.</p>
                        <p>Our guides offer step-by-step instructions for completing Easter Eggs in various Call of Duty Zombies games.</p>
                    </div>

                    <!-- Page 2 -->
                    <div class="tutorial-page" data-page="2">
                        <a href="/games/IW/zombies_in_spaceland/pictures/main_ee/alien_example.webp" style="display: none;" data-caption="Example Image 1">Arrow Keyed IMG 1</a>
                        <p>Inside any guide, text shown in <a href="/dog_tut_example.webp" data-width="75%" data-height="75%" data-caption="Example Image 2">blue</a> is a clickable image link, except the links at the top of the page.</p>
                        <p>Clicking opens the image in an on-screen viewer. You can close it by clicking outside the image or hitting the X. Use the left/right arrow keys to move between images.</p>
                        <a href="/games/BO4/alpha_omega/pictures/ray_gun_mark_2/frame/frames_panel.webp" style="display: none;" data-caption="Example Image 3">Arrow Keyed IMG 2</a>
                    </div>

                    <!-- Page 3 -->
                    <div class="tutorial-page" data-page="3">
                        <p>Links in <a class="link-to-page" href="#">Light Blue</a> will take you to another part of the same page or to a different page on this site.</p>
                        <p>You can always use your browser's back button to return to where you were.</p>
                    </div>

                    <!-- Page 4 -->
                    <div class="tutorial-page" data-page="4">
                        <p>Links in <a class="external-link" href="https://youtube.com">Green (YouTube)</a> lead to other websites, like YouTube or Reddit.</p>
                        <p>We try to make it clear where each link goes before you click it.</p>
                    </div>

                    <!-- Page 5 -->
                    <div class="tutorial-page" data-page="5">
                        <p>Ads on this site are <strong>togglable</strong> via the switch in the top right.</p>
                        <p>They are placed as unobtrusively as possible to keep the quality of the site high.</p>
                        <p>If you find the guides helpful, leaving them on is a great way to support the site.</p>
                    </div>
                    
                    <!-- Page 6 -->
                    <div class="tutorial-page" data-page="6">
                        <p>If you ever need to jump to the top of a guide, just use the "Back to Top" button.</p>
                        <p>Also, the guides are open to anyone who wishes to contribute. Join the <a class="external-link" href="https://discord.com/invite/hQng3Yz48A">Discord Server</a> to start helping out.</p>
                        <p>Thanks for checking out the Website!</p>
                    </div>
                </div>
                
                <div class="tutorial-navigation">
                    <button id="prevPageBtn" class="tutorial-nav-btn" disabled>Previous</button>
                    <button id="nextPageBtn" class="tutorial-nav-btn">Next</button>
                    <button id="finishBtn" class="tutorial-nav-btn finish-btn" style="display: none;">Finish</button>
                </div>
                
                <div class="tutorial-progress-container">
                    <div class="tutorial-progress-bar">
                        <div class="tutorial-progress-fill" id="progressFill"></div>
                    </div>
                    <div class="tutorial-progress-text" id="progressText">Loading tutorial... 0%</div>
                </div>
            </div>
        </div>
    `;
    contentWindowDiv.insertAdjacentHTML('beforebegin', tutorialHTML);
    return true;
}

/**
 * Checks if current page is the index page
 */
function isIndexPage() {
    // Check multiple ways to determine if we're on index
    const path = window.location.pathname;

    // Common index page patterns
    return path === '/' || path === '/index.html' || path === '/index.htm' || path.endsWith('/') || path === '';
}

/**
 * Initializes tutorial popup for first-time users
 */
function tutorialPopupInit() {
    // Only run on index page
    if (!isIndexPage()) {
        console.log('Not on index page, skipping tutorial');
        return;
    }

    // Check if tutorial has been shown before
    if (!localStorage.getItem('zombiesGuidesTutorialShown')) {
        // Check if CSS is loaded before proceeding
        if (!isTutorialCSSLoaded()) {
            console.warn('Tutorial CSS not loaded, tutorial will not be shown');
            return;
        }

        const tutorialAdded = addTutorialBox();
        if (!tutorialAdded) {
            console.warn('Tutorial box could not be added, skipping tutorial');
            return;
        }

        initTutorial();

        // Load tutorial with slight delay for better UX
        setTimeout(() => {
            showTutorial();
        }, 800);
    } else {
        // Hide tutorial for returning users
        const tutorialOverlay = document.getElementById('tutorialOverlay');

        if (tutorialOverlay) {
            tutorialOverlay.style.display = 'none';
        }
    }
}

/**
 * Initializes tutorial event listeners and shows first page
 */
function initTutorial() {
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    if (tutorialOverlay) {
        tutorialOverlay.style.display = 'flex';
    }

    // Initialize variables
    document.getElementById('totalPages').textContent = String(document.querySelectorAll('.tutorial-page').length);

    // Set up event listeners
    document.getElementById('prevPageBtn').addEventListener('click', navigatePrevPage);
    document.getElementById('nextPageBtn').addEventListener('click', navigateNextPage);
    document.getElementById('finishBtn').addEventListener('click', finishTutorial);

    // Show first page
    showPage(1);
}

/**
 * Shows the tutorial overlay
 */
function showTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

/**
 * Shows a specific tutorial page
 */
function showPage(pageNum) {
    const pages = document.querySelectorAll('.tutorial-page');
    const totalPages = pages.length;
    const currentPageElement = document.getElementById('currentPage');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const finishBtn = document.getElementById('finishBtn');

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    const targetPage = document.querySelector(`.tutorial-page[data-page="${pageNum}"]`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update page counter
    currentPageElement.textContent = pageNum;

    // Update button states
    prevBtn.disabled = pageNum === 1;

    // Handle last page differently
    if (pageNum === totalPages) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
    }

    // Update progress bar
    updateProgressBar(pageNum, totalPages);
}

/**
 * Navigates to the next tutorial page
 */
function navigateNextPage() {
    const currentPage = parseInt(document.getElementById('currentPage').textContent);
    showPage(currentPage + 1);
}

/**
 * Navigates to the previous tutorial page
 */
function navigatePrevPage() {
    const currentPage = parseInt(document.getElementById('currentPage').textContent);

    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

/**
 * Finishes the tutorial and marks it as shown
 */
function finishTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    localStorage.setItem('zombiesGuidesTutorialShown', 'true');
}

/**
 * Updates the tutorial progress bar
 */
function updateProgressBar(currentPage, totalPages) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill && progressText) {
        const progressPercentage = (currentPage / totalPages) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

/**
 * Resets tutorial (for debugging/testing)
 */
function resetTutorial() {
    console.log('Manually Reset Tutorial...');
    localStorage.removeItem('zombiesGuidesTutorialShown');
}

// Make functions available globally
window.TutorialSystem = {
    addTutorialBox,
    isTutorialCSSLoaded,
    isIndexPage,
    tutorialPopupInit,
    initTutorial,
    showTutorial,
    showPage,
    navigateNextPage,
    navigatePrevPage,
    finishTutorial,
    updateProgressBar,
    resetTutorial,
};
