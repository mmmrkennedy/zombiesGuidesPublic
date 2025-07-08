#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findEditedFiles(dir = '..') {  // Start from parent directory (project root)
    const editedFiles = [];

    function searchDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip common directories that shouldn't contain HTML
                if (!['node_modules', '.git', '.vscode', 'dist', 'build', 'js'].includes(item)) {
                    searchDirectory(fullPath);
                }
            } else if (item.endsWith('_EDITED.html')) {
                editedFiles.push(fullPath);
            }
        }
    }

    searchDirectory(dir);
    return editedFiles;
}

function cleanupEditedFiles() {
    console.log('Searching for _EDITED HTML files in project root and subfolders...\n');

    const editedFiles = findEditedFiles();

    if (editedFiles.length === 0) {
        console.log('No _EDITED HTML files found');
        return;
    }

    console.log(`Found ${editedFiles.length} _EDITED HTML files:`);

    let deleted = 0;
    for (const editedFile of editedFiles) {
        try {
            // Create the original filename by removing _EDITED
            const originalFile = editedFile.replace('_EDITED.html', '.html');

            // Check if the original file exists
            if (fs.existsSync(originalFile)) {
                console.log(`  Deleting ${path.relative('..', editedFile)}... (original exists)`);
                fs.unlinkSync(editedFile);
                deleted++;
            } else {
                console.log(`  Skipping ${path.relative('..', editedFile)} (no original file found)`);
            }
        } catch (error) {
            console.error(`  Error deleting ${path.relative('..', editedFile)}:`, error.message);
        }
    }

    console.log(`\nCompleted! Deleted ${deleted} files.`);
}

// Run the cleanup
cleanupEditedFiles();