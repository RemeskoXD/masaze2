import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /<p><strong>Poznámka:<\/strong> \$\{note \|\| '-'\}.*<\/p>\n        `/;

const replacement = `<p><strong>Poznámka:</strong> \${note || '-'}</p>
          \${appliedVoucherCode ? \`<p><strong>Uplatněný poukaz:</strong> \${appliedVoucherCode}</p>\` : ''}
          <p><strong>Částka k úhradě:</strong> \${finalPrice} Kč</p>
        \``;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('server.ts', code);
    console.log('patched admin email successfully');
} else {
    console.log('failed to match regex');
}
