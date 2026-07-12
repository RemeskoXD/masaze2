import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');
code = code.replace(/import VoucherPrintView from '\.\/VoucherPrintView';\n/, '');
code = code.replace(/\{printVoucher && \([\s\S]*?<VoucherPrintView voucher=\{printVoucher\} onClose=\{.*\} \/>\n\s*\)\}\n\s*/, '');
fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('cleaned admin');
