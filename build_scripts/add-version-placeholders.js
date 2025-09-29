#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to automatically add version placeholders to HTML files
 * Finds CSS and JS links without version parameters and adds ?v=0
 * Also adds version display component to index.html if not present
 */

const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('--dry');

function log(message, force = false) {
    if (VERBOSE || force) {
        console.log(message);
    }
}

function findHtmlFiles(dir = '.', exclude = ['node_modules', '.git', 'dist', 'build']) {
    const htmlFiles = [];

    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !exclude.includes(item)) {
                scanDirectory(fullPath);
            } else if (stat.isFile() && item.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        }
    }

    scanDirectory(dir);
    return htmlFiles;
}

function addVersionPlaceholders(htmlContent, filePath) {
    let modified = false;
    let newContent = htmlContent;
    const changes = [];

    // Regex patterns for CSS and JS links without version parameters
    const cssPattern = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"'?]+\.css)["'][^>]*>/gi;
    const jsPattern = /<script[^>]+src=["']([^"'?]+\.js)["'][^>]*>/gi;

    // Find and update CSS links
    newContent = newContent.replace(cssPattern, (match, href) => {
        if (!href.includes('?v=')) {
            changes.push(`CSS: ${href} → ${href}?v=0`);
            modified = true;
            return match.replace(`"${href}"`, `"${href}?v=0"`);
        }
        return match;
    });

    // Find and update JS script tags
    newContent = newContent.replace(jsPattern, (match, src) => {
        if (!src.includes('?v=')) {
            changes.push(`JS: ${src} → ${src}?v=0`);
            modified = true;
            return match.replace(`"${src}"`, `"${src}?v=0"`);
        }
        return match;
    });

    // Add version display component to index.html if not present
    if (path.basename(filePath) === 'index.html' && !newContent.includes('version-display')) {
        const versionDisplayComponent = `
    <!-- Version display component -->
    <div class="version-display" data-version="0">
        v.<span id="version-number">0</span>
    </div>

    <style>
        .version-display {
            position: fixed;
            bottom: 10px;
            left: 10px;
            font-family: monospace, 'Courier New', serif;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
            background: rgba(0, 0, 0, 0.3);
            padding: 4px 8px;
            border-radius: 3px;
            backdrop-filter: blur(2px);
            pointer-events: none;
            z-index: 9999;
            user-select: none;
            transition: opacity 0.3s ease;
        }
        
        @media (prefers-color-scheme: light) {
            .version-display {
                color: rgba(0, 0, 0, 0.4);
                background: rgba(255, 255, 255, 0.3);
            }
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const versionDisplay = document.querySelector('.version-display');
            const versionNumber = document.getElementById('version-number');
            
            if (versionDisplay && versionNumber) {
                const version = versionDisplay.getAttribute('data-version') || '0';
                versionNumber.textContent = version === '0' ? 'dev' : version.toString().slice(-6);
                console.log('Website version:', version);
            }
        });
    </script>`;

        // Insert before closing </body> tag
        if (newContent.includes('</body>')) {
            newContent = newContent.replace('</body>', versionDisplayComponent + '\n</body>');
            changes.push('Added version display component');
            modified = true;
        } else {
            // If no </body> tag, add at the end
            newContent += versionDisplayComponent;
            changes.push('Added version display component (no </body> tag found)');
            modified = true;
        }
    }

    return { content: newContent, modified, changes };
}

function main() {
    console.log('Scanning for HTML files...');

    const htmlFiles = findHtmlFiles();
    console.log(`Found ${htmlFiles.length} HTML files\n`);

    if (htmlFiles.length === 0) {
        console.log('No HTML files found.');
        return;
    }

    let totalModified = 0;
    let totalChanges = 0;

    for (const filePath of htmlFiles) {
        log(`\nProcessing: ${filePath}`);

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const result = addVersionPlaceholders(content, filePath);

            if (result.modified) {
                totalModified++;
                totalChanges += result.changes.length;

                console.log(`Modified: ${filePath}`);
                result.changes.forEach(change => {
                    console.log(`   - ${change}`);
                });

                if (!DRY_RUN) {
                    fs.writeFileSync(filePath, result.content, 'utf8');
                    log(`Saved changes`, true);
                }
            } else {
                log(`No changes needed`);
            }
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error.message);
        }
    }

    console.log('\nSummary:');
    console.log(`   Files processed: ${htmlFiles.length}`);
    console.log(`   Files modified: ${totalModified}`);
    console.log(`   Total changes: ${totalChanges}`);

    if (DRY_RUN) {
        console.log('\n⚠️  DRY RUN - No files were actually modified');
        console.log('   Remove --dry-run flag to apply changes');
    }

    if (totalModified > 0 && !DRY_RUN) {
        console.log('\n🎉 Version placeholders added successfully!');
        console.log('   You can now run: npm run version');
    }
}

// Show help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Usage: node add-version-placeholders.js [options]

Options:
  --verbose, -v     Show detailed output
  --dry-run, --dry  Show what would be changed without modifying files
  --help, -h        Show this help message

This script will:
1. Find all HTML files in the current directory (excluding node_modules, .git, etc.)
2. Add ?v=0 to CSS and JS links that don't have version parameters
3. Add a version display component to index.html if not present

Examples:
  node add-version-placeholders.js
  node add-version-placeholders.js --verbose
  node add-version-placeholders.js --dry-run
`);
    process.exit(0);
}

main();