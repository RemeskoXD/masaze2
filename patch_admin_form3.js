import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  /const createManualVoucher = async \(\) => \{[\s\S]*?method: 'POST',/m,
  `const createManualVoucher = async () => {
      try {
          const payload = {
              type: 'manual',
              value: 0,
              service: '',
              summary: newVoucher.summary || 'Dárkový poukaz',
              recipientName: newVoucher.recipientName,
              senderName: newVoucher.senderName,
              note: newVoucher.note,
              amount: 0,
              code: newVoucher.voucherCode.trim(),
              validUntil: newVoucher.validUntil
          };
          
          const res = await fetch('/api/admin/voucher', {
              method: 'POST',`
);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched createManualVoucher');
