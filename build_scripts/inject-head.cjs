// inject-head.cjs
const fs = require('fs');
const path = require('path');

const headTemplate = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/css/styles.css?v=0">
    <link rel="stylesheet" type="text/css" href="/css/hamburger_menu.css?v=0">
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css">
    <base target="_blank">
`;

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
            getAllHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') && file !== 'index.html') {
            fileList.push(filePath);
        }
    });

    return fileList;
}

const files = getAllHtmlFiles('.');
let processedCount = 0;
const changedFiles = [];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    const newContent = content.replace(
        /<head>([\s\S]*?)<\/head>/i,
        (match, innerContent) => {
            const titleMatch = innerContent.match(/<title>.*?<\/title>/i);
            const title = titleMatch ? titleMatch[0] : '<title>Guide</title>';
            return `<head>${headTemplate}    ${title}\n</head>`;
        }
    );

    if (newContent !== content) {
        fs.writeFileSync(file, newContent);
        processedCount++;
        changedFiles.push(file);
    }
});

console.log(`Injected head template into ${processedCount} files`);

if (processedCount < 10 && processedCount > 0) {
    console.log('\nChanged files:');
    changedFiles.forEach(file => console.log(`  - ${file}`));
}