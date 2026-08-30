import base64
import urllib.request
import os

# 1. Update App.jsx
app_path = 'docs/hub/src/App.jsx'
with open(app_path, 'r') as f:
    app_content = f.read()

app_content = app_content.replace('Express Node.js REST API', 'Tezz API Microservices')

with open(app_path, 'w') as f:
    f.write(app_content)

# 2. Update research_proposal.tex
tex_path = 'docs/latex/research_proposal/research_proposal.tex'
with open(tex_path, 'r') as f:
    tex_content = f.read()

tex_content = tex_content.replace('(Node.js/Express)', '(Tezz)')
tex_content = tex_content.replace('(Node.js Backend):', '(Tezz Backend):')
tex_content = tex_content.replace('\\subsection{Node.js and Express Framework}', '\\subsection{Tezz Language}')
tex_content = tex_content.replace(
    "The server infrastructure is built on \\textbf{Node.js} utilizing the \\textbf{Express} framework. Node.js's asynchronous, event-driven architecture is ideally suited for handling the high volume of concurrent I/O requests",
    "The server infrastructure is built on \\textbf{Tezz}, a blazing-fast, transpiled language natively executed on V8 runtimes. Tezz's asynchronous, zero-overhead architecture is ideally suited for handling the high volume of concurrent I/O requests"
)
tex_content = tex_content.replace('backend Node.js services', 'backend Tezz services')
tex_content = tex_content.replace('Node.js backend using', 'Tezz backend using')
tex_content = tex_content.replace('Node.js, Express, JWT', 'Tezz, Node.js, JWT')
tex_content = tex_content.replace('the Node.js REST API', 'the Tezz REST API')
tex_content = tex_content.replace('the robust Node.js backend', 'the robust Tezz backend')

with open(tex_path, 'w') as f:
    f.write(tex_content)

# 3. Regenerate specific Mermaid diagrams (Architecture and CICD)
def generate_mermaid(source, filename):
    encoded = base64.b64encode(source.encode('utf-8')).decode('utf-8')
    url = f"https://mermaid.ink/img/{encoded}?bgColor=FFFFFF"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as f:
                f.write(response.read())
        print(f"Successfully generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

theme_string = """%%{init: {'theme': 'base', 'themeVariables': {
    'primaryColor': '#fee2e2',
    'primaryBorderColor': '#b91c1c',
    'primaryTextColor': '#7f1d1d',
    'lineColor': '#b91c1c',
    'textColor': '#7f1d1d',
    'mainBkg': '#fee2e2',
    'nodeBorder': '#b91c1c',
    'clusterBkg': '#ffffff',
    'clusterBorder': '#b91c1c',
    'defaultLinkColor': '#b91c1c',
    'titleColor': '#7f1d1d',
    'edgeLabelBackground': '#ffffff',
    'actorBkg': '#fee2e2',
    'actorBorder': '#b91c1c',
    'actorTextColor': '#7f1d1d',
    'sequenceNumberColor': '#b91c1c',
    'labelBoxBkgColor': '#fee2e2',
    'labelBoxBorderColor': '#b91c1c',
    'labelTextColor': '#7f1d1d',
    'signalColor': '#b91c1c',
    'signalTextColor': '#7f1d1d',
    'noteBkgColor': '#fee2e2',
    'noteTextColor': '#7f1d1d',
    'noteBorderColor': '#b91c1c',
    'activationBorderColor': '#b91c1c',
    'activationBkgColor': '#fee2e2'
}}}%%
"""

architecture_source = theme_string + """
graph TD
    subgraph Client Interface
        UI[React/Vite Web App]
    end

    subgraph Primary API Gateway
        API[Tezz Microservices]
        Auth[Auth Middleware JWT]
    end

    subgraph Data Layer PostgreSQL
        DB[(UniCore PostgreSQL Cluster)]
    end

    UI <-->|HTTPS / JSON| API
    API -->|Validates| Auth
    Auth -->|SQL Queries| DB
    
    classDef default fill:#fee2e2,stroke:#b91c1c,stroke-width:2px,color:#7f1d1d;
"""

cicd_source = theme_string + """
graph TD
    A[Developer Pushes Code] -->|GitHub Hook| B(GitHub Actions CI)
    B --> C{Linting & Tests}
    C -->|Fails| D[Alert Team via Slack]
    C -->|Passes| E[Build Docker Images]
    E --> F[Push to Docker Registry]
    F --> G(Deploy Phase)
    G --> H[Pull Latest Image on Prod Server]
    H --> I[Run Database Migrations]
    I --> J[Restart Tezz/Node.js Containers]
    J --> K((Production Live))
    classDef default fill:#fee2e2,stroke:#b91c1c,stroke-width:2px,color:#7f1d1d;
"""

generate_mermaid(architecture_source.strip(), 'docs/latex/research_proposal/code/architecture.png')
generate_mermaid(cicd_source.strip(), 'docs/latex/research_proposal/code/cicd_flow.png')

print("Update Tezz script complete.")
