#!/usr/bin/env node

/**
 * Fix spaces between closing </a> tags and punctuation
 * This script finds instances where punctuation is on its own line after an </a> tag
 * and moves the punctuation to the same line as the </a> tag
 */

const fs = require('fs');
const path = require('path');

function fixAnchorsInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Replace pattern: </a> followed by newline and indentation and punctuation
    // with: </a> followed immediately by punctuation
    // Handles: periods, commas, colons, semicolons, exclamation marks, question marks
    let fixed = content.replace(/(<\/a>)\n(\s+)([.,;:!?])/g, '$1$3');

    if (content !== fixed) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        return true;
    }
    return false;
}

function findHtmlFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
            files.push(...findHtmlFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }

    return files;
}

// Main execution
const rootDir = process.cwd();
const htmlFiles = findHtmlFiles(rootDir);

let fixedCount = 0;
htmlFiles.forEach(file => {
    if (fixAnchorsInFile(file)) {
        console.log(`Fixed: ${path.relative(rootDir, file)}`);
        fixedCount++;
    }
});

console.log(`\nFixed ${fixedCount} file(s)`);
