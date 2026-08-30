import re

with open('docs/hub/tailwind.config.js', 'r') as f:
    tw_config = f.read()

if "darkMode:" not in tw_config:
    tw_config = tw_config.replace('theme: {', "darkMode: 'class',\n  theme: {")
    with open('docs/hub/tailwind.config.js', 'w') as f:
        f.write(tw_config)

with open('docs/hub/src/index.css', 'r') as f:
    css = f.read()

# Replace .light-theme with .dark and swap colors
# Actually, the user wants both modes to work.
# Currently index.css has :root (dark) and .light-theme (light).
# Let's change :root to be Light, and .dark to be Dark.
# So we swap the blocks!
import re

css = """@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --border-color: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #475569;
  --accent-primary: #dc2626;
  --accent-cyan: #ef4444;
  --accent-emerald: #b91c1c;
}

.dark {
  --bg-primary: #0a0d14;
  --bg-secondary: #121722;
  --bg-card: rgba(18, 23, 34, 0.88);
  --border-color: rgba(38, 48, 68, 0.7);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent-primary: #dc2626;
  --accent-cyan: #ef4444;
  --accent-emerald: #b91c1c;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-main);
  transition: background-color 0.3s ease, color 0.3s ease;
}

code, pre {
  font-family: 'Fira Code', monospace;
}

h1, h2, h3, h4, .font-heading {
  font-family: 'Outfit', sans-serif;
}

/* Glassmorphism & UI Panels */
.glass-panel {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
}

.glass-nav {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e2e8f0;
}

.dark .glass-nav {
  background: rgba(10, 13, 20, 0.9);
  border-bottom: 1px solid var(--border-color);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #273042;
}
::-webkit-scrollbar-thumb:hover {
  background: #3b475e;
}

/* Print stylesheet */
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
  .glass-panel {
    border: 1px solid #ccc !important;
    background: none !important;
    box-shadow: none !important;
  }
}
"""
with open('docs/hub/src/index.css', 'w') as f:
    f.write(css)

with open('docs/hub/src/App.jsx', 'r') as f:
    content = f.read()

# Replace light-theme string with dark
content = content.replace("isDarkTheme ? '' : 'light-theme'", "isDarkTheme ? 'dark' : ''")

# Replace slates with dark mode variations
replacements = {
    r'bg-slate-900/80': 'bg-slate-100 dark:bg-slate-900/80',
    r'bg-slate-900/60': 'bg-slate-100 dark:bg-slate-900/60',
    r'bg-slate-900/50': 'bg-slate-100 dark:bg-slate-900/50',
    r'from-slate-900': 'from-slate-100 dark:from-slate-900',
    r'via-slate-900': 'via-slate-100 dark:via-slate-900',
    r'bg-slate-950': 'bg-slate-200 dark:bg-slate-950',
    r'bg-slate-800': 'bg-slate-200 dark:bg-slate-800',
    r'bg-slate-700': 'bg-slate-300 dark:bg-slate-700',
    r'hover:bg-slate-700': 'hover:bg-slate-300 dark:hover:bg-slate-700',
    r'border-slate-700': 'border-slate-300 dark:border-slate-700',
    r'text-slate-100': 'text-slate-900 dark:text-slate-100',
    r'text-slate-200': 'text-slate-800 dark:text-slate-200',
    r'text-slate-300': 'text-slate-700 dark:text-slate-300',
    r'text-slate-400': 'text-slate-600 dark:text-slate-400',
    r'text-slate-500': 'text-slate-600 dark:text-slate-500',
    r'to-amber-950/10': 'to-red-100 dark:to-red-950/10'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('docs/hub/src/App.jsx', 'w') as f:
    f.write(content)

print("Theme fixed.")
