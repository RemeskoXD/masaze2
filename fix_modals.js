import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const regex = /Termín: <strong className="text-white">\{new Date\(cancelModalReservation\.date\)\.toLocaleDateString\('cs-CZ'\)\} v \{cancelModalReservation\.time\}<\/strong>\n\s*<\/p>\n\s*<div className="space-y-4">[\s\S]*?\{rescheduleModalReservation && \(/;

const replacement = `Termín: <strong className="text-white">{new Date(cancelModalReservation.date).toLocaleDateString('cs-CZ')} v {cancelModalReservation.time}</strong>
                </p>
                <div className="space-y-4">
                  <textarea
                      placeholder="Důvod zrušení (odesílá se klientovi)..."
                      className="w-full bg-black/20 text-white p-3 rounded-xl border border-gray-600 focus:border-gold outline-none min-h-[100px] text-sm"
                      onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCancelModalReservation(null)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded py-2 text-sm transition"
                    >
                      Zpět
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                          updateReservationStatus(cancelModalReservation.id, 'cancelled', cancelReason);
                          setCancelModalReservation(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded py-2 text-sm font-semibold transition"
                    >
                      Potvrdit zrušení
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          {showVoucherModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowVoucherModal(false)}>
                <div className="bg-[#0a2f1c] border border-gold/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition" onClick={() => setShowVoucherModal(false)}>
                        <X size={20} />
                    </div>
                    <h4 className="text-xl text-white font-serif mb-4 flex items-center gap-2">
                        <Gift className="text-gold" size={24} /> Vytvořit nový poukaz (ručně)
                    </h4>
                    <div className="space-y-4">
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
          {rescheduleModalReservation && (`

code = code.replace(regex, replacement);
fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('fixed modals');
