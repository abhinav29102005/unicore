import re

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'r') as f:
    text = f.read()

# Change font to 12pt globally
text = text.replace(r'\documentclass[11pt,a4paper]{article}', r'\documentclass[12pt,a4paper]{article}')

# Make the abstract text \large and space it out
abstract_match = re.search(r'(\\begin\{abstract\})(.*?)(\\end\{abstract\})', text, flags=re.DOTALL)
if abstract_match:
    abstract_content = abstract_match.group(2)
    # Split paragraphs by blank lines
    paragraphs = re.split(r'\n\s*\n', abstract_content.strip())
    
    new_abstract = r"\begin{abstract}" + "\n\\large\\vspace{1cm}\n"
    for i, p in enumerate(paragraphs):
        new_abstract += p + "\n\n" + (r"\vspace{1cm}" + "\n\n" if i < len(paragraphs) - 1 else "")
    new_abstract += r"\vfill" + "\n\end{abstract}"
    
    text = text.replace(abstract_match.group(0), new_abstract)

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'w') as f:
    f.write(text)

print("Done")
