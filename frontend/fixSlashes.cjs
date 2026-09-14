const fs = require('fs');
let content = fs.readFileSync('src/pages/Docs.tsx', 'utf8');

const prototypeTex = fs.readFileSync('../docs/latex/prototype_proposal/prototype_proposal.tex', 'utf8')
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');
const finalReportTex = fs.readFileSync('../docs/latex/final_report/final_report.tex', 'utf8')
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');

const rawStart = content.indexOf('prototype_proposal: `\\documentclass');
if (rawStart !== -1) {
  const projectStart = content.indexOf('  project_proposal: `', rawStart);
  if (projectStart !== -1) {
    const toReplace = content.substring(rawStart, projectStart);
    const replacement = `prototype_proposal: \`${prototypeTex}\`,\n  final_report: \`${finalReportTex}\`,\n`;
    content = content.replace(toReplace, replacement);
    fs.writeFileSync('src/pages/Docs.tsx', content);
    console.log('Fixed LaTeX strings!');
  } else {
    console.log('Could not find project_proposal string');
  }
} else {
  console.log('Could not find prototype_proposal string');
}
