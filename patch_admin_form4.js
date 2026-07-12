import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

// Fix the payload for createManualVoucher
code = code.replace(
  /const payload = \{\s*type: 'manual',[\s\S]*?validUntil: newVoucher\.validUntil\s*\};/,
  `const payload = {
              type: newVoucher.type,
              value: newVoucher.type === 'value' ? parseInt(newVoucher.value) || 0 : 0,
              service: newVoucher.type === 'service' ? newVoucher.service : '',
              summary: newVoucher.summary || (newVoucher.type === 'value' ? \`Poukaz v hodnotě \${newVoucher.value} Kč\` : newVoucher.service),
              recipientName: newVoucher.recipientName,
              senderName: newVoucher.senderName,
              note: newVoucher.note,
              amount: newVoucher.type === 'value' ? parseInt(newVoucher.value) || 0 : 0,
              code: newVoucher.voucherCode.trim(),
              validUntil: newVoucher.validUntil
          };`
);

// Fix the UI for voucher generation
const oldUI = `<div>
                            <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Hodnota na poukazu</label>
                            <input 
                                type="text"
                                placeholder="např. 1000 Kč nebo Relaxační masáž"
                                className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                value={newVoucher.summary}
                                onChange={e => setNewVoucher({...newVoucher, summary: e.target.value})}
                            />
                        </div>`;

const newUI = `<div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Typ poukazu</label>
                                <select 
                                    className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                    value={newVoucher.type}
                                    onChange={e => setNewVoucher({...newVoucher, type: e.target.value})}
                                >
                                    <option value="value">Hodnotový (Kč)</option>
                                    <option value="service">Na konkrétní službu</option>
                                </select>
                            </div>
                            {newVoucher.type === 'value' ? (
                                <div>
                                    <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Hodnota (Kč)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                        value={newVoucher.value}
                                        onChange={e => setNewVoucher({...newVoucher, value: e.target.value})}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Název služby</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                        value={newVoucher.service}
                                        onChange={e => setNewVoucher({...newVoucher, service: e.target.value})}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Zobrazovaný text na poukazu</label>
                            <input 
                                type="text"
                                placeholder="např. 1000 Kč nebo Relaxační masáž"
                                className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                value={newVoucher.summary}
                                onChange={e => setNewVoucher({...newVoucher, summary: e.target.value})}
                            />
                        </div>`;

code = code.replace(oldUI, newUI);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched voucher form');
