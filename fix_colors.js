const fs = require('fs');

const filepathCss = 'c:/Users/Eduardo/Downloads/conti-comigo-main/conti-comigo-main/cinema-animation.css';
let cssContent = fs.readFileSync(filepathCss, 'utf-8');

// I wrongly replaced #ffffff with #0f172a everywhere in cinema-animation.css
cssContent = cssContent.replace(/color: #0f172a;/g, 'color: #ffffff;');

// I wrongly replaced rgba(255, 255, 255, 0.6) with #475569
cssContent = cssContent.replace(/color: #475569;/g, 'color: rgba(255, 255, 255, 0.6);');

// The .feature-item color was also ruined in mobile because it was color: #ffffff originally 
// (which became #0f172a, now reverted back above).

fs.writeFileSync(filepathCss, cssContent, 'utf-8');
console.log("Fixed text colors.");
