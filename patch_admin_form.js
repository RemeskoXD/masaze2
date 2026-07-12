import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

// Update state initialization
code = code.replace(
  /voucherCode: ''\n  \}\);/,
  `voucherCode: '',
      validUntil: ''
  });`
);

// Update reset on success
code = code.replace(
  /setNewVoucher\(\{ type: 'value', value: '', service: '', summary: '', recipientName: '', senderName: 'Tereza Rozkošná', note: '', voucherCode: '' \}\);/,
  `setNewVoucher({ type: 'value', value: '', service: '', summary: '', recipientName: '', senderName: 'Tereza Rozkošná', note: '', voucherCode: '', validUntil: '' });`
);

// Add input field in the JSX
const newFieldHtml = `
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2">Platnost do</label>
                            <input 
                                type="date"
                                value={newVoucher.validUntil}
                                onChange={e => setNewVoucher({...newVoucher, validUntil: e.target.value})}
                                className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-gold outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Nevyplněno = platí 6 měsíců od vydání</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2">Vlastní text (Hodnota / Služba na poukazu)</label>`;

code = code.replace(
  /<div className="mb-4">\s*<label className="block text-gray-400 text-sm font-bold mb-2">Vlastní text \(Hodnota \/ Služba na poukazu\)<\/label>/,
  newFieldHtml
);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched admin panel');
