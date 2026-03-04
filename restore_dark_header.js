const fs = require('fs');

const filepath = 'c:/Users/Eduardo/Downloads/conti-comigo-main/conti-comigo-main/index.html';
let content = fs.readFileSync(filepath, 'utf-8');

// Dark Header Menu replaces cream style
content = content.replace('bg-white z-40', 'bg-[#030303]/95 backdrop-blur-3xl border-l border-white/10 z-40');
content = content.replace('text-gray-800 hover:text-blue-600', 'text-white hover:text-blue-400');
content = content.replace(/text-gray-600/g, 'text-gray-300');
content = content.replace('class="hamburger-line block w-6 h-0.5 bg-gray-800 mb-1"', 'class="hamburger-line block w-6 h-0.5 bg-white mb-1"');
content = content.replace('class="hamburger-line block w-6 h-0.5 bg-gray-800"', 'class="hamburger-line block w-6 h-0.5 bg-white"');
// just to be safe
content = content.replace('class="hamburger-line block w-6 h-0.5 bg-gray-800 mb-1"', 'class="hamburger-line block w-6 h-0.5 bg-white mb-1"');

fs.writeFileSync(filepath, content, 'utf-8');

const filepathCss = 'c:/Users/Eduardo/Downloads/conti-comigo-main/conti-comigo-main/cinema-animation.css';
let cssContent = fs.readFileSync(filepathCss, 'utf-8');

// Only affect lines around the header
cssContent = cssContent.replace('background: #fdfcf0ee !important;', 'background: rgba(10, 10, 10, 0.4) !important;');
cssContent = cssContent.replace('border: 1px solid rgba(0, 0, 0, 0.05) !important;', 'border: 1px solid rgba(255, 255, 255, 0.1) !important;');
cssContent = cssContent.replace('box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;', 'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;');

// Replace specific colors only where they are defined for the header Nav
cssContent = cssContent.replace('color: #1a1a1a !important;', 'color: #ffffff !important;');
cssContent = cssContent.replace('background-color: #1a1a1a !important;', 'background-color: #ffffff !important;');
// Second hamburger line
cssContent = cssContent.replace('background-color: #1a1a1a !important;', 'background-color: #ffffff !important;');

cssContent = cssContent.replace('color: #4a4a4a !important;', 'color: #e2e8f0 !important;');

fs.writeFileSync(filepathCss, cssContent, 'utf-8');
console.log("Restored premium dark header!");
