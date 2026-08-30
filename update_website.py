import re

# Update App.jsx
with open('docs/hub/src/App.jsx', 'r') as f:
    content = f.read()

# 1. Replace tailwind color classes with red
color_prefixes = ['indigo', 'purple', 'cyan', 'emerald', 'amber', 'yellow']
for color in color_prefixes:
    content = re.sub(rf'{color}-([1-9]00)', r'red-\1', content)

# 2. Change dark theme default to false (white theme)
content = content.replace("const [isDarkTheme, setIsDarkTheme] = useState(true);", "const [isDarkTheme, setIsDarkTheme] = useState(false);")

# 3. Remove confusive tabs
start_str = '{/* Center: Stage Document Selector Tabs */}'
end_str = '{/* Right Controls */}'
start_idx = content.find(start_str)
end_idx = content.find(end_str)
if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open('docs/hub/src/App.jsx', 'w') as f:
    f.write(content)

# Update index.css
with open('docs/hub/src/index.css', 'r') as f:
    css = f.read()

css = re.sub(r'--accent-primary: #[0-9a-fA-F]+;', '--accent-primary: #dc2626;', css)
css = re.sub(r'--accent-cyan: #[0-9a-fA-F]+;', '--accent-cyan: #ef4444;', css)
css = re.sub(r'--accent-emerald: #[0-9a-fA-F]+;', '--accent-emerald: #b91c1c;', css)

with open('docs/hub/src/index.css', 'w') as f:
    f.write(css)

print("Website code updated.")
