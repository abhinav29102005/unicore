with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'r') as f:
    text = f.read()

auth_latex = """
\\vspace{0.5cm}
\\begin{figure}[h!]
    \\centering
    \\includegraphics[width=0.4\\textwidth]{auth_sequence.png}
    \\caption{Authentication \& Microservices Flow Diagram}
    \\label{fig:auth}
\\end{figure}
\\vspace{0.5cm}
"""

er_latex = """
\\vspace{0.5cm}
\\begin{figure}[h!]
    \\centering
    \\includegraphics[width=0.45\\textwidth]{er_diagram.png}
    \\caption{UniCore Normalized ER Diagram (BCNF)}
    \\label{fig:er}
\\end{figure}
\\vspace{0.5cm}
"""

cicd_latex = """
\\vspace{0.5cm}
\\begin{figure}[h!]
    \\centering
    \\includegraphics[width=0.45\\textwidth]{cicd_flow.png}
    \\caption{CI/CD Deployment Pipeline via GitHub Actions}
    \\label{fig:cicd}
\\end{figure}
\\vspace{0.5cm}
"""

text = text.replace('\\section{Backend \\& API Microservices}', '\\section{Backend \\& API Microservices}\n' + auth_latex)
text = text.replace('\\section{The Core Database: Database Design \\& Normalization}', '\\section{The Core Database: Database Design \\& Normalization}\n' + er_latex)
text = text.replace('\\section{Deployment \\& CI/CD DevOps Pipelines}', '\\section{Deployment \\& CI/CD DevOps Pipelines}\n' + cicd_latex)

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'w') as f:
    f.write(text)
