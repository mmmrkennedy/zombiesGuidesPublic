// resize-images.cjs
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = 'games';
const SIZES = [
    { suffix: '-640', width: 640 },
    { suffix: '-1280', width: 1280 }
];

// Check for --dry-run flag
const DRY_RUN = process.argv.includes('--dry-run');

function findAllPicturesFolders(dir, picturesFolders = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file === 'pictures') {
                picturesFolders.push(filePath);
            } else {
                findAllPicturesFolders(filePath, picturesFolders);
            }
        }
    });

    return picturesFolders;
}

function getAllImageFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllImageFiles(filePath, fileList);
        } else if (/\.(webp|jpg|jpeg|png)$/i.test(file)) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function ensureDirectoryExists(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function printFolderStructure(mapFolder) {
    const items = fs.readdirSync(mapFolder);
    const picturesFolders = items.filter(item => {
        const fullPath = path.join(mapFolder, item);
        return fs.statSync(fullPath).isDirectory() && item.startsWith('pictures');
    }).sort();

    console.log(`${mapFolder}/`);
    picturesFolders.forEach((folder, index) => {
        const isLast = index === picturesFolders.length - 1;
        const prefix = isLast ? '└── ' : '├── ';
        console.log(`${prefix}${folder}/`);

        // Show a few sample files from the folder
        const folderPath = path.join(mapFolder, folder);
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f)).slice(0, 3);

        imageFiles.forEach((file, fileIndex) => {
            const isLastFile = fileIndex === imageFiles.length - 1 && files.length <= 3;
            const filePrefix = isLast ? '    ' : '│   ';
            const bullet = isLastFile ? '└── ' : '├── ';
            console.log(`${filePrefix}${bullet}${file}`);
        });

        if (files.length > 3) {
            const filePrefix = isLast ? '    ' : '│   ';
            console.log(`${filePrefix}└── ... (${files.length - 3} more files)`);
        }
    });
}

function resizeImage(inputPath, outputPath, width) {
    if (DRY_RUN) {
        console.log(`    [DRY RUN] Would resize: ${inputPath} -> ${outputPath}`);
        return true;
    }

    ensureDirectoryExists(outputPath);

    // Using ImageMagick's convert command
    try {
        execSync(`magick convert "${inputPath}" -resize ${width}x "${outputPath}"`, {
            stdio: 'pipe'
        });
        return true;
    } catch (error) {
        console.error(`Failed to resize ${inputPath}: ${error.message}`);
        return false;
    }
}

function main() {
    if (DRY_RUN) {
        console.log('=== DRY RUN MODE - No files will be modified ===\n');
    }

    // Check if ImageMagick is installed
    if (!DRY_RUN) {
        try {
            execSync('magick -version', { stdio: 'ignore' });
        } catch (error) {
            console.error('ImageMagick is not installed!');
            console.error('Install from: https://imagemagick.org/script/download.php');
            console.error('Make sure to check "Add to PATH" during installation.');
            process.exit(1);
        }
    }

    console.log('Finding all pictures/ folders in games/...');
    const picturesFolders = findAllPicturesFolders(ROOT_DIR);
    console.log(`Found ${picturesFolders.length} pictures/ folders\n`);

    let totalProcessed = 0;
    let processedOneDryRun = false;

    picturesFolders.forEach(picturesFolder => {
        // In dry run, stop after processing one folder
        if (DRY_RUN && processedOneDryRun) {
            return;
        }
        console.log(`Processing: ${picturesFolder}`);
        const images = getAllImageFiles(picturesFolder);

        if (images.length === 0) {
            console.log(`  No images found, skipping\n`);
            return;
        }

        console.log(`  Found ${images.length} images`);

        SIZES.forEach(({ suffix, width }) => {
            const targetFolder = picturesFolder + suffix;
            let processed = 0;

            images.forEach(imagePath => {
                // Get relative path from source pictures folder
                const relativePath = path.relative(picturesFolder, imagePath);
                const outputPath = path.join(targetFolder, relativePath);

                // Skip if already exists
                if (fs.existsSync(outputPath)) {
                    return;
                }

                if (resizeImage(imagePath, outputPath, width)) {
                    processed++;
                    totalProcessed++;
                }
            });

            console.log(`  Created ${processed} images at ${width}px in ${targetFolder}`);
        });

        if (DRY_RUN) {
            processedOneDryRun = true;
            console.log('\n--- Resulting folder structure ---');
            printFolderStructure(path.dirname(picturesFolder));
        }

        console.log('');
    });

    console.log(`Done! ${DRY_RUN ? 'Would process' : 'Processed'} ${totalProcessed} images total.`);

    if (DRY_RUN) {
        console.log('\nDry run stopped after one map folder.');
        console.log('To actually resize images, run without --dry-run flag');
    }
}

main();