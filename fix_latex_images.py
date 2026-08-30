tex_path = 'docs/latex/research_proposal/research_proposal.tex'
with open(tex_path, 'r') as f:
    content = f.read()

if "\\graphicspath{{code/}}" not in content:
    content = content.replace("\\begin{document}", "\\usepackage{graphicx}\n\\graphicspath{{code/}}\n\\begin{document}")

with open(tex_path, 'w') as f:
    f.write(content)
