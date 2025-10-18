const fs = require('fs');
const path = require('path');

/**
 * Updates all HTML files to reference the correct React bundle hash
 * Run this after building React bundles
 *
 * This script:
 * 1. Finds the generated bundle in react-solvers/dist/assets/
 * 2. Scans all HTML files in the games directory
 * 3. Updates any that reference the old bundle hash
 */

const reactSolversPath = path.join(__dirname, '../react-solvers');
const distPath = path.join(reactSolversPath, 'dist/assets');

// Find the generated JS file
if (!fs.existsSync(distPath)) {
    console.error(`Error: dist directory not found at ${distPath}`);
    console.error('Make sure you run "npm run build:react" first');
    process.exit(1);
}

const files = fs.readdirSync(distPath);
const jsFile = files.find(file => file.startsWith('index-') && file.endsWith('.js') && !file.endsWith('.map'));

if (!jsFile) {
    console.error('Could not find generated React bundle in dist/assets/');
    console.error('Make sure you run "npm run build:react" first');
    process.exit(1);
}

console.log(`Found React bundle: ${jsFile}\n`);

// Recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Find all HTML files that might use React solvers
const gamesDir = path.join(__dirname, '../games');
const allHtmlFiles = findHtmlFiles(gamesDir);

let updatedCount = 0;
let skippedCount = 0;

// Pattern to match React bundle script tags (absolute or relative paths)
const scriptPattern = /<script type="module" src="(\.\.\/|\/)?react-solvers\/dist\/assets\/index-[^"?]+\.js(\?v=[^"]+)?"><\/script>/g;

allHtmlFiles.forEach(htmlFilePath => {
    const html = fs.readFileSync(htmlFilePath, 'utf8');

    // Check if this file uses React solvers
    if (!scriptPattern.test(html)) {
        return; // Skip files that don't use React
    }

    // Reset regex lastIndex
    scriptPattern.lastIndex = 0;

    // Use absolute path from root
    const newScript = `<script type="module" src="/react-solvers/dist/assets/${jsFile}"></script>`;

    // Replace all occurrences
    const updatedHtml = html.replace(scriptPattern, newScript);

    if (updatedHtml !== html) {
        fs.writeFileSync(htmlFilePath, updatedHtml, 'utf8');
        const relativePath = path.relative(gamesDir, htmlFilePath);
        console.log(`✓ Updated: games/${relativePath}`);
        updatedCount++;
    } else {
        const relativePath = path.relative(gamesDir, htmlFilePath);
        console.log(`- Skipped: games/${relativePath} (already up to date)`);
        skippedCount++;
    }
});

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`Updated: ${updatedCount} file(s)`);
console.log(`Skipped: ${skippedCount} file(s)`);
console.log(`Total: ${updatedCount + skippedCount} file(s) checked`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
