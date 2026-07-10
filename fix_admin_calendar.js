import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

// Update imports
code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, (match, p1) => {
    if (!p1.includes('Coffee')) {
        return `import { ${p1}, Coffee } from 'lucide-react';`;
    }
    return match;
});

// Update the Otevírací doba section
const oldStart = `                  <div>
                      <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Otevírací doba (Kalendář)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'].map((day) => (
                              <div key={day} className="bg-[#0a2f1c] p-4 rounded border border-gray-600 flex justify-between items-center">
                                  <span className="font-bold text-gray-300">{day}</span>
                                  <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-400">
                                      <Clock size={14} />
                                      <input 
                                        type="text" 
                                        value={openingHours[day]?.start || ''} 
                                        onChange={(e) => updateOpeningHours(day, 'start', e.target.value)}
                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none" 
                                        placeholder="00:00"
                                      />
                                      <span>-</span>
                                      <input 
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
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>`;

const newStart = `                  <div>
                      <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Pracovní doba a Přestávky</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'].map((day) => (
                              <div key={day} className="bg-black/30 p-5 rounded-xl border border-gray-600/50 flex flex-col gap-4 hover:border-gold/30 transition">
                                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                    <span className="font-bold text-lg text-white">{day}</span>
                                    {(!openingHours[day]?.start || !openingHours[day]?.end) && (
                                        <span className="text-xs text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded">Zavřeno</span>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-col gap-3">
                                      <div className="flex justify-between items-center">
                                          <span className="text-sm text-gray-400 flex items-center gap-2"><Clock size={14} className="text-gold"/> Pracovní</span>
                                          <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-lg border border-gray-700">
                                              <input 
                                                type="text" 
                                                value={openingHours[day]?.start || ''} 
                                                onChange={(e) => updateOpeningHours(day, 'start', e.target.value)}
                                                className="bg-transparent w-10 text-center text-white focus:outline-none focus:text-gold" 
                                                placeholder="09:00"
                                              />
                                              <span className="text-gray-500">-</span>
                                              <input 
                                                type="text" 
                                                value={openingHours[day]?.end || ''} 
                                                onChange={(e) => updateOpeningHours(day, 'end', e.target.value)}
                                                className="bg-transparent w-10 text-center text-white focus:outline-none focus:text-gold" 
                                                placeholder="18:00"
                                              />
                                          </div>
                                      </div>

                                      <div className="flex justify-between items-center">
                                          <span className="text-sm text-gray-400 flex items-center gap-2"><Coffee size={14} className="text-gold"/> Přestávka</span>
                                          <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-lg border border-gray-700">
                                              <input 
                                                type="text" 
                                                value={openingHours[day]?.breakStart || ''} 
                                                onChange={(e) => updateOpeningHours(day, 'breakStart', e.target.value)}
                                                className="bg-transparent w-10 text-center text-white focus:outline-none focus:text-gold" 
                                                placeholder="12:00"
                                              />
                                              <span className="text-gray-500">-</span>
                                              <input 
                                                type="text" 
                                                value={openingHours[day]?.breakEnd || ''} 
                                                onChange={(e) => updateOpeningHours(day, 'breakEnd', e.target.value)}
                                                className="bg-transparent w-10 text-center text-white focus:outline-none focus:text-gold" 
                                                placeholder="13:00"
                                              />
                                          </div>
                                      </div>
                                  </div>
                                  <p className="text-[10px] text-gray-500 text-center mt-1">Smažte časy pro označení dne jako zavřeno</p>
                              </div>
                          ))}
                      </div>
                  </div>`;

// Use fallback regex because spaces might be tricky
code = code.replace(
/<div>\s*<h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Otevírací doba \(Kalendář\)<\/h3>[\s\S]*?<\/div>\s*<\/div>/,
newStart
);

fs.writeFileSync('components/AdminPanel.tsx', code);
