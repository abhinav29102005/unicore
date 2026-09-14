const fs = require('fs');

const prototypeTex = fs.readFileSync('../docs/latex/prototype_proposal/prototype_proposal.tex', 'utf8').replace(/`/g, '\\`').replace(/\$/g, '\\$');
const finalReportTex = fs.readFileSync('../docs/latex/final_report/final_report.tex', 'utf8').replace(/`/g, '\\`').replace(/\$/g, '\\$');

let content = fs.readFileSync('src/pages/Docs.tsx', 'utf8');

content = content.replace(/stage: "Stage 2",\s*status: "Coming Soon",\s*display: false,/g, 'stage: "Stage 2",\n    status: "Active",\n    display: true,');
content = content.replace(/stage: "Stage 3",\s*status: "Coming Soon",\s*display: false,/g, 'stage: "Stage 3",\n    status: "Active",\n    display: true,');

content = content.replace(
  'const RAW_LATEX_CONTENT = {\n  project_proposal: `',
  `const RAW_LATEX_CONTENT = {
  prototype_proposal: \`${prototypeTex}\`,
  final_report: \`${finalReportTex}\`,
  project_proposal: \``
);

content = content.replace(
  /<span className="font-bold text-\[var\(--text-color\)\] text-sm font-mono">PROJECT_PROPOSAL\.md<\/span>/g,
  '<span className="font-bold text-[var(--text-color)] text-sm font-mono">{DOCUMENTS_DATA[docId].markdownFile}</span>'
);
content = content.replace(
  /<span className="font-bold text-\[var\(--text-color\)\] text-sm font-mono">project_proposal\.tex<\/span>/g,
  '<span className="font-bold text-[var(--text-color)] text-sm font-mono">{DOCUMENTS_DATA[docId].latexFile}</span>'
);

content = content.replace(
  /<h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight leading-snug">\s*UniCore: High-Concurrency Transaction Layer\s*<\/h1>/g,
  '<h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight leading-snug">\n            {DOCUMENTS_DATA[docId].title}\n          </h1>'
);
content = content.replace(
  /<h1 className="text-2xl font-extrabold font-heading">\s*UniCore: High-Concurrency Transaction Layer\s*<\/h1>/g,
  '<h1 className="text-2xl font-extrabold font-heading">\n            {DOCUMENTS_DATA[docId].title}\n          </h1>'
);

content = content.replace(
  '{/* MARKDOWN OR LATEX VIEW MODES */}',
  `{/* MARKDOWN OR LATEX VIEW MODES */}
              {viewFormat === 'rendered' && activeDoc !== 'project_proposal' ? (
                <div className="space-y-6">
                  <div className="bg-[var(--bg-color)] border border-[var(--border-color)] shadow-sm p-4 rounded-xl">
                    <h3 className="text-lg font-bold text-[var(--text-color)] mb-2">Interactive View Not Yet Available</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4">The interactive HTML view for this document is still being compiled. In the meantime, you can read the compiled PDF below.</p>
                  </div>
                  <PDFViewer pdfUrl={currentDoc.pdfFile} filename={currentDoc.pdfFileName} />
                </div>
              ) : ''}`
);

content = content.replace(
  '<div className="bg-[var(--bg-color)] border border-[var(--border-color)] shadow-sm p-8 sm:p-12 rounded-3xl space-y-12 text-[var(--text-color)] leading-relaxed">',
  '{activeDoc === \'project_proposal\' && <div className="bg-[var(--bg-color)] border border-[var(--border-color)] shadow-sm p-8 sm:p-12 rounded-3xl space-y-12 text-[var(--text-color)] leading-relaxed">'
);
content = content.replace(
  '{/* End of Paper */}\n      </div>',
  '{/* End of Paper */}\n      </div>}'
);

fs.writeFileSync('src/pages/Docs.tsx', content);
