import re
import os

# 1. Update index.html
with open('docs/hub/index.html', 'r') as f:
    html = f.read()

html = html.replace('class="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white"', 'class="antialiased selection:bg-blue-500 selection:text-white"')
with open('docs/hub/index.html', 'w') as f:
    f.write(html)

# 2. Update App.jsx
with open('docs/hub/src/App.jsx', 'r') as f:
    app = f.read()

# Add useEffect import
app = app.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

# Add useEffect for dark mode
effect_code = """
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const currentDoc = DOCUMENTS_DATA[activeDoc];
"""
app = app.replace("const currentDoc = DOCUMENTS_DATA[activeDoc];", effect_code)

# Remove old dark class from the root div
app = app.replace("isDarkTheme ? 'dark' : ''", "''")

# Update Logo text - remove Documentation Hub and Operating Platform
app = app.replace('<span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-red-400 border border-red-500/20">\n                Documentation Hub\n              </span>', '')
app = app.replace('<p className="text-[11px] text-[var(--text-muted)]">TIET Campus Operating Platform</p>', '')

# Make UniCore larger
app = app.replace('<span className="font-extrabold text-lg tracking-tight font-heading bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-300 to-red-400">\n                UniCore\n              </span>', '<span className="font-extrabold text-2xl tracking-tight font-heading bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600">\n                UniCore\n              </span>')

# Update DOCUMENT_DATA subtitles and titles
app = app.replace('subtitle: "Centralized Campus Operating Platform & High-Concurrency Transaction Layer"', 'subtitle: "High-Concurrency Transaction Layer"')
app = app.replace('UniCore: Centralized Campus Operating Platform & High-Concurrency Transaction Layer', 'UniCore: High-Concurrency Transaction Layer')
app = app.replace('# PROJECT PROPOSAL: UniCore (Campus Operating Platform)', '# PROJECT PROPOSAL: UniCore')
app = app.replace('UniCore (Campus Operating Platform)', 'UniCore')
app = app.replace('TIET Campus Operating Platform', 'TIET Project Proposal')
app = app.replace('Centralized Campus Operating Platform', 'Centralized System')

with open('docs/hub/src/App.jsx', 'w') as f:
    f.write(app)

# 3. Update LaTeX file
tex_path = 'docs/latex/research_proposal/research_proposal.tex'
if os.path.exists(tex_path):
    with open(tex_path, 'r') as f:
        tex = f.read()
    
    tex = tex.replace('UniCore: Centralized Campus Operating Platform \\& High-Concurrency Transaction Layer', 'UniCore: High-Concurrency Transaction Layer')
    tex = tex.replace('Centralized Campus Operating Platform', 'Centralized System')
    
    with open(tex_path, 'w') as f:
        f.write(tex)

print("Update script executed.")
