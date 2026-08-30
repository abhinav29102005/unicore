with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'r') as f:
    text = f.read()

architecture_latex = """
\\vspace{0.5cm}
\\begin{figure}[h!]
    \\centering
    \\includegraphics[width=0.8\\textwidth]{architecture.png}
    \\caption{UniCore System Architecture Component Diagram}
    \\label{fig:arch}
\\end{figure}
\\vspace{0.5cm}
"""

sequence_latex = """
\\vspace{0.5cm}
\\begin{figure}[h!]
    \\centering
    \\includegraphics[width=0.7\\textwidth]{sequence.png}
    \\caption{Concurrency Control - Hostel Allotment Sequence Diagram}
    \\label{fig:sequence}
\\end{figure}
\\vspace{0.5cm}
"""

text = text.replace('\\section{Frontend Architecture', architecture_latex + '\n\\section{Frontend Architecture')
text = text.replace('\\subsection{Pessimistic Row-Level Locking}', sequence_latex + '\n\\subsection{Pessimistic Row-Level Locking}')

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'w') as f:
    f.write(text)
