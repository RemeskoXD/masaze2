import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

code = code.replace(
/const \[openingHours, setOpeningHours\] = useState<any>\(\{.+\}\);/s,
`const [openingHours, setOpeningHours] = useState<any>({
    'Pondělí': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Úterý': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Středa': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Čtvrtek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Pátek': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Sobota': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    'Neděle': { start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
  });
  const [closedDates, setClosedDates] = useState<string>('');`
);

code = code.replace(
/if \(data\.openingHours\) setOpeningHours\(data\.openingHours\);/,
`if (data.openingHours) setOpeningHours(data.openingHours);
          if (data.closedDates) setClosedDates(data.closedDates);`
);

code = code.replace(
/<div className="flex items-center gap-2 text-sm text-gray-400">/g,
`<div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-400">`
);

code = code.replace(
/<input\n                                         type="text"\n                                         value=\{openingHours\[day\]\?\.end \|\| ''\}\n                                         onChange=\{\(e\) => updateOpeningHours\(day, 'end', e\.target\.value\)\}\n                                        className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none"\n                                         placeholder="00:00"\n                                      \/>\n                                  <\/div>/,
`<input
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
                                  </div>`
);

code = code.replace(
/<\/div>\n                  <\/div>\n                  <div className="pt-6 border-t border-gray-700">/,
`</div>
                  </div>
                  
                  <div className="mt-8">
                      <h4 className="text-lg text-white mb-2 font-serif">Nedostupné dny (Dovolená)</h4>
                      <p className="text-xs text-gray-400 mb-2">Zadejte data ve formátu YYYY-MM-DD oddělená čárkou. Např: 2026-12-24, 2026-12-25</p>
                      <textarea
                          value={closedDates}
                          onChange={(e) => setClosedDates(e.target.value)}
                          onBlur={(e) => updateSetting('closedDates', e.target.value)}
                          className="w-full bg-[#0a2f1c] text-white p-3 rounded border border-gray-600 focus:border-gold outline-none h-24 font-mono text-sm resize-none"
                          placeholder="2026-12-24, 2026-12-25"
                      />
                  </div>
                  
                  <div className="pt-6 border-t border-gray-700 mt-6">`
);

fs.writeFileSync('components/AdminPanel.tsx', code);
