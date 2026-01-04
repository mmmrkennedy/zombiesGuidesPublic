/**
 * Lightbox system for images and videos
 * Handles media display, navigation, and keyboard controls
 */

// Store all lightbox triggers for navigation
let allTriggers = [];
let currentIndex = -1;

/**
 * Adds lightbox class to media links
 */
function addLightboxClass() {
    // Get all anchor tags on the page
    const anchorTags = document.querySelectorAll('a');

    anchorTags.forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (!href) return;

        // Check if the link ends with a media file extension
        const mediaExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.webm', '.mp4', '.mov'];
        const endsWithMediaExt = mediaExtensions.some(ext => href.toLowerCase().endsWith(ext));

        // Add the class if it's a media link
        if (endsWithMediaExt) {
            anchor.classList.add('lightbox-trigger');

            // Store the media type as a data attribute
            const isVideo = ['.webm', '.mp4', '.mov'].some(ext => href.toLowerCase().endsWith(ext));
            anchor.dataset.mediaType = isVideo ? 'video' : 'image';
        }
    });
}

/**
 * Adds lightbox container HTML to the page
 */
function addLightboxContainer() {
    const body = document.querySelector('body');

    if (body) {
        const lightboxHTML = `
    <div id="lightbox" class="lightbox">
        <span class="close-lightbox">&times;</span>
        <div class="lightbox-content">
            <div class="lightbox-caption"></div>
            <img id="lightbox-img" src="" alt="Enlarged image">
            <video id="lightbox-video" controls loop style="display: none; max-height: 80vh; object-fit: contain;">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
    `;
        body.insertAdjacentHTML('beforeend', lightboxHTML);

        // console.log('Lightbox container added successfully');
    } else {
        console.log('No body element found');
    }
}

/**
 * Preloads adjacent media for faster navigation
 * @param {number} currentIndex - Index of the current media item
 */
function preloadAdjacentMedia(currentIndex) {
    if (!allTriggers.length) return;

    // Preload previous image
    if (currentIndex > 0) {
        const prevTrigger = allTriggers[currentIndex - 1];
        if (prevTrigger.dataset.mediaType === 'image') {
            new Image().src = prevTrigger.href;
        }
    }

    // Preload next image
    if (currentIndex < allTriggers.length - 1) {
        const nextTrigger = allTriggers[currentIndex + 1];
        if (nextTrigger.dataset.mediaType === 'image') {
            new Image().src = nextTrigger.href;
        }
    }
}

/**
 * Opens the lightbox with the specified media source
 * @param {string} mediaSrc - Source URL of the media
 * @param {string} captionText - Text to display as caption
 * @param {number} index - Index of the current media item
 * @param {string} mediaType - Type of media ('image' or 'video')
 */
function openLightbox(mediaSrc, captionText, index, mediaType) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    if (!lightbox || !lightboxImg || !lightboxVideo || !lightboxCaption) return;

    // Update current index
    currentIndex = index;

    // Show a loading state
    lightbox.style.display = 'flex';
    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = 'none';
    lightboxCaption.textContent = 'Loading...';

    if (mediaType === 'image') {
        // Handle image content
        const img = new Image();
        img.src = mediaSrc;
        img.onload = function () {
            // Set the source and display the image
            lightboxImg.setAttribute('src', mediaSrc);
            lightboxImg.style.display = 'block';
            lightboxCaption.textContent = captionText;

            // Preload adjacent media
            preloadAdjacentMedia(currentIndex);
        };

        img.onerror = function () {
            // Handle error case
            lightboxCaption.textContent = 'Error loading image';
            lightboxImg.style.display = 'none';
        };
    } else if (mediaType === 'video') {
        // Handle video content
        lightboxVideo.setAttribute('src', mediaSrc);
        lightboxVideo.style.display = 'block';
        lightboxCaption.textContent = captionText;

        // Set up event listeners for video loading
        lightboxVideo.onloadeddata = function () {
            // Video is loaded and can be played
            lightboxCaption.textContent = captionText;
        };

        lightboxVideo.onerror = function () {
            // Handle error case
            lightboxCaption.textContent = 'Error loading video';
            lightboxVideo.style.display = 'none';
        };

        // Start playing the video
        lightboxVideo.play().catch(e => {
            console.log('Auto-play prevented:', e);
            // This is expected on many browsers due to autoplay policies
        });
    }
}

/**
 * Navigates to the previous media item
 */
function navigateToPrevious() {
    if (currentIndex > 0) {
        const prevTrigger = allTriggers[currentIndex - 1];
        const mediaSrc = prevTrigger.href;
        let captionText = prevTrigger.dataset.caption || prevTrigger.textContent || 'Media';
        captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
        const mediaType = prevTrigger.dataset.mediaType;
        openLightbox(mediaSrc, captionText, currentIndex - 1, mediaType);
    }
}

/**
 * Navigates to the next media item
 */
function navigateToNext() {
    if (currentIndex < allTriggers.length - 1) {
        const nextTrigger = allTriggers[currentIndex + 1];
        const mediaSrc = nextTrigger.href;
        let captionText = nextTrigger.dataset.caption || nextTrigger.textContent || 'Media';
        captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
        const mediaType = nextTrigger.dataset.mediaType;
        openLightbox(mediaSrc, captionText, currentIndex + 1, mediaType);
    }
}

/**
 * Closes the lightbox and stops any playing videos
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');

    if (lightbox) {
        lightbox.style.display = 'none';
    }

    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }

    // Reset current index
    currentIndex = -1;
}

/**
 * Handles lightbox trigger click events
 */
function handleLightboxClick() {
    const mediaSrc = this.href;
    let captionText = this.dataset.caption || this.textContent || 'Media';
    captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1);
    const mediaType = this.dataset.mediaType;
    const index = allTriggers.indexOf(this);
    openLightbox(mediaSrc, captionText, index, mediaType);
}

/**
 * Initializes the lightbox by setting up event listeners
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close-lightbox');

    if (!lightbox || !closeBtn) {
        console.log('Lightbox elements not found');
        return;
    }

    // Get all lightbox triggers and store them
    allTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));

    // Add click event listeners to all lightbox triggers
    allTriggers.forEach(trigger => {
        trigger.addEventListener('click', function (event) {
            event.preventDefault();
            handleLightboxClick.call(this);
        });
    });

    // Add close button event listener
    closeBtn.addEventListener('click', closeLightbox);

    // Add lightbox background click listener
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Add keyboard event listeners
    document.addEventListener('keydown', event => {
        if (lightbox.style.display === 'flex') {
            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                navigateToPrevious();
            } else if (event.key === 'ArrowRight') {
                navigateToNext();
            }
        }
    });
}

// Make functions available globally
window.Lightbox = {
    addLightboxClass,
    addLightboxContainer,
    preloadAdjacentMedia,
    openLightbox,
    navigateToPrevious,
    navigateToNext,
    closeLightbox,
    handleLightboxClick,
    initLightbox,
};
