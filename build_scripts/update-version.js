// build_scripts/update-version.js

const fs = require('fs');
const path = require('path');

// Generate timestamp version
const VERSION = Date.now().toString();
console.log(`Building with version: ${VERSION}`);

// Recursively walk a directory to find .html files
function walk(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            walk(filepath, filelist);
        } else if (filepath.endsWith('.html')) {
            filelist.push(filepath);
        }
    }
    return filelist;
}

// Update contents of each HTML file
const htmlFiles = walk('.');
const updatedFiles = [];

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Replace ?v=123 style cache-busting query
    content = content.replace(/\?v=\d+/g, `?v=${VERSION}`);

    // Replace data-version="123"
    content = content.replace(/data-version="\d+"/g, `data-version="${VERSION}"`);

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        updatedFiles.push(file);
    }
}

console.log(`Version update complete: ${VERSION}`);
if (updatedFiles.length) {
    console.log('Updated files:');
    updatedFiles.forEach(f => console.log(`- ${f}`));
} else {
    console.log('No files needed updating.');
}
