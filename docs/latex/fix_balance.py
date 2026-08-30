import re

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'r') as f:
    text = f.read()

# Revert to 11pt
text = text.replace(r'\documentclass[12pt,a4paper]{article}', r'\documentclass[11pt,a4paper]{article}')

# Fix the abstract
old_abstract_pattern = r'\\begin\{abstract\}.*?\\end\{abstract\}'
balanced_abstract = r"""\begin{abstract}
\noindent UniCore represents a paradigm shift in institutional infrastructure, evolving beyond a mere database management system into a holistic \textbf{Unified Campus Infrastructure}. 

\vspace{0.5cm}
This research proposal delineates the end-to-end architectural integrity of UniCore. At its core lies a strictly normalized (BCNF) PostgreSQL cluster across 8 domain schemas. This data layer guarantees absolute ACID transaction safety during catastrophic concurrent enrollment spikes by utilizing row-level locking (\texttt{SELECT FOR UPDATE}) and immutable JSON audit ledgers. 

\vspace{0.5cm}
Building upon this foundation is a robust Microservices API Backend (Node.js/Express) that acts as the primary gateway, providing secure JWT-based stateless routing. The client interface is driven by a highly dynamic, component-based Frontend built with React, Vite, and Tailwind CSS. This combination delivers a highly responsive, accessible (WCAG 2.1), and visually profound web design tailored for 30,000+ active students. 

\vspace{0.5cm}
Finally, the system's operational continuity is maintained via automated CI/CD deployment pipelines utilizing GitHub Actions. Furthermore, this proposal explores the deep ethical implications, algorithmic inclusivity, and rigorous project management frameworks ensuring the timely delivery of this monumental infrastructure. 

\vspace{0.5cm}
By targeting a Time-To-Acknowledgement (TTA) of $\le 2$ hours, UniCore aims to completely redefine campus operational efficiency.
\end{abstract}"""

text = re.sub(old_abstract_pattern, balanced_abstract, text, flags=re.DOTALL)

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'w') as f:
    f.write(text)

print("Done")
