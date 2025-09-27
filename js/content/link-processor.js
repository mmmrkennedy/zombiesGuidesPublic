/**
 * Link processing utilities
 * Handles link validation, classification, and styling
 */

/**
 * Initializes incomplete path detection for anchor tags
 * Adds CSS classes to links with incomplete or wrong file types
 */
function incompleteATagInit() {
    const allATags = document.querySelectorAll('a');

    allATags.forEach(function (tag) {
        const hrefValue = tag.getAttribute('href');

        // Skip if hrefValue starts with # (anchor link) or http/https (absolute URL).
        if (hrefValue.startsWith('#') || hrefValue.startsWith('http://') || hrefValue.startsWith('https://')) {
            return;
        }

        if (hrefValue.endsWith("/")) {
            tag.classList.add('incomplete-path');
            return;
        }

        if (!(hrefValue.includes(".webp") || hrefValue.includes(".html") || hrefValue.includes(".webm") || hrefValue.includes(".gif"))) {
            tag.classList.add('wrong_file_type');
        }
    });
}

/**
 * Color codes anchor tags based on their destination
 * Adds CSS classes for different link types (internal, external, etc.)
 */
function colourCodeAnchors() {
    try {
        // Select all <a> tags in the document that are not inside .content-container-top
        const links = document.querySelectorAll("a:not(.content-container-top a)");

        // Loop through each <a> tag
        links.forEach(function (link) {
            let link_href = link.getAttribute("href");

            // Skip if href is null or empty
            if (!link_href) return;

            // Add class for internal page links (anchor links)
            if (link_href.includes("#")) {
                link.classList.add("link-to-page");
            }

            // Add class for external links (YouTube, Discord, other external sites)
            if (link_href.includes("youtu.be") ||
                link_href.includes("youtube") ||
                link_href.includes("discord.com") ||
                link_href.includes("http://") ||
                link_href.includes("https://") ||
                (link_href.includes(".com") && !link_href.startsWith("/"))) {
                link.classList.add("youtube-link");
            }
        });

    } catch (e) {
        console.log(e);
    }
}

/**
 * Sets up solver button functionality
 * Handles toggle behavior for solver containers
 */
function setupSolverButtons() {
    const solver_button_divs = document.getElementsByClassName('solver-with-button');

    if (!solver_button_divs) return;

    for (const solver_button_div of solver_button_divs) {
        const toggle_button = solver_button_div.querySelector('.square-button');
        const nested_container = solver_button_div.querySelector('div');

        if (!toggle_button || !nested_container) continue;

        toggle_button.addEventListener('click', () => {
            toggle_button.classList.toggle('active');
            nested_container.style.display = toggle_button.classList.contains('active') ? 'block' : 'none';
        });
    }
}

// Make functions available globally
window.LinkProcessor = {
    incompleteATagInit,
    colourCodeAnchors,
    setupSolverButtons
};