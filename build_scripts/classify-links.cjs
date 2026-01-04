#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Classifies and validates links at build time
 * - Adds CSS classes based on link type (external, internal, images, etc.)
 * - Validates file paths and extensions
 * - Flags incomplete or broken links
 */

class LinkClassifier {
    constructor(options = {}) {
        this.options = {
            verbose: options.verbose || false,
            dryRun: options.dryRun || false,
            indexFile: options.indexFile || './src/index.html',
            ...options,
        };
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalLinks = 0;
        this.classifiedLinks = 0;
        this.warnings = [];
        this.errors = [];
    }

    log(message, level = 'info') {
        if (level === 'error') {
            console.error(`ERROR: ${message}`);
            this.errors.push(message);
        } else if (level === 'warn') {
            console.warn(`WARNING: ${message}`);
            this.warnings.push(message);
        } else if (level === 'success') {
            console.log(`SUCCESS: ${message}`);
        } else if (this.options.verbose) {
            console.log(`  ${message}`);
        }
    }

    processFile(filePath) {
        try {
            this.log(`Processing ${path.basename(filePath)}...`);
            this.processedFiles++;

            if (!fs.existsSync(filePath)) {
                this.log(`File does not exist: ${filePath}`, 'error');
                return false;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const dom = new JSDOM(content);
            const document = dom.window.document;

            const links = document.querySelectorAll('a:not(.content-container-top a)');
            let fileLinksProcessed = 0;
            let fileLinksClassified = 0;
            let modified = false;

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;

                fileLinksProcessed++;
                this.totalLinks++;
                let linkModified = false;

                // Classify anchor links (internal page links)
                if (href.includes('#')) {
                    if (!link.classList.contains('link-to-page')) {
                        link.classList.add('link-to-page');
                        linkModified = true;
                        console.log(`Added link-to-page: ${href}`);
                    }
                }

                // Classify external links
                if (href.includes('youtu.be') || href.includes('youtube') || href.includes('discord.com') || href.startsWith('http://') || href.startsWith('https://') || (href.includes('.com') && !href.startsWith('/'))) {
                    if (!link.classList.contains('external-link')) {
                        link.classList.add('external-link');
                        linkModified = true;
                        console.log(`Added external-link (external): ${href}`);
                    }
                }

                // Validate internal links (not anchors, not external)
                if (!href.startsWith('#') && !href.startsWith('http')) {
                    // Check for incomplete paths
                    if (href.endsWith('/')) {
                        if (!link.classList.contains('incomplete-path')) {
                            link.classList.add('incomplete-path');
                            linkModified = true;
                            console.log(`Incomplete path: ${href}`, 'warn');
                        }
                    }

                    // Check for valid file extensions
                    const validExtensions = ['.webp', '.html', '.webm', '.gif', '.jpg', '.jpeg', '.png', '.mp4'];
                    const hasValidExtension = validExtensions.some(ext => href.toLowerCase().includes(ext));

                    if (!hasValidExtension && !href.endsWith('/')) {
                        if (!link.classList.contains('wrong_file_type')) {
                            link.classList.add('wrong_file_type');
                            linkModified = true;
                            console.log(`Invalid file type: ${href}`, 'warn');
                        }
                    }
                }

                if (linkModified) {
                    fileLinksClassified++;
                    this.classifiedLinks++;
                    modified = true;
                }
            });

            console.log(`Processed ${fileLinksProcessed} links, classified ${fileLinksClassified}`);

            if (modified) {
                if (!this.options.dryRun) {
                    fs.writeFileSync(filePath, dom.serialize());
                    console.log(`Updated ${path.basename(filePath)}`, 'success');
                } else {
                    console.log(`Would update ${path.basename(filePath)} (dry run)`);
                }
                this.modifiedFiles++;
            } else {
                console.log(`No changes needed`);
            }

            return modified;
        } catch (error) {
            console.log(`Error processing ${filePath}: ${error.message}`, 'error');
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

            const links = document.querySelectorAll('a[href]');
            const htmlFiles = [];

            for (const link of links) {
                const href = link.getAttribute('href');

                if (href && href.endsWith('.html')) {
                    // Skip solver and temp files
                    if (href.includes('solver') || href.includes('temp')) {
                        this.log(`Skipping ${href} (solver/temp file)`);
                        continue;
                    }

                    const filePath = path.resolve(path.dirname(indexPath), href);
                    if (fs.existsSync(filePath)) {
                        htmlFiles.push(filePath);
                        this.log(`Found: ${href}`);
                    } else {
                        this.log(`Warning: ${href} linked but file not found`, 'warn');
                    }
                }
            }

            // Always include index.html itself
            if (!htmlFiles.includes(indexPath)) {
                htmlFiles.unshift(indexPath);
            }

            return htmlFiles;
        } catch (error) {
            this.log(`Error reading index file: ${error.message}`, 'error');
            return [];
        }
    }

    run() {
        console.log('Classifying links in HTML files...\n');

        try {
            const files = this.getLinkedHtmlFiles();

            if (files.length === 0) {
                this.log('No HTML files found linked from index.html', 'warn');
                return this.generateReport();
            }

            this.log(`Found ${files.length} linked HTML files to process\n`);

            for (const file of files) {
                console.log(file);
                this.processFile(file);
            }

            return this.generateReport();
        } catch (error) {
            this.log(`Critical error during build: ${error.message}`, 'error');
            return this.generateReport();
        }
    }

    generateReport() {
        console.log('\nLink Classification Report:');
        console.log(`   Files processed: ${this.processedFiles}`);
        console.log(`   Files modified: ${this.modifiedFiles}`);
        console.log(`   Total links scanned: ${this.totalLinks}`);
        console.log(`   Links classified: ${this.classifiedLinks}`);
        console.log(`   Warnings: ${this.warnings.length}`);
        console.log(`   Errors: ${this.errors.length}`);

        if (this.warnings.length > 0 && this.options.verbose) {
            console.log('\nWarnings:');
            this.warnings.slice(0, 10).forEach((warning, index) => {
                console.log(`   ${index + 1}. ${warning}`);
            });
            if (this.warnings.length > 10) {
                console.log(`   ... and ${this.warnings.length - 10} more warnings`);
            }
        }

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
        console.log(`\n${success ? 'Link classification completed successfully!' : 'Link classification completed with errors'}`);

        return success;
    }
}

function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        verbose: false,
        dryRun: false,
        indexFile: './src/index.html',
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
Link Classifier for Zombies Guides

Usage: node classify-links.js [options]

Options:
  -v, --verbose     Enable verbose logging
  -d, --dry-run     Show what would be done without making changes
  -i, --index FILE  Path to index.html file (default: ./index.html)
  -h, --help        Show this help message

This script:
  - Classifies links as internal/external
  - Adds appropriate CSS classes for styling
  - Validates file paths and extensions
  - Flags incomplete or invalid links

Examples:
  node classify-links.js
  node classify-links.js --verbose --dry-run
  node classify-links.js --index ./index.html
                `);
                process.exit(0);
                break;
        }
    }

    return options;
}

// Check dependencies
try {
    require('jsdom');
} catch (error) {
    console.error('ERROR: jsdom is not installed. Please run: npm install jsdom. Error: ', error.message);
    process.exit(1);
}

// Run
const options = parseArguments();
const classifier = new LinkClassifier(options);
const success = classifier.run();

process.exit(success ? 0 : 1);
