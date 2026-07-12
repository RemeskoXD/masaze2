import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf-8');

const regexValidity = /\.text-validity \{\s*top: 80%;\s*left: 20%;/g;
code = code.replace(regexValidity, '.text-validity {\n                  bottom: 5%;\n                  left: 20%;');

const regexPrint = /@media print \{\s*@page \{ size: A4 landscape; margin: 0; \}\s*body \{ background: white; padding: 0; align-items: flex-start; justify-content: flex-start; \}/g;
code = code.replace(regexPrint, `@media print {
                  @page { size: A4 landscape; margin: 0; }
                  body { background: white; padding: 0; align-items: flex-start; justify-content: flex-start; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  .print-area { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`);

fs.writeFileSync('server.ts', code);
console.log('patched server print template');
