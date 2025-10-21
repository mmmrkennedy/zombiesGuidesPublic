const fs = require('fs');
const path = require('path');

// Configuration
const CSS_FILES = ['./css/styles.css', './css/global_solver.css', './css/tutorial_box.css'];

// Extract all CSS class names from CSS files
function extractCSSClasses(cssContent) {
    const classPattern = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
    const classes = new Set();
    let match;

    while ((match = classPattern.exec(cssContent)) !== null) {
        // Skip pseudo-classes and special selectors
        if (!match[1].includes(':')) {
            classes.add(match[1]);
        }
    }

    return Array.from(classes);
}

// Search for class usage in files
function searchClassUsage(className, contentFiles) {
    const usage = [];
    const patterns = [
        new RegExp(`class=["'][^"']*\\b${className}\\b[^"']*["']`, 'g'),
        new RegExp(`className=["'][^"']*\\b${className}\\b[^"']*["']`, 'g'),
        new RegExp(`classList\\.(?:add|remove|toggle|contains)\\(['"]${className}['"]\\)`, 'g'),
        new RegExp(`\\.className\\s*=\\s*['"\`]${className}['"\`]`, 'g'), // .className = 'class-name'
        new RegExp(`setAttribute\\s*\\(\\s*['"]class['"]\\s*,\\s*['"][^"']*\\b${className}\\b[^"']*['"]\\s*\\)`, 'g'), // setAttribute('class', '...')
    ];

    for (const file of contentFiles) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            let count = 0;

            for (const pattern of patterns) {
                const matches = content.match(pattern);
                if (matches) {
                    count += matches.length;
                }
            }

            if (count > 0) {
                usage.push({ file, count });
            }
        } catch (err) {
            // Skip files that can't be read
            console.error("File can't be read: ", err);
        }
    }

    return usage;
}

// Get all files matching patterns
function getFiles() {
    const files = [];

    function walkDir(dir, pattern) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                // Skip node_modules and other common directories
                if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'purgecss-report'].includes(entry.name)) {
                    walkDir(fullPath, pattern);
                } else if (entry.isFile() && pattern.test(entry.name)) {
                    files.push(fullPath);
                }
            }
        } catch (err) {
            // Skip directories we can't access
            console.error("Directory can't be read: ", err);
        }
    }

    const filePatterns = [/\.html$/, /\.jsx$/, /\.tsx$/, /\.js$/, /\.ts$/];

    for (const pattern of filePatterns) {
        walkDir('.', pattern);
    }

    return files;
}

// Main analysis
function analyzeCSS() {
    console.log('🔍 Analyzing CSS class usage...\n');

    const allClasses = new Map();

    // Read all CSS files and extract classes
    for (const cssFile of CSS_FILES) {
        try {
            const content = fs.readFileSync(cssFile, 'utf-8');
            const classes = extractCSSClasses(content);

            console.log(`📄 Found ${classes.length} classes in ${cssFile}`);

            for (const className of classes) {
                if (!allClasses.has(className)) {
                    allClasses.set(className, { cssFile, usage: [] });
                }
            }
        } catch (err) {
            console.error(`❌ Error reading ${cssFile}:`, err.message);
        }
    }

    console.log(`\n📊 Total unique classes: ${allClasses.size}\n`);

    // Get all content files
    const contentFiles = getFiles();
    console.log(`📁 Scanning ${contentFiles.length} files for usage...\n`);

    // Analyze usage for each class
    const results = [];

    for (const [className, data] of allClasses.entries()) {
        const usage = searchClassUsage(className, contentFiles);
        const totalUsage = usage.reduce((sum, u) => sum + u.count, 0);

        results.push({
            className,
            cssFile: data.cssFile,
            usage,
            totalUsage,
            fileCount: usage.length,
        });
    }

    // Sort by usage (least used first)
    results.sort((a, b) => a.totalUsage - b.totalUsage);

    // Display results
    console.log('═══════════════════════════════════════════════════════════');
    console.log('CSS CLASS USAGE REPORT');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Unused classes
    const unused = results.filter(r => r.totalUsage === 0);
    if (unused.length > 0) {
        console.log(`\n⚠️  UNUSED CLASSES (${unused.length}):\n`);
        for (const r of unused) {
            console.log(`  • ${r.className.padEnd(40)} (${r.cssFile})`);
        }
    }

    // Low usage classes
    const lowUsage = results.filter(r => r.totalUsage > 0 && r.totalUsage <= 2);
    if (lowUsage.length > 0) {
        console.log(`\n📉 LOW USAGE CLASSES (used 1-2 times, ${lowUsage.length} classes):\n`);
        for (const r of lowUsage) {
            console.log(`  • ${r.className.padEnd(40)} Used ${r.totalUsage}x in ${r.fileCount} file(s)`);
        }
    }

    // High usage classes
    const highUsage = results.filter(r => r.totalUsage > 10).sort((a, b) => b.totalUsage - a.totalUsage);
    if (highUsage.length > 0) {
        console.log(`\n📈 MOST USED CLASSES (${highUsage.length} classes):\n`);
        for (const r of highUsage.slice(0, 20)) {
            console.log(`  • ${r.className.padEnd(40)} Used ${r.totalUsage}x in ${r.fileCount} file(s)`);
        }
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total classes:        ${allClasses.size}`);
    console.log(`Unused classes:       ${unused.length} (${((unused.length / allClasses.size) * 100).toFixed(1)}%)`);
    console.log(`Low usage (1-2):      ${lowUsage.length}`);
    console.log(`Medium usage (3-10):  ${results.filter(r => r.totalUsage >= 3 && r.totalUsage <= 10).length}`);
    console.log(`High usage (>10):     ${highUsage.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

analyzeCSS();
