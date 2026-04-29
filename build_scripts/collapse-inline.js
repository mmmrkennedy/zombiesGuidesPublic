import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const INLINE_TAGS =
    /^<\/?(a|span|strong|em|code|abbr|b|i|mark|small|sub|sup|time|label|cite|kbd|samp|var|s|u)[\s>/]/i;
const BLOCK_TAGS =
    /^<\/?(div|p|ul|ol|li|table|thead|tbody|tfoot|tr|td|th|h[1-6]|section|article|header|footer|nav|main|aside|blockquote|pre|figure|figcaption|dl|dt|dd|form|fieldset|details|summary|script|style|head|body|html|title|meta|link|template|noscript)[\s>/]/i;

function findHtmlFiles(dir) {
    const files = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory() && !["node_modules", "dist", "build", ".git"].includes(entry)) {
            files.push(...findHtmlFiles(full));
        } else if (entry.endsWith(".html")) {
            files.push(full);
        }
    }
    return files;
}

function processHtml(content) {
    const lines = content.split("\n");
    const result = [];
    let i = 0;
    let changes = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trimEnd();
        const lineContent = trimmed.trimStart();
        const indent = trimmed.slice(0, trimmed.length - lineContent.length);

        if (lineContent && !lineContent.startsWith("<!--") && !BLOCK_TAGS.test(lineContent)) {
            // Lookahead: collect consecutive inline-able lines at same indent
            const run = [lineContent];
            let j = i + 1;
            let hasInlineTag = INLINE_TAGS.test(lineContent);

            while (j < lines.length) {
                const nextTrimmed = lines[j].trimEnd();
                const nextContent = nextTrimmed.trimStart();
                const nextIndent = nextTrimmed.slice(0, nextTrimmed.length - nextContent.length);

                if (
                    nextIndent === indent &&
                    nextContent &&
                    !nextContent.startsWith("<!--") &&
                    !BLOCK_TAGS.test(nextContent)
                ) {
                    run.push(nextContent);
                    if (INLINE_TAGS.test(nextContent)) hasInlineTag = true;
                    j++;
                } else {
                    break;
                }
            }

            if (run.length > 1 && hasInlineTag) {
                result.push(indent + run.join(" "));
                changes += run.length - 1;
                i = j;
            } else {
                result.push(trimmed);
                i++;
            }
        } else {
            result.push(trimmed);
            i++;
        }
    }

    let collapsed = result.join("\n");

    // Fix space between closing inline tag and punctuation: </a> . → </a>.
    const before = collapsed;
    collapsed = collapsed.replace(/<\/\w+> ([.,;:!?)]+)/g, (match, punct) => match.slice(0, -punct.length - 1) + punct);
    const punctFixes = (before.match(/<\/\w+> [.,;:!?)]+/g) || []).length;

    return { content: collapsed, changes, punctFixes };
}

const srcDir = join(process.cwd(), "src");
const htmlFiles = findHtmlFiles(srcDir);

let totalFiles = 0;
let totalChanges = 0;

for (const file of htmlFiles) {
    const original = readFileSync(file, "utf8");
    const { content, changes, punctFixes } = processHtml(original);

    if (changes > 0 || punctFixes > 0) {
        writeFileSync(file, content, "utf8");
        const rel = file.replace(process.cwd() + "\\", "").replace(process.cwd() + "/", "");
        const parts = [];
        if (changes > 0) parts.push(`${changes} lines collapsed`);
        if (punctFixes > 0) parts.push(`${punctFixes} punct fixes`);
        console.log(`${rel}: ${parts.join(", ")}`);
        totalFiles++;
        totalChanges += changes;
    }
}

console.log(`\nDone: ${totalFiles} files, ${totalChanges} lines collapsed`);
