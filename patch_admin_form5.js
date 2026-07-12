import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const oldFormRegex = /<div className="grid grid-cols-2 gap-4">[\s\S]*?<label className="text-xs text-gold\/80 uppercase tracking-widest font-bold mb-2 block">Pro koho \(Jméno obdarovaného\)<\/label>/;

const newForm = `<div className="space-y-4">
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
                            <div>
                                <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Hodnota / Na co</label>
                                <input 
                                    type="text"
                                    placeholder={newVoucher.type === 'value' ? "např. 1000" : "např. Relaxační masáž zad"}
                                    className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                    value={newVoucher.summary}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (newVoucher.type === 'value') {
                                            setNewVoucher({...newVoucher, summary: val, value: val});
                                        } else {
                                            setNewVoucher({...newVoucher, summary: val, service: val});
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Pro koho (Jméno obdarovaného)</label>`;

code = code.replace(oldFormRegex, newForm);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched form fields');
