import re

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'r') as f:
    text = f.read()

# Replace "Campus Operating System" terminology
text = text.replace('Campus Operating System', 'Unified Campus Infrastructure')
text = text.replace('Operating System (OS)', 'Comprehensive Unified Infrastructure')
text = text.replace('Operating System', 'Unified Infrastructure')

# Refactoring the abstract for readability
old_abstract = r"""\begin{abstract}
\noindent UniCore represents a paradigm shift in institutional infrastructure, evolving beyond a mere database management system into a holistic \textbf{Unified Campus Infrastructure}. This research proposal delineates the end-to-end architectural integrity of UniCore. At its core lies the Database Kernel—a strictly normalized (BCNF) PostgreSQL cluster across 8 domain schemas that guarantees absolute ACID transaction safety during catastrophic concurrent enrollment spikes using row-level locking (\texttt{SELECT FOR UPDATE}) and immutable JSON audit ledgers. Building upon this kernel is a robust Microservices API Backend (Node.js/Express) that acts as the system call interface, providing secure JWT-based stateless routing. The user shell is driven by a highly dynamic, component-based Frontend built with React, Vite, and Tailwind CSS, delivering a highly responsive, accessible (WCAG 2.1), and visually profound web design for 30,000+ active students. Finally, the system's operational continuity is maintained via automated CI/CD deployment pipelines utilizing GitHub Actions. Furthermore, this proposal explores the deep ethical implications, algorithmic inclusivity, and rigorous project management frameworks ensuring the timely delivery of this monumental infrastructure. By targeting a Time-To-Acknowledgement (TTA) of $\le 2$ hours, UniCore aims to completely redefine campus operational efficiency.
\end{abstract}"""

new_abstract = r"""\begin{abstract}
\noindent UniCore represents a paradigm shift in institutional infrastructure, evolving beyond a mere database management system into a holistic \textbf{Unified Campus Infrastructure}. 

This research proposal delineates the end-to-end architectural integrity of UniCore. At its core lies a strictly normalized (BCNF) PostgreSQL cluster across 8 domain schemas. This data layer guarantees absolute ACID transaction safety during catastrophic concurrent enrollment spikes by utilizing row-level locking (\texttt{SELECT FOR UPDATE}) and immutable JSON audit ledgers. 

Building upon this foundation is a robust Microservices API Backend (Node.js/Express) that acts as the primary gateway, providing secure JWT-based stateless routing. The client interface is driven by a highly dynamic, component-based Frontend built with React, Vite, and Tailwind CSS. This combination delivers a highly responsive, accessible (WCAG 2.1), and visually profound web design tailored for 30,000+ active students. 

Finally, the system's operational continuity is maintained via automated CI/CD deployment pipelines utilizing GitHub Actions. Furthermore, this proposal explores the deep ethical implications, algorithmic inclusivity, and rigorous project management frameworks ensuring the timely delivery of this monumental infrastructure. 

By targeting a Time-To-Acknowledgement (TTA) of $\le 2$ hours, UniCore aims to completely redefine campus operational efficiency.
\end{abstract}"""

if old_abstract in text:
    text = text.replace(old_abstract, new_abstract)
else:
    # Let's just do a regex replace for the abstract block
    import re
    text = re.sub(r'\\begin\{abstract\}.*?\\end\{abstract\}', new_abstract, text, flags=re.DOTALL)

# Let's adjust "Kernel" and "User shell" terms as well to improve readability
text = text.replace('Database Kernel', 'Database Layer')
text = text.replace('User Shell', 'Client Interface')
text = text.replace('system call interface', 'primary API gateway')
text = text.replace('The Kernel', 'The Core Database')
text = text.replace('user shell', 'client interface')

# To improve readability further, increase line spacing to double spacing for better review if needed, but onehalfspacing is already there. Let's make sure text isn't cramped. We'll leave onehalfspacing.

with open('/home/bigboyaks/.gemini/antigravity-ide/brain/da434110-6bbb-460d-a7dd-40fb017328a9/scratch/research_proposal.tex', 'w') as f:
    f.write(text)

print("Done")
