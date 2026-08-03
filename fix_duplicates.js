const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');

const startTag = '<div class="partners__track">';
const endTag = '</section>';
const start = html.indexOf(startTag);
const end = html.indexOf(endTag, start);

const trackContent = html.substring(start + startTag.length, end);

// Split by <div class="partner-logo">
const parts = trackContent.split(/(<div class="partner-logo">[\s\S]*?<\/div>)/);

const seen = new Set();
const newParts = [];
let duplicatesFound = 0;

for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('<div class="partner-logo">')) {
        const srcMatch = part.match(/src="([^"]+)"/);
        if (srcMatch) {
            const src = srcMatch[1];
            if (!seen.has(src)) {
                seen.add(src);
                newParts.push(part);
            } else {
                duplicatesFound++;
            }
        } else {
            newParts.push(part);
        }
    } else {
        newParts.push(part);
    }
}

if (duplicatesFound > 0) {
    const newTrackContent = newParts.join('');
    const newHtml = html.substring(0, start + startTag.length) + newTrackContent + html.substring(end);
    fs.writeFileSync('index.html', newHtml, 'utf-8');
    console.log(`Fixed! Removed ${duplicatesFound} duplicate nodes.`);
} else {
    console.log("No duplicates found.");
}
