with open('docs/hub/src/App.jsx', 'r') as f:
    content = f.read()

replacements = {
    r'text-red-300': 'text-red-700 dark:text-red-300',
    r'text-red-400': 'text-red-600 dark:text-red-400',
    r'bg-red-500/10': 'bg-red-100 dark:bg-red-500/10',
    r'bg-red-500/5': 'bg-red-50 dark:bg-red-500/5',
    r'bg-red-500/20': 'bg-red-100 dark:bg-red-500/20',
    r'border-red-500/20': 'border-red-200 dark:border-red-500/20',
    r'border-red-500/30': 'border-red-300 dark:border-red-500/30',
    r'text-slate-100': 'text-slate-900 dark:text-slate-100',
    r'text-slate-400': 'text-slate-600 dark:text-slate-400',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('docs/hub/src/App.jsx', 'w') as f:
    f.write(content)

print("Red text fixed.")
