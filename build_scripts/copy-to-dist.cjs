#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Copies all files from src/ to dist/ for deployment
 * Excludes certain directories and files that shouldn't be deployed
 */

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');

// Directories/files to exclude from copying
const EXCLUDE = [
    'node_modules',
    '.git',
    'dist',
    // react-solvers will be built separately by vite, so we only need to copy the built output
    // which vite already puts in dist/react-solvers
];

function shouldExclude(itemPath, basePath) {
    const relativePath = path.relative(basePath, itemPath);
    const parts = relativePath.split(path.sep);

    // Check if any part of the path is in the exclude list
    for (const part of parts) {
        if (EXCLUDE.includes(part)) {
            return true;
        }
    }

    return false;
}

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
        // Create directory if it doesn't exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        // Read directory contents
        const items = fs.readdirSync(src);

        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);

            // Skip excluded items
            if (shouldExclude(srcPath, SRC_DIR)) {
                continue;
            }

            copyRecursive(srcPath, destPath);
        }
    } else {
        // Copy file
        fs.copyFileSync(src, dest);
    }
}

function main() {
    console.log('Copying files from src/ to dist/...\n');

    // Create dist directory if it doesn't exist
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    try {
        copyRecursive(SRC_DIR, DIST_DIR);
        console.log('✓ Successfully copied files to dist/');
    } catch (error) {
        console.error('Error copying files:', error);
        process.exit(1);
    }
}

main();
