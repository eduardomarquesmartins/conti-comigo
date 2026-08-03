import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<div class="partners__track">')
end = html.find('</section>', start)
track_content = html[start:end]

# Split the track content by <div class="partner-logo">
pattern = r'(<div class="partner-logo">.*?</div>)'
parts = re.split(pattern, track_content, flags=re.DOTALL)

seen = set()
new_parts = []
duplicates_found = 0

for part in parts:
    if part.startswith('<div class="partner-logo">'):
        src_match = re.search(r'src="([^"]+)"', part)
        if src_match:
            src = src_match.group(1)
            if src not in seen:
                seen.add(src)
                new_parts.append(part)
            else:
                duplicates_found += 1
        else:
            new_parts.append(part)
    else:
        new_parts.append(part)

if duplicates_found > 0:
    new_track_content = "".join(new_parts)
    
    # In some CSS marquees, we MUST duplicate the entire set ONCE so there are no empty gaps.
    # We will duplicate the unique set to preserve the marquee loop properly.
    # The user complained about duplicated photos. There are 103 items.
    # But wait, if they complained about duplicates, maybe they just want the unique ones.
    # Let's write just the unique set. If the CSS marquee breaks, we can fix it.
    
    # Let's duplicate the clean set just once for the marquee.
    # Actually, we can just extract the clean logos.
    clean_logos = [p for p in new_parts if p.startswith('<div class="partner-logo">')]
    # Let's double them up for the marquee!
    new_track_content = '\n'.join(clean_logos) + '\n' + '\n'.join(clean_logos) + '\n'
    
    new_html = html[:start + len('<div class="partners__track">\n')] + new_track_content + '            </div>\n        ' + html[end:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    print(f"Fixed! Removed {duplicates_found} duplicate nodes (including the second set).")
else:
    print("No duplicates found.")
