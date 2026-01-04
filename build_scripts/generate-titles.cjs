#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Generates page titles from filenames at build time
 * Converts: my_page_name.html -> "My Page Name"
 */

class TitleGenerator {
    constructor(options = {}) {
        this.options = {
            verbose: options.verbose || false,
            dryRun: options.dryRun || false,
            indexFile: options.indexFile || './src/index.html',
            ...options,
        };
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.errors = [];
    }

    log(message, level = 'info') {
        if (level === 'error') {
            console.error(`ERROR: ${message}`);
            this.errors.push(message);
        } else if (level === 'warn') {
            console.warn(`WARNING: ${message}`);
        } else if (level === 'success') {
            console.log(`SUCCESS: ${message}`);
        } else if (this.options.verbose) {
            console.log(`  ${message}`);
        }
    }

    generateTitle(filename) {
        const nameWithoutExt = filename.replace(/\.html$/, '');
        const withSpaces = nameWithoutExt.replace(/_/g, ' ');
        const lowercaseWords = ['of', 'the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'in', 'on', 'at', 'to', 'with', 'by'];

        const words = withSpaces.split(' ');
        return words
            .map((word, index) => {
                if (index === 0 || index === words.length - 1) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                if (lowercaseWords.includes(word.toLowerCase())) {
                    return word.toLowerCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
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

            const titleElement = document.querySelector('.title-text');
            const filename = path.basename(filePath);
            let modified = false;

            // Update document title if it says "change me"
            if (document.title.toLowerCase() === 'change me') {
                const newTitle = this.generateTitle(filename);
                document.title = newTitle;
                this.log(`Document title: "change me" -> "${newTitle}"`);
                modified = true;
            }

            // Update title element if it says "change me"
            if (titleElement && titleElement.textContent.toLowerCase() === 'change me') {
                titleElement.textContent = document.title;
                this.log(`Title element: "change me" -> "${document.title}"`);
                modified = true;
            }

            if (modified) {
                if (!this.options.dryRun) {
                    fs.writeFileSync(filePath, dom.serialize());
                    this.log(`Updated ${path.basename(filePath)}`, 'success');
                } else {
                    this.log(`Would update ${path.basename(filePath)} (dry run)`);
                }
                this.modifiedFiles++;
            } else {
                this.log(`No changes needed`);
            }

            return modified;
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

            return htmlFiles;
        } catch (error) {
            this.log(`Error reading index file: ${error.message}`, 'error');
            return [];
        }
    }

    run() {
        console.log('Generating titles for HTML files...\n');

        try {
            const files = this.getLinkedHtmlFiles();

            if (files.length === 0) {
                this.log('No HTML files found linked from index.html', 'warn');
                return this.generateReport();
            }

            this.log(`Found ${files.length} linked HTML files to process\n`);

            for (const file of files) {
                this.processFile(file);
            }

            return this.generateReport();
        } catch (error) {
            this.log(`Critical error during build: ${error.message}`, 'error');
            return this.generateReport();
        }
    }

    generateReport() {
        console.log('\nTitle Generation Report:');
        console.log(`   Files processed: ${this.processedFiles}`);
        console.log(`   Files modified: ${this.modifiedFiles}`);
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
        console.log(`\n${success ? 'Title generation completed successfully!' : 'Title generation completed with errors'}`);

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
Title Generator for Zombies Guides

Usage: node generate-titles.js [options]

Options:
  -v, --verbose     Enable verbose logging
  -d, --dry-run     Show what would be done without making changes
  -i, --index FILE  Path to index.html file (default: ./index.html)
  -h, --help        Show this help message

This script:
  - Finds all HTML files linked from index.html
  - Generates proper titles from filenames (my_page.html -> "My Page")
  - Updates <title> and .title-text elements that say "change me"

Examples:
  node generate-titles.js
  node generate-titles.js --verbose --dry-run
  node generate-titles.js --index ./index.html
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
const generator = new TitleGenerator(options);
const success = generator.run();

process.exit(success ? 0 : 1);
