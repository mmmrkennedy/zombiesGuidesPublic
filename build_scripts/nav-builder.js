#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class NavBuilder {
    shouldExcludeElement(element) {
        let current = element;
        while (current) {
            if (current.classList &&
                (current.classList.contains('solver-container') ||
                    current.classList.contains('stats') ||
                    current.classList.contains('weapon-desc') ||
                    current.classList.contains('warning') ||
                    current.classList.contains('solver-output') ||
                    current.classList.contains('solver-symbol-select') ||
                    current.classList.contains('aligned-buttons') ||
                    current.classList.contains('aligned-label'))) {
                return true;
            }
            current = current.parentElement;
        }
        return element.dataset && element.dataset.boolQuickLink === "false";
    }

    getElementTitle(element) {
        if (element.dataset.customTitle) {
            return element.dataset.customTitle;
        }
        if (element.children.length !== 0) {
            return element.children[0].textContent;
        } else {
            return element.textContent;
        }
    }

    getQuickLinkElements(document) {
        const results = [];
        const containers = document.querySelectorAll("div.content-container");

        for (const container of containers) {
            if (this.shouldExcludeElement(container)) continue;

            results.push({
                element: container,
                indentLevel: 0,
                isSectionHeader: container.dataset.sectionInd !== undefined,
                sectionHeaderLevel: container.dataset.sectionHeaderLevel !== undefined ? container.dataset.sectionHeaderLevel : 0,
            });

            const titles = container.querySelectorAll("p.step-group-title, p.upgrade-title, p.sub-sub-step");

            for (const [title_counter, title] of titles.entries()) {
                if (this.shouldExcludeElement(title)) continue;

                let indentLevel = 1;
                if (title.classList.contains("sub-sub-step") && title_counter !== 0) {
                    indentLevel = 2;
                }
                if (title.dataset.customIndent) {
                    indentLevel = Number(title.dataset.customIndent);
                }

                if (title.dataset.customQuickLink) {
                    const customLinks = title.dataset.customQuickLink.split(";");
                    title.id = customLinks[0];
                    for (const customName of customLinks) {
                        results.push({
                            element: title,
                            indentLevel,
                            custom_name: customName
                        });
                    }
                } else {
                    results.push({
                        element: title,
                        indentLevel
                    });
                }
            }
        }

        return results;
    }

    generateNavHTML(elements) {
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
                    html += `<h4 class="sub-header">${element.dataset.sectionInd}</h4>`;
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
            if (elementId === "") {
                console.log(`Element Quick Link with text **${element.textContent}** skipped, no ID given`);
                continue;
            }

            const linkText = item.custom_name || this.getElementTitle(element);

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

    generateFontBoxHTML() {
        return `
            <label for="fontSelector">Select a Font:</label>
            <select id="fontSelector">
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana (Higher Readability)</option>
                <option value="OpenDyslexic">OpenDyslexic</option>
            </select>
        `;
    }

    processFile(filePath) {
        console.log(`Processing ${path.basename(filePath)}...`);

        const content = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(content);
        const document = dom.window.document;

        // Find or create the container
        let parentElement = document.querySelector(".content-container-top");
        const smoothScrollElement = document.querySelector(".smooth-scroll");

        if (!parentElement && smoothScrollElement) {
            parentElement = document.createElement("div");
            parentElement.classList.add("content-container-top");

            if (smoothScrollElement.firstChild) {
                smoothScrollElement.insertBefore(parentElement, smoothScrollElement.firstChild);
            } else {
                smoothScrollElement.appendChild(parentElement);
            }
        }

        if (!parentElement) {
            console.log('  No suitable container found, skipping');
            return false;
        }

        // Clear existing content
        parentElement.innerHTML = '';

        // Generate font box
        parentElement.innerHTML = this.generateFontBoxHTML();

        // Generate navigation
        const elementsData = this.getQuickLinkElements(document);
        const navHTML = this.generateNavHTML(elementsData);

        if (navHTML) {
            parentElement.innerHTML += navHTML;
            console.log(`  Generated navigation with ${elementsData.length} items`);
        } else {
            console.log('  No navigation elements found');
        }

        // Write back to file
        fs.writeFileSync(filePath, dom.serialize());
        console.log(`  Updated ${path.basename(filePath)}`);
        return true;
    }

    getLinkedHtmlFiles() {
        const indexPath = path.resolve('../index.html');

        if (!fs.existsSync(indexPath)) {
            console.log('index.html not found in current directory');
            return [];
        }

        console.log('Reading index.html to find linked HTML files...');

        const content = fs.readFileSync(indexPath, 'utf8');
        const dom = new JSDOM(content);
        const document = dom.window.document;

        // Find all <a> tags with href attributes
        const links = document.querySelectorAll('a[href]');
        const htmlFiles = [];

        for (const link of links) {
            const href = link.getAttribute('href');

            // Check if it's an HTML file (ends with .html)
            if (href && href.endsWith('.html')) {
                // Skip files with "solver" in the name
                if (href.includes('solver')) {
                    console.log(`  Skipping ${href} (contains "solver")`);
                    continue;
                }

                // Resolve the path and check if file exists
                const filePath = path.resolve('..', href);
                if (fs.existsSync(filePath)) {
                    htmlFiles.push(filePath);
                    console.log(`  Found: ${href}`);
                } else {
                    console.log(`  Warning: ${href} linked but file not found`);
                }
            }
        }

        return htmlFiles;
    }

    run() {
        console.log('Building navigation for HTML files...\n');

        // Get HTML files linked from index.html
        const files = this.getLinkedHtmlFiles();

        if (files.length === 0) {
            console.log('No HTML files found linked from index.html');
            return;
        }

        console.log(`\nFound ${files.length} linked HTML files to process`);

        let processed = 0;
        for (const file of files) {
            try {
                if (this.processFile(file)) {
                    processed++;
                }
            } catch (error) {
                console.error(`Error processing ${path.basename(file)}:`, error.message);
            }
        }

        console.log(`\nCompleted! Processed ${processed} files.`);
    }
}

// Check if jsdom is available
try {
    require('jsdom');
} catch (error) {
    console.error('jsdom is not installed. Please run: npm install jsdom');
    process.exit(1);
}

// Run the builder
const builder = new NavBuilder();
builder.run();