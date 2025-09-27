#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const QuickLinksUtils = require('../js/quick-links-utils.js');

class NavBuilder {
    constructor(options = {}) {
        this.options = {
            verbose: options.verbose || false,
            dryRun: options.dryRun || false,
            indexFile: options.indexFile || '../index.html',
            ...options
        };
        this.processedFiles = 0;
        this.errors = [];
    }

    log(message, level = 'info') {
        if (level === 'error') {
            console.error(`${message}`);
            this.errors.push(message);
        } else if (level === 'warn') {
            console.warn(`${message}`);
        } else if (level === 'success') {
            console.log(`${message}`);
        } else if (this.options.verbose) {
            console.log(`${message}`);
        }
    }

    processFile(filePath) {
        try {
            this.log(`Processing ${path.basename(filePath)}...`);
            
            if (!fs.existsSync(filePath)) {
                this.log(`File does not exist: ${filePath}`, 'error');
                return false;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const dom = new JSDOM(content);
            const document = dom.window.document;

            // Find the hamburger menu container
            const parentElement = document.getElementById("hamburgerMenuLinks");

            if (!parentElement) {
                this.log('Hamburger menu container not found, skipping', 'warn');
                return false;
            }

            // Clear existing content
            parentElement.innerHTML = '';

            // Generate font box
            parentElement.innerHTML = QuickLinksUtils.generateFontBoxHTML();

            // Generate navigation
            const elementsData = QuickLinksUtils.getQuickLinkElements(document);
            const navHTML = QuickLinksUtils.generateNavHTML(elementsData);

            if (navHTML) {
                parentElement.innerHTML += navHTML;
                this.log(`Generated navigation with ${elementsData.length} items`);
            } else {
                this.log('No navigation elements found', 'warn');
            }

            // Write back to file (unless dry run)
            if (!this.options.dryRun) {
                fs.writeFileSync(filePath, dom.serialize());
                this.log(`Updated ${path.basename(filePath)}`, 'success');
            } else {
                this.log(`Would update ${path.basename(filePath)} (dry run)`);
            }
            
            return true;
            
        } catch (error) {
            this.log(`Error processing ${filePath}: ${error.message}`, 'error');
            return false;
        }
    }

    getLinkedHtmlFiles() {
        const indexPath = path.resolve(this.options.indexFile);

        if (!fs.existsSync(indexPath)) {
            this.log(`Index file not found: ${indexPath}`, 'error');
            return [];
        }

        this.log(`Reading ${path.basename(indexPath)} to find linked HTML files...`);

        try {
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
                        this.log(`Skipping ${href} (contains "solver")`);
                        continue;
                    }

                    // Skip files with "temp" in the name
                    if (href.includes('temp')) {
                        this.log(`Skipping ${href} (contains "temp")`);
                        continue;
                    }

                    // Resolve the path and check if file exists
                    const filePath = path.resolve(path.dirname(indexPath), href);
                    if (fs.existsSync(filePath)) {
                        htmlFiles.push(filePath);
                        this.log(`Found: ${href}`);
                    } else {
                        this.log(`Warning: ${href} linked but file not found`, 'warn');
                    }
                }
            }

            return htmlFiles;
            
        } catch (error) {
            this.log(`Error reading index file: ${error.message}`, 'error');
            return [];
        }
    }

    run() {
        console.log('Building navigation for HTML files...\n');

        try {
            // Get HTML files linked from index.html
            const files = this.getLinkedHtmlFiles();

            if (files.length === 0) {
                this.log('No HTML files found linked from index.html', 'warn');
                return this.generateReport();
            }

            this.log(`Found ${files.length} linked HTML files to process`);

            // Process each file
            for (const file of files) {
                if (this.processFile(file)) {
                    this.processedFiles++;
                }
            }

            return this.generateReport();
            
        } catch (error) {
            this.log(`Critical error during build: ${error.message}`, 'error');
            return this.generateReport();
        }
    }

    generateReport() {
        console.log('\nBuild Report:');
        console.log(`   Files processed: ${this.processedFiles}`);
        console.log(`   Errors: ${this.errors.length}`);
        
        if (this.errors.length > 0) {
            console.log('\nErrors:');
            this.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        }
        
        if (this.options.dryRun) {
            console.log('\nThis was a dry run - no files were actually modified');
        }

        const success = this.errors.length === 0;
        console.log(`\n${success ? 'Build completed successfully!' : 'Build completed with errors'}`);
        
        return success;
    }
}

// Command line interface
function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        verbose: false,
        dryRun: false,
        indexFile: '../index.html'
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--dry-run':
            case '-d':
                options.dryRun = true;
                break;
            case '--index':
            case '-i':
                if (i + 1 < args.length) {
                    options.indexFile = args[++i];
                }
                break;
            case '--help':
            case '-h':
                console.log(`
Navigation Builder for Zombies Guides

Usage: node nav-builder-improved.js [options]

Options:
  -v, --verbose     Enable verbose logging
  -d, --dry-run     Show what would be done without making changes
  -i, --index FILE  Path to index.html file (default: ../index.html)
  -h, --help        Show this help message

Examples:
  node nav-builder-improved.js
  node nav-builder-improved.js --verbose --dry-run
  node nav-builder-improved.js --index ./index.html
                `);
                process.exit(0);
                break;
        }
    }

    return options;
}

// Check if jsdom is available
try {
    require('jsdom');
} catch (error) {
    console.error('jsdom is not installed. Please run: npm install jsdom');
    process.exit(1);
}

// Run the builder
const options = parseArguments();
const builder = new NavBuilder(options);
const success = builder.run();

process.exit(success ? 0 : 1);
