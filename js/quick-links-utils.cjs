/**
 * Shared utilities for quick links generation
 * CommonJS version for Node.js build scripts
 */

/**
 * Checks if an element should be excluded from quick links
 * @param {Element} element - DOM element to check
 * @returns {boolean} - true if element should be excluded
 */
function shouldExcludeElement(element) {
    // Check if the element itself or any of its ancestors is a solver-container
    let current = element;
    while (current) {
        if (current.classList && (current.classList.contains('solver-container') || current.classList.contains('stats') || current.classList.contains('weapon-desc') || current.classList.contains('warning') || current.classList.contains('solver-output') || current.classList.contains('solver-symbol-select') || current.classList.contains('aligned-buttons') || current.classList.contains('aligned-label'))) {
            return true;
        }
        current = current.parentElement;
    }

    return element.dataset && element.dataset.boolQuickLink === 'false';
}

/**
 * Gets the title text from an element
 * @param {Element} element - DOM element to get title from
 * @returns {string} - element title text
 */
function getElementTitle(element) {
    // If there's a custom title specified, use that
    if (element.dataset.customTitle) {
        return element.dataset.customTitle;
    }

    if (element.children.length !== 0) {
        // Use textContent for Node.js compatibility, innerText for browser
        return element.children[0].textContent || element.children[0].innerText;
    } else {
        return element.textContent;
    }
}

/**
 * Gets all elements that should be included in quick links
 * @param {Document} document - DOM document to search
 * @returns {Array} - array of element data objects
 */
function getQuickLinkElements(document) {
    const results = [];

    // Get all div.content-container elements
    const containers = document.querySelectorAll('div.content-container');

    for (const container of containers) {
        if (shouldExcludeElement(container)) continue;

        results.push({
            element: container,
            indentLevel: 0,
            isSectionHeader: container.dataset.sectionInd !== undefined,
            sectionHeaderLevel: container.dataset.sectionHeaderLevel !== undefined ? container.dataset.sectionHeaderLevel : 0,
        });

        const titles = container.querySelectorAll('p.step-group-title, p.upgrade-title, p.sub-sub-step');

        for (const [title_counter, title] of titles.entries()) {
            if (shouldExcludeElement(title)) continue;

            let indentLevel = 1;
            if (title.classList.contains('sub-sub-step') && title_counter !== 0) {
                indentLevel = 2;
            }
            if (title.dataset.customIndent) {
                indentLevel = Number(title.dataset.customIndent);
            }

            if (title.dataset.customQuickLink) {
                const customLinks = title.dataset.customQuickLink.split(';');
                title.id = customLinks[0];
                for (const customName of customLinks) {
                    results.push({
                        element: title,
                        indentLevel,
                        custom_name: customName,
                    });
                }
            } else {
                results.push({
                    element: title,
                    indentLevel,
                });
            }
        }
    }

    return results;
}

/**
 * Generates HTML string for navigation links
 * @param {Array} elements - array of element data objects
 * @param {boolean} isHamburgerMenu - whether this is for hamburger menu (removes sub-header class)
 * @returns {string} - HTML string for navigation
 */
function generateNavHTML(elements, isHamburgerMenu = false) {
    if (!elements || elements.length === 0) return '';

    let html = '';
    let currentIndentLevel = 0;
    let listStack = [];

    for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        const { element, indentLevel, isSectionHeader, sectionHeaderLevel } = item;

        if (!element || indentLevel === undefined) continue;

        if (isSectionHeader) {
            // Close any open lists
            while (listStack.length > 0) {
                html += '</ul>';
                listStack.pop();
            }

            if (sectionHeaderLevel === 0) {
                html += `<h2>${element.dataset.sectionInd}</h2>`;
            } else {
                const subHeaderClass = isHamburgerMenu ? '' : ' class="sub-header"';
                html += `<h4${subHeaderClass}>${element.dataset.sectionInd}</h4>`;
            }

            html += '<ul>';
            listStack = [true];
            currentIndentLevel = 0;
        }

        if (listStack.length === 0) {
            html += '<ul>';
            listStack = [true];
            currentIndentLevel = 0;
        }

        const elementId = element.id;
        if (elementId === '') {
            console.log(`Element Quick Link with text **${element.textContent}** skipped, no ID given`);
            continue;
        }

        const linkText = item.custom_name || getElementTitle(element);

        // Handle nesting
        if (indentLevel > currentIndentLevel) {
            while (currentIndentLevel < indentLevel) {
                html += '<ul>';
                listStack.push(true);
                currentIndentLevel++;
            }
        } else if (indentLevel < currentIndentLevel) {
            while (listStack.length > 1 && currentIndentLevel > indentLevel) {
                html += '</ul>';
                listStack.pop();
                currentIndentLevel--;
            }
        }

        html += `<li><a href="#${elementId}">${linkText}</a></li>`;
    }

    // Close remaining lists
    while (listStack.length > 0) {
        html += '</ul>';
        listStack.pop();
    }

    return html;
}

// CommonJS exports
module.exports = {
    getQuickLinkElements,
    generateNavHTML,
};
