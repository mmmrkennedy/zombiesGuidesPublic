/**
 * Tutorial system for first-time users
 * Handles tutorial popup, navigation, and progress tracking
 */

/**
 * Adds the tutorial box HTML to the page
 */
function addTutorialBox() {
    const contentWindowDiv = document.querySelector("div.content-window");

    if (!contentWindowDiv) {
        console.error("contentWindowDiv is missing, unable to generate Tutorial Box");
        return false;
    }

    const tutorialHTML = `
    <div class="tutorial-overlay" id="tutorialOverlay">
            <div class="tutorial-popup">
                <div class="tutorial-confirm" id="tutorialConfirm">
                    <p>Are you sure you want to skip the tutorial?</p>
                    <div class="tutorial-confirm-btns">
                        <button id="confirmYesBtn" class="btn btn--danger">Yes, skip</button>
                        <button id="confirmNoBtn" class="btn">Cancel</button>
                    </div>
                </div>

                <div class="tutorial-header">
                    <h2 id="tutorialTitle">Welcome to Zombies Easter Egg Guides!</h2>
                    <button id="exitBtn" class="tutorial-exit-btn" aria-label="Close tutorial">&times;</button>
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
                        <p>Links in <a class="external-link" href="https://youtube.com" target="_blank">Green (YouTube)</a> lead to other websites, like YouTube or Reddit.</p>
                        <p>We try to make it clear where each link goes before you click it.</p>
                    </div>
                    
                    <!-- Page 5 -->
                    <div class="tutorial-page" data-page="5">
                        <p>If you ever need to jump to the top of a guide, just use the "Back to Top" button.</p>
                        <p>Also, the guides are open to anyone who wishes to contribute. Join the <a class="external-link" href="https://discord.com/invite/hQng3Yz48A" target="_blank">Discord Server</a> to start helping out.</p>
                        <p>Thanks for checking out the Website!</p>
                    </div>
                </div>
                
                <div class="tutorial-navigation">
                    <button id="prevPageBtn" class="btn" disabled>Previous</button>
                    <button id="nextPageBtn" class="btn">Next</button>
                    <button id="finishBtn" class="btn btn--accent" style="display: none;">Finish</button>
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
    contentWindowDiv.insertAdjacentHTML("beforebegin", tutorialHTML);
    return true;
}

/**
 * Checks if current page is the index page
 */
function isIndexPage() {
    // Check multiple ways to determine if we're on index
    const path = window.location.pathname;

    // Common index page patterns
    return path === "/" || path === "/index.html" || path === "/index.htm" || path.endsWith("/") || path === "";
}

/**
 * Initializes tutorial popup for first-time users
 */
function tutorialPopupInit() {
    // Only run on index page
    if (!isIndexPage()) {
        console.warn("Not on index page, skipping tutorial");
        return;
    }

    // Check if tutorial has been shown before
    if (!localStorage.getItem("zombiesGuidesTutorialShown")) {
        const tutorialAdded = addTutorialBox();
        if (!tutorialAdded) {
            console.warn("Tutorial box could not be added, skipping tutorial");
            return;
        }

        initTutorial();

        // Load tutorial with slight delay for better UX
        setTimeout(() => {
            showTutorial();
        }, 800);
    } else {
        // Hide tutorial for returning users
        const tutorialOverlay = document.getElementById("tutorialOverlay");

        if (tutorialOverlay) {
            tutorialOverlay.style.display = "none";
        }
    }
}

let currentPage = 1;

/**
 * Initializes tutorial event listeners and shows first page
 */
function initTutorial() {
    const tutorialOverlay = document.getElementById("tutorialOverlay");
    if (tutorialOverlay) {
        tutorialOverlay.style.display = "flex";
    }

    // Set up event listeners
    document.getElementById("prevPageBtn").addEventListener("click", navigatePrevPage);
    document.getElementById("nextPageBtn").addEventListener("click", navigateNextPage);
    document.getElementById("finishBtn").addEventListener("click", finishTutorial);
    document.getElementById("exitBtn").addEventListener("click", exitTutorial);
    document.getElementById("confirmYesBtn").addEventListener("click", finishTutorial);
    document.getElementById("confirmNoBtn").addEventListener("click", hideConfirm);
    tutorialOverlay.addEventListener("click", (e) => {
        if (e.target === tutorialOverlay) exitTutorial();
    });

    // Show first page
    showPage(1);
}

/**
 * Shows the tutorial overlay
 */
function showTutorial() {
    const overlay = document.getElementById("tutorialOverlay");
    if (overlay) {
        overlay.style.display = "flex";
    }
}

/**
 * Shows a specific tutorial page
 */
function showPage(pageNum) {
    const pages = document.querySelectorAll(".tutorial-page");
    const totalPages = pages.length;
    const prevBtn = document.getElementById("prevPageBtn");
    const nextBtn = document.getElementById("nextPageBtn");
    const finishBtn = document.getElementById("finishBtn");

    currentPage = pageNum;

    // Hide all pages
    pages.forEach((page) => {
        page.classList.remove("active");
    });

    // Show the selected page
    const targetPage = document.querySelector(`.tutorial-page[data-page="${pageNum}"]`);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    // Update button states
    prevBtn.disabled = pageNum === 1;

    // Handle last page differently
    if (pageNum === totalPages) {
        nextBtn.style.display = "none";
        finishBtn.style.display = "block";
    } else {
        nextBtn.style.display = "block";
        finishBtn.style.display = "none";
    }

    // Update progress bar
    updateProgressBar(pageNum, totalPages);
}

/**
 * Navigates to the next tutorial page
 */
function navigateNextPage() {
    showPage(currentPage + 1);
}

/**
 * Navigates to the previous tutorial page
 */
function navigatePrevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

/**
 * Shows the confirm overlay — used by the exit button and overlay click
 */
function exitTutorial() {
    document.getElementById("tutorialConfirm").classList.add("active");
}

/**
 * Hides the confirm overlay
 */
function hideConfirm() {
    document.getElementById("tutorialConfirm").classList.remove("active");
}

/**
 * Finishes the tutorial and marks it as shown
 */
function finishTutorial() {
    const overlay = document.getElementById("tutorialOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
    localStorage.setItem("zombiesGuidesTutorialShown", "true");
}

/**
 * Updates the tutorial progress bar
 */
function updateProgressBar(currentPage, totalPages) {
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    if (progressFill && progressText) {
        const progressPercentage = (currentPage / totalPages) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

/**
 * Resets tutorial (for debugging/testing)
 * Run window.TutorialSystem.resetTutorial() in browser console to call
 */
function resetTutorial() {
    // console.log("Manually Reset Tutorial...");
    localStorage.removeItem("zombiesGuidesTutorialShown");
    window.location.reload();
}

// Make functions available globally
window.TutorialSystem = {
    addTutorialBox,
    isIndexPage,
    tutorialPopupInit,
    initTutorial,
    showTutorial,
    showPage,
    navigateNextPage,
    navigatePrevPage,
    exitTutorial,
    finishTutorial,
    updateProgressBar,
    resetTutorial,
};
