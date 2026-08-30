with open('docs/hub/src/App.jsx', 'r') as f:
    content = f.read()

replacements = {
    r'bg-slate-900/40': 'bg-slate-100 dark:bg-slate-900/40',
    r'hover:bg-slate-900/20': 'hover:bg-slate-100 dark:hover:bg-slate-900/20',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('docs/hub/src/App.jsx', 'w') as f:
    f.write(content)
