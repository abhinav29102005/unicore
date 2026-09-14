const fs = require('fs');
let content = fs.readFileSync('src/pages/Docs.tsx', 'utf8');

const lines = content.split('\n');
const newLines = lines.filter(line => {
  if (line.includes('prototype_proposal: `% Stage 2 Prototype Proposal`,')) return false;
  if (line.includes('final_report: `% Stage 3 Final Master Report`')) return false;
  return true;
});

fs.writeFileSync('src/pages/Docs.tsx', newLines.join('\n'));
