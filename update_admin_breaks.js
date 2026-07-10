import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const targetStr = /<div className="flex justify-between items-center">\s*<span className="text-sm text-gray-400 flex items-center gap-2"><Coffee size=\{14\} className="text-gold"\/> Přestávka<\/span>\s*<div className="flex items-center gap-1 bg-black\/50 p-1\.5 rounded-lg border border-gray-700">\s*<input\s*type="text"\s*value=\{openingHours\[day\]\?\.breakStart \|\| ''\}\s*onChange=\{\(e\) => updateOpeningHours\(day, 'breakStart', e\.target\.value\)\}\s*className="bg-transparent w-10 text-center text-white focus:outline-none focus:text-gold"\s*placeholder="12:00"\s*\/>\s*<span className="text-gray-500">-<\/span>\s*<input\s*type="text"\s*value=\{openingHours\[day\]\?\.breakEnd \|\| ''\}\s*onChange=\{\(e\) => updateOpeningHours\(day, 'breakEnd', e\.target\.value\)\}\s*className="bg-transparent w-10 text-center text-white focus:outline-none focus:text-gold"\s*placeholder="13:00"\s*\/>\s*<\/div>\s*<\/div>/g;

const newStr = `<div className="flex flex-col gap-2">
                                          <div className="flex justify-between items-center">
                                              <span className="text-sm text-gray-400 flex items-center gap-2"><Coffee size={14} className="text-gold"/> Přestávka</span>
                                              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                                  <input 
                                                      type="checkbox" 
                                                      className="accent-gold"
                                                      checked={!openingHours[day]?.breakStart && !openingHours[day]?.breakEnd}
                                                      onChange={(e) => {
                                                          if (e.target.checked) {
                                                              updateOpeningHours(day, 'breakStart', '');
                                                              updateOpeningHours(day, 'breakEnd', '');
                                                          } else {
                                                              updateOpeningHours(day, 'breakStart', '12:00');
                                                              updateOpeningHours(day, 'breakEnd', '13:00');
                                                          }
                                                      }}
                                                  />
                                                  Bez přestávky
                                              </label>
                                          </div>
                                          {(!(!openingHours[day]?.breakStart && !openingHours[day]?.breakEnd)) && (
                                              <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-lg border border-gray-700 self-end">
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
                                          )}
                                      </div>`;

const newCode = code.replace(targetStr, newStr);

fs.writeFileSync('components/AdminPanel.tsx', newCode);
console.log(code === newCode ? "Not changed" : "Changed");
