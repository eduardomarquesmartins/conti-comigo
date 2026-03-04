const fs = require('fs');
const path = require('path');

const filepath = 'c:/Users/Eduardo/Downloads/conti-comigo-main/conti-comigo-main/index.html';
let content = fs.readFileSync(filepath, 'utf-8');

// Undo blackening
content = content.replace(/bg-\[#030303\]/g, 'bg-[#020617]');
content = content.replace(/bg-\[#050505\]/g, 'bg-[#0a0f25]');
content = content.replace('class="bg-[#020617] text-gray-200 loading antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"', 'class="bg-slate-50 text-gray-900 loading"'); // Note: first replace changed the #030303 to #020617, so we match #020617 here. Wait! Let's just match the start.
content = content.replace(/<body class="bg-\[#0.0.0.\] text-gray-200 loading antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">/g, '<body class="bg-slate-50 text-gray-900 loading">');

// Header fixes
content = content.replace('bg-[#020617]/95 backdrop-blur-3xl border-l border-white/10 z-40', 'bg-white z-40');
content = content.replace('text-white hover:text-blue-400', 'text-gray-800 hover:text-blue-600');
content = content.replace(/text-gray-300/g, 'text-gray-600');
content = content.replace('class="hamburger-line block w-6 h-0.5 bg-white mb-1"', 'class="hamburger-line block w-6 h-0.5 bg-gray-800 mb-1"');
content = content.replace('class="hamburger-line block w-6 h-0.5 bg-white"', 'class="hamburger-line block w-6 h-0.5 bg-gray-800"');
content = content.replace('class="hamburger-line block w-6 h-0.5 bg-white mb-1"', 'class="hamburger-line block w-6 h-0.5 bg-gray-800 mb-1"'); // just to be safe

fs.writeFileSync(filepath, content, 'utf-8');

// Cinema Animation CSS fixes
const filepathCss = 'c:/Users/Eduardo/Downloads/conti-comigo-main/conti-comigo-main/cinema-animation.css';
let cssContent = fs.readFileSync(filepathCss, 'utf-8');

cssContent = cssContent.replace('background: rgba(10, 10, 10, 0.4) !important;', 'background: #fdfcf0ee !important;');
cssContent = cssContent.replace(/color: #ffffff !important;/g, 'color: #1a1a1a !important;');
cssContent = cssContent.replace(/color: #e2e8f0 !important;/g, 'color: #4a4a4a !important;');
cssContent = cssContent.replace(/background-color: #ffffff !important;/g, 'background-color: #1a1a1a !important;');
cssContent = cssContent.replace('border: 1px solid rgba(255, 255, 255, 0.1) !important;', 'border: 1px solid rgba(0, 0, 0, 0.05) !important;');
cssContent = cssContent.replace('box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;', 'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;');
cssContent = cssContent.replace(/background: #030303;/g, 'background: #020617;');
cssContent = cssContent.replace(/color: #ffffff;/g, 'color: #0f172a;');
cssContent = cssContent.replace(/color: rgba\(255, 255, 255, 0\.6\);/g, 'color: #475569;');
cssContent = cssContent.replace(/background: rgba\(5, 5, 5, 0\.6\);/g, 'background: rgba(15, 23, 42, 0.9);');
cssContent = cssContent.replace(/background: rgba\(5, 5, 5, 0\.85\);/g, 'background: rgba(15, 23, 42, 0.95);');
cssContent = cssContent.replace(/backdrop-filter: blur\(35px\); border: 1px solid rgba\(255,255,255,0\.06\);/g, 'backdrop-filter: blur(25px);');

fs.writeFileSync(filepathCss, cssContent, 'utf-8');

console.log("Restored white background and Light mode variables, keeping typography!");
