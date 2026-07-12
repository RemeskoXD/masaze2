import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const payloadRegex = /const payload = \{\s*type: newVoucher\.type,\s*value: newVoucher\.type === 'value' \? parseInt\(newVoucher\.value\) \|\| 0 : 0,\s*service: newVoucher\.type === 'service' \? newVoucher\.service : '',\s*summary: newVoucher\.summary \|\| \(newVoucher\.type === 'value' \? \`Poukaz v hodnotě \$\{newVoucher\.value\} Kč\` : newVoucher\.service\),\s*recipientName: newVoucher\.recipientName,\s*senderName: newVoucher\.senderName,\s*note: newVoucher\.note,\s*amount: newVoucher\.type === 'value' \? parseInt\(newVoucher\.value\) \|\| 0 : 0,\s*code: newVoucher\.voucherCode\.trim\(\),\s*validUntil: newVoucher\.validUntil\s*\};/;

const newPayload = `const payload = {
              type: newVoucher.type,
              value: newVoucher.type === 'value' ? parseInt(newVoucher.value) || 0 : 0,
              service: newVoucher.type === 'service' ? newVoucher.service : '',
              summary: newVoucher.summary || 'Dárkový poukaz',
              recipientName: newVoucher.recipientName,
              senderName: newVoucher.senderName,
              note: newVoucher.note,
              amount: newVoucher.type === 'value' ? parseInt(newVoucher.value) || 0 : 0,
              code: newVoucher.voucherCode.trim(),
              validUntil: newVoucher.validUntil
          };`;

code = code.replace(payloadRegex, newPayload);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched payload');
