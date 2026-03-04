import os

filepath = 'c:/Users/Eduardo/Downloads/conti-comigo-main/conti-comigo-main/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Deepen background colors for a more premium AMOLED black
content = content.replace('bg-[#020617]', 'bg-[#030303]')
content = content.replace('bg-[#0a0f25]', 'bg-[#050505]')
content = content.replace('class="bg-slate-50 text-gray-900 loading"', 'class="bg-[#030303] text-gray-200 loading antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"')

# Enhance Glassmorphism
content = content.replace('bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl', 'bg-white/[0.02] border border-white/[0.08] p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-white/[0.12]')
content = content.replace('bg-blue-600/10 border border-blue-500/30', 'bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-700 hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-[0_40px_80px_rgba(37,99,235,0.2)]')
content = content.replace('bg-blue-600/20 border border-blue-500/50 p-8 rounded-2xl backdrop-blur-sm', 'bg-gradient-to-br from-blue-600/15 to-blue-900/10 border border-blue-500/30 p-10 rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-blue-400/50 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] hover:-translate-y-1')
content = content.replace('bg-white/5 border border-white/10 p-6 rounded-2xl', 'bg-white/[0.03] border border-white/[0.05] p-8 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1]')
content = content.replace('bg-blue-600/30 border border-blue-500/50 p-6 rounded-2xl', 'bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-l-blue-500 border-y border-r border-y-white/[0.05] border-r-white/[0.05] p-8 rounded-r-3xl rounded-l-md backdrop-blur-xl transition-all duration-500 hover:-translate-y-1')

# Refine Typography for Headers
content = content.replace('text-4xl md:text-6xl font-thin text-white leading-tight tracking-tighter uppercase italic', 'text-5xl md:text-7xl font-extralight text-white leading-[1.1] tracking-tighter uppercase italic drop-shadow-xl')
content = content.replace('text-3xl md:text-5xl font-extralight text-white leading-tight tracking-tighter uppercase italic', 'text-4xl md:text-6xl font-extralight text-white leading-[1.1] tracking-tighter uppercase italic drop-shadow-xl')

# Improve Image styling
content = content.replace('w-full rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700', 'w-full rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.7)] grayscale hover:grayscale-0 transition-all duration-1000 hover:scale-[1.03] ring-1 ring-white/10 hover:ring-white/20')

# Hero text enhancements
content = content.replace('text-6xl lg:text-8xl font-thin text-white lg:text-gray-900', 'text-7xl lg:text-9xl font-thin text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]')
content = content.replace('text-[12px] lg:text-sm text-gray-100 lg:text-gray-800 tracking-[0.38em] lg:tracking-[0.45em]', 'text-xs lg:text-base text-gray-200 tracking-[0.4em] lg:tracking-[0.55em] drop-shadow-md')

# Dark Header Menu replaces cream style
content = content.replace('bg-white z-40', 'bg-[#030303]/95 backdrop-blur-3xl border-l border-white/10 z-40')
content = content.replace('text-gray-800 hover:text-blue-600', 'text-white hover:text-blue-400')
content = content.replace('text-gray-600', 'text-gray-300')
content = content.replace('class="hamburger-line block w-6 h-0.5 bg-gray-800', 'class="hamburger-line block w-6 h-0.5 bg-white')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

filepath_css = 'c:/Users/Eduardo/Downloads/conti-comigo-main/conti-comigo-main/cinema-animation.css'
with open(filepath_css, 'r', encoding='utf-8') as f:
    css_content = f.read()

css_content = css_content.replace('background: #fdfcf0ee !important;', 'background: rgba(10, 10, 10, 0.4) !important;')
css_content = css_content.replace('color: #1a1a1a !important;', 'color: #ffffff !important;')
css_content = css_content.replace('color: #4a4a4a !important;', 'color: #e2e8f0 !important;')
css_content = css_content.replace('background-color: #1a1a1a !important;', 'background-color: #ffffff !important;')
css_content = css_content.replace('border: 1px solid rgba(0, 0, 0, 0.05) !important;', 'border: 1px solid rgba(255, 255, 255, 0.1) !important;')
css_content = css_content.replace('box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;', 'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;')
css_content = css_content.replace('background: #020617;', 'background: #030303;')
css_content = css_content.replace('color: #0f172a;', 'color: #ffffff;')
css_content = css_content.replace('color: #475569;', 'color: rgba(255, 255, 255, 0.6);')
css_content = css_content.replace('background: rgba(15, 23, 42, 0.9);', 'background: rgba(5, 5, 5, 0.6);')
css_content = css_content.replace('background: rgba(15, 23, 42, 0.95);', 'background: rgba(5, 5, 5, 0.85);')
css_content = css_content.replace('backdrop-filter: blur(25px);', 'backdrop-filter: blur(35px); border: 1px solid rgba(255,255,255,0.06);')

with open(filepath_css, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("done")
