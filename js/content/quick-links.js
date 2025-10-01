/**
 * Quick links generation and management
 * Handles the creation and rendering of navigation quick links
 */

/**
 * Initializes quick links generation for the current page
 * Creates navigation container and generates quick access links
 */
function initializeQuickLinks() {
    try {
        const page = window.PageUtils.getCurrentPage();

        if (page === "index.html") return;

        // Find the hamburger menu container
        let parentElement = document.getElementById("hamburgerMenuLinks");

        if (!parentElement) {
            console.warn("Hamburger menu container not found");
            return;
        }

        // Exit early if navigation already exists (built at build-time)
        if (parentElement.children.length > 0) {
            console.log("Navigation already pre-built, skipping runtime generation");
            return;
        }

        // Fallback: generate navigation dynamically only if empty
        console.warn("Navigation not pre-built, generating at runtime (fallback)");
        const elementsData = window.QuickLinksUtils.getQuickLinkElements(document);
        generateQuickLinks(parentElement, elementsData);

    } catch (e) {
        console.error("Error initializing quick links:", e);
    }
}

/**
 * Generates quick links DOM elements from element data
 * Creates nested navigation structure with proper indentation
 */
function generateQuickLinks(parentElement, elements) {
    if (!elements || elements.length === 0) return;

    let currentList = null;
    let listStack = [];
    let currentIndentLevel = 0;

    // Create fragment at the beginning
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        const { element, indentLevel, isSectionHeader, sectionHeaderLevel } = item;

        if (!element || indentLevel === undefined) continue;

        if (isSectionHeader) {
            if (sectionHeaderLevel === 0) {
                const sectionHeader = document.createElement("h2");
                sectionHeader.innerText = element.dataset.sectionInd;
                fragment.appendChild(sectionHeader);
            } else {
                const sectionHeader = document.createElement("h4");
                // Don't add sub-header class for hamburger menu
                if (!parentElement.id || parentElement.id !== "hamburgerMenuLinks") {
                    sectionHeader.classList.add("sub-header");
                }
                sectionHeader.innerText = element.dataset.sectionInd;
                fragment.appendChild(sectionHeader);
            }

            currentList = document.createElement("ul");
            fragment.appendChild(currentList);
            listStack = [currentList];
            currentIndentLevel = 0;
        }

        if (!currentList) {
            currentList = document.createElement("ul");
            fragment.appendChild(currentList);
            listStack = [currentList];
            currentIndentLevel = 0;
        }

        // Create list item and link
        const listItem = document.createElement("li");
        const link = document.createElement("a");

        // Get element ID, fallback to previous element's ID if empty
        let elementId = element.id;

        if (elementId === "") {
            console.log(`Element Quick Link (at screen top) with text **${element.innerText}** skipped, no ID given`);
            continue; // Skip if no valid ID
        }

        link.href = `#${elementId}`;

        if (item.custom_name) {
            link.innerText = item.custom_name;
        } else {
            link.innerText = window.QuickLinksUtils.getElementTitle(element);
        }

        listItem.appendChild(link);

        // Handle nesting
        if (indentLevel > currentIndentLevel) {
            // Need to create nested lists to reach the desired indent level
            while (currentIndentLevel < indentLevel) {
                const newList = document.createElement("ul");

                if (listStack[listStack.length - 1].lastElementChild) {
                    listStack[listStack.length - 1].lastElementChild.appendChild(newList);
                } else {
                    // If there's no last element, create a dummy item
                    const dummyItem = document.createElement("li");
                    dummyItem.textContent = "Untitled";
                    listStack[listStack.length - 1].appendChild(dummyItem);
                    dummyItem.appendChild(newList);
                }

                listStack.push(newList);
                currentIndentLevel++;
            }
        } else if (indentLevel < currentIndentLevel) {
            // Go back up the nesting levels
            while (listStack.length > 1 && currentIndentLevel > indentLevel) {
                listStack.pop();
                currentIndentLevel--;
            }
        }

        // Add list item to current list
        if (listStack.length > 0) {
            listStack[listStack.length - 1].appendChild(listItem);
        }
    }

    parentElement.appendChild(fragment);
}

// Make functions available globally
window.QuickLinks = {
    initializeQuickLinks,
    generateQuickLinks
};