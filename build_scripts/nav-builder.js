#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const QuickLinksUtils = require('../js/quick-links-utils.js');

class NavBuilder {
    // All utility functions moved to quick-links-utils.js

    processFile(filePath) {
        console.log(`Processing ${path.basename(filePath)}...`);

        const content = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(content);
        const document = dom.window.document;

        // Find the hamburger menu container
        let parentElement = document.getElementById("hamburgerMenuLinks");

        if (!parentElement) {
            console.log('  Hamburger menu container not found, skipping');
            return false;
        }

        // Clear existing content
        parentElement.innerHTML = '';

        // Generate font box
        parentElement.innerHTML = QuickLinksUtils.generateFontBoxHTML();

        // Generate navigation
        const elementsData = QuickLinksUtils.getQuickLinkElements(document);
        const isHamburgerMenu = parentElement.id === "hamburgerMenuLinks";
        const navHTML = QuickLinksUtils.generateNavHTML(elementsData, isHamburgerMenu);

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