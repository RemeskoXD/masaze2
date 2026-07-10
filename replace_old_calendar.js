import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const targetStr = /<div className="mt-8">\s*<h4 className="text-lg text-white mb-2 font-serif">Nedostupné dny \(Dovolená\)<\/h4>[\s\S]*?Žádné uzavřené dny.<\/span>\}?\s*<\/div>\s*<\/div>/;

const newStr = `<div className="mt-8">
                      <h4 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Nedostupné dny (Dovolená)</h4>
                      <p className="text-sm text-gray-400 mb-6">Kliknutím na den v kalendáři jej označíte jako zavřeno. Zákazníci se v tyto dny nebudou moci objednat.</p>
                      
                      <AdminCalendarPicker 
                          closedDatesStr={closedDates} 
                          setClosedDates={setClosedDates} 
                          updateSetting={updateSetting} 
                      />
                  </div>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('components/AdminPanel.tsx', code);
