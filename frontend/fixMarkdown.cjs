const fs = require('fs');
let content = fs.readFileSync('src/pages/Docs.tsx', 'utf8');

content = content.replace(
  'const RAW_MARKDOWN_CONTENT = {\n  project_proposal: `# PROJECT PROPOSAL:',
  `const RAW_MARKDOWN_CONTENT = {
  prototype_proposal: \`# PROTOTYPE PROPOSAL

This Markdown document is a placeholder for the Prototype Proposal.
Please view the **LaTeX** or **Compiled PDF** versions for the full document.\`,
  final_report: \`# FINAL TECHNICAL MASTER REPORT

This Markdown document is a placeholder for the Final Report.
Please view the **LaTeX** or **Compiled PDF** versions for the full document.\`,
  project_proposal: \`# PROJECT PROPOSAL:`
);

fs.writeFileSync('src/pages/Docs.tsx', content);
