import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const targetStr = `                                      <input 
                                        type="text" 
                                        value={openingHours[day]?.end || ''} 
                                        onChange={(e) => updateOpeningHours(day, 'end', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none" 
                                        placeholder="00:00"
                                      />
                                  </div>`;

const newStr = `                                      <input 
                                        type="text" 
                                        value={openingHours[day]?.end || ''} 
                                        onChange={(e) => updateOpeningHours(day, 'end', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none" 
                                        placeholder="00:00"
                                      />
                                      <span className="ml-2 text-xs">Pauza:</span>
                                      <input
                                         type="text"
                                         value={openingHours[day]?.breakStart || ''}
                                         onChange={(e) => updateOpeningHours(day, 'breakStart', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none text-xs"
                                         placeholder="od"
                                      />
                                      <span>-</span>
                                      <input
                                         type="text"
                                         value={openingHours[day]?.breakEnd || ''}
                                         onChange={(e) => updateOpeningHours(day, 'breakEnd', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none text-xs"
                                         placeholder="do"
                                      />
                                  </div>`;

code = code.replace(targetStr, newStr);

// A fallback regex if exact match fails due to spaces
code = code.replace(
/placeholder="00:00"\n\s*\/>\n\s*<\/div>/g,
`placeholder="00:00"
                                      />
                                      <span className="ml-2 text-xs">Pauza:</span>
                                      <input
                                         type="text"
                                         value={openingHours[day]?.breakStart || ''}
                                         onChange={(e) => updateOpeningHours(day, 'breakStart', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none text-xs"
                                         placeholder="od"
                                      />
                                      <span>-</span>
                                      <input
                                         type="text"
                                         value={openingHours[day]?.breakEnd || ''}
                                         onChange={(e) => updateOpeningHours(day, 'breakEnd', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none text-xs"
                                         placeholder="do"
                                      />
                                  </div>`
);

const closedDatesOld = `                  <div className="pt-6 border-t border-gray-700 mt-6">
                      <h3 className="text-xl text-white mb-4">Stav serveru</h3>`;

const closedDatesNew = `                  <div className="mt-8">
                      <h4 className="text-lg text-white mb-2 font-serif">Nedostupné dny (Dovolená)</h4>
                      <p className="text-xs text-gray-400 mb-4">Vyberte datum, kdy nepracujete (zákazníci se nebudou moci objednat).</p>
                      
                      <div className="flex gap-2 mb-4 items-center">
                          <input 
                              type="date" 
                              id="addClosedDateInput"
                              className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none"
                          />
                          <button 
                              type="button"
                              onClick={() => {
                                  const input = document.getElementById('addClosedDateInput') as HTMLInputElement;
                                  if (input.value) {
                                      const newDates = closedDates ? closedDates + ',' + input.value : input.value;
                                      setClosedDates(newDates);
                                      updateSetting('closedDates', newDates);
                                      input.value = '';
                                  }
                              }}
                              className="bg-[#1a4a33] text-white px-4 py-2 rounded hover:bg-gold hover:text-deep-green transition font-medium"
                          >
                              Přidat
                          </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                          {(closedDates || '').split(',').filter(Boolean).map(date => (
                              <div key={date} className="bg-gold/20 border border-gold/40 text-gold px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                                  <span>{new Date(date).toLocaleDateString('cs-CZ')}</span>
                                  <button 
                                      onClick={() => {
                                          const newDates = closedDates.split(',').filter(d => d !== date).join(',');
                                          setClosedDates(newDates);
                                          updateSetting('closedDates', newDates);
                                      }}
                                      className="hover:text-white transition"
                                  >
                                      <X size={14} />
                                  </button>
                              </div>
                          ))}
                          {!closedDates && <span className="text-gray-500 text-sm italic">Žádné uzavřené dny.</span>}
                      </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700 mt-6">
                      <h3 className="text-xl text-white mb-4">Stav serveru</h3>`;

code = code.replace(
/<div className="pt-6 border-t border-gray-700 mt-6">\s*<h3 className="text-xl text-white mb-4">Stav serveru<\/h3>/,
closedDatesNew
);

fs.writeFileSync('components/AdminPanel.tsx', code);
