import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up to project root, then into dist
const distDir = path.join(__dirname, '..', 'dist');

/**
 * Recursively find all files with given extensions
 */
function findFiles(dir, extensions) {
    const files = [];

    function traverse(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                // Skip react-solvers directory (already handled by Vite)
                if (entry.name === 'react-solvers') continue;
                traverse(fullPath);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (extensions.includes(ext) && !entry.name.endsWith('.min.css') && !entry.name.endsWith('.min.js')) {
                    files.push(fullPath);
                }
            }
        }
    }

    traverse(dir);
    return files;
}

/**
 * Minify CSS file using clean-css-cli
 */
function minifyCSS(filePath) {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath, '.css');
    const outputPath = path.join(dir, `${fileName}.min.css`);

    try {
        execSync(`npx clean-css-cli -o "${outputPath}" "${filePath}"`, { stdio: 'inherit' });
        console.log(`✅ Minified CSS: ${path.relative(distDir, filePath)} → ${path.basename(outputPath)}`);

        // Delete original, rename minified
        fs.unlinkSync(filePath);
        fs.renameSync(outputPath, filePath);
        console.log(`   Replaced with minified version`);
    } catch (error) {
        console.error(`❌ Error minifying ${filePath}:`, error.message);
    }
}
/**
 * Minify JS file using terser
 */
function minifyJS(filePath) {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath, '.js');
    const outputPath = path.join(dir, `${fileName}.min.js`);

    try {
        execSync(`npx terser "${filePath}" -o "${outputPath}" -c -m`, { stdio: 'inherit' });
        console.log(`✅ Minified JS: ${path.relative(distDir, filePath)} → ${path.basename(outputPath)}`);

        // Delete original, rename minified
        fs.unlinkSync(filePath);
        fs.renameSync(outputPath, filePath);
        console.log(`   Replaced with minified version`);
    } catch (error) {
        console.error(`❌ Error minifying ${filePath}:`, error.message);
    }
}

/**
 * Main execution
 */
console.log('🚀 Starting asset minification...\n');

if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found. Run build first.');
    process.exit(1);
}

// Find all CSS and JS files
const cssFiles = findFiles(distDir, ['.css']);
const jsFiles = findFiles(distDir, ['.js']);

console.log(`Found ${cssFiles.length} CSS files and ${jsFiles.length} JS files\n`);

// Minify CSS files
console.log('📦 Minifying CSS files...');
for (const file of cssFiles) {
    minifyCSS(file);
}

console.log('\n📦 Minifying JS files...');
// Minify JS files
for (const file of jsFiles) {
    minifyJS(file);
}

console.log('\n✨ Minification complete!');