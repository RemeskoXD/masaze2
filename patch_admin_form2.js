import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const regex = /<div className="space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*\{rescheduleModalReservation && \(/g;

const newHTML = `<div className="space-y-4">
                        <div>
                            <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Hodnota na poukazu</label>
                            <input 
                                type="text"
                                placeholder="např. 1000 Kč nebo Relaxační masáž"
                                className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                value={newVoucher.summary}
                                onChange={e => setNewVoucher({...newVoucher, summary: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Pro koho (Jméno obdarovaného)</label>
                            <input 
                                type="text"
                                className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                value={newVoucher.recipientName}
                                onChange={e => setNewVoucher({...newVoucher, recipientName: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Jedinečný kód</label>
                            <input 
                                type="text"
                                placeholder="Pokud nevyplníte, vygeneruje se automaticky"
                                className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition font-mono uppercase"
                                value={newVoucher.voucherCode}
                                onChange={e => setNewVoucher({...newVoucher, voucherCode: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-2 block">Platnost do</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <button 
                                    className="px-3 py-1.5 text-xs bg-black/30 hover:bg-gold/20 text-gray-300 hover:text-gold border border-gray-600 hover:border-gold/50 rounded-lg transition"
                                    onClick={() => {
                                        const d = new Date(); d.setFullYear(d.getFullYear() + 1);
                                        setNewVoucher({...newVoucher, validUntil: d.toISOString().split('T')[0]});
                                    }}
                                >+ 1 Rok</button>
                                <button 
                                    className="px-3 py-1.5 text-xs bg-black/30 hover:bg-gold/20 text-gray-300 hover:text-gold border border-gray-600 hover:border-gold/50 rounded-lg transition"
                                    onClick={() => {
                                        const d = new Date(); d.setFullYear(d.getFullYear() + 2);
                                        setNewVoucher({...newVoucher, validUntil: d.toISOString().split('T')[0]});
                                    }}
                                >+ 2 Roky</button>
                                <button 
                                    className="px-3 py-1.5 text-xs bg-black/30 hover:bg-gold/20 text-gray-300 hover:text-gold border border-gray-600 hover:border-gold/50 rounded-lg transition"
                                    onClick={() => {
                                        const d = new Date(); d.setFullYear(d.getFullYear() + 3);
                                        setNewVoucher({...newVoucher, validUntil: d.toISOString().split('T')[0]});
                                    }}
                                >+ 3 Roky</button>
                            </div>
                            <input 
                                type="text"
                                placeholder="např. 31.12.2025 nebo 2025-12-31"
                                className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none transition"
                                value={newVoucher.validUntil}
                                onChange={e => setNewVoucher({...newVoucher, validUntil: e.target.value})}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Lze vybrat z rychlého menu nebo napsat ručně libovolný text.</p>
                        </div>
                        
                        <button 
                            onClick={createManualVoucher}
                            className="w-full bg-gold hover:bg-[#b08d20] text-deep-green font-bold py-3.5 rounded-xl mt-4 shadow-lg transition"
                        >
                            Vygenerovat a zobrazit k tisku
                        </button>
                    </div>
                </div>
            </div>
          )}
          {rescheduleModalReservation && (`;

code = code.replace(regex, newHTML);
fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched modal form');
