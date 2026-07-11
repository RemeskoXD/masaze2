import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

// 1. In setDefaultsForMonth, remove updateSetting
code = code.replace(
  "        setSpecificDatesStr(updatedStr);\n        updateSetting('specificDates', updatedStr);\n    };",
  "        setSpecificDatesStr(updatedStr);\n    };"
);

// 2. In saveDaySettings, remove updateSetting
code = code.replace(
  "        setSpecificDatesStr(updatedStr);\n        updateSetting('specificDates', updatedStr);\n    };",
  "        setSpecificDatesStr(updatedStr);\n    };"
);

// 3. Add handleSaveToServer in AdminDailySchedulePicker
const saveFuncHtml = `    const handleSaveToServer = () => {
        try {
            const parsed = typeof specificDatesStr === 'string' && specificDatesStr ? JSON.parse(specificDatesStr) : specificDatesStr;
            updateSetting('specificDates', parsed || {});
            // Show a small UI feedback instead of alert if possible, or just alert
            alert('Změny v kalendáři byly úspěšně uloženy.');
        } catch(e) {
            console.error(e);
            alert('Chyba při ukládání.');
        }
    };
    
    return (`;

code = code.replace(
  "    return (",
  saveFuncHtml
);

// 4. Add the save button below the right panel
const rightPanelEnd = `                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-10 flex flex-col items-center gap-2">
                            <Calendar size={48} className="opacity-20" />
                            <p>Vyberte den v kalendáři pro nastavení pracovní doby.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};`;

const rightPanelNew = `                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-10 flex flex-col items-center gap-2">
                            <Calendar size={48} className="opacity-20" />
                            <p>Vyberte den v kalendáři pro nastavení pracovní doby.</p>
                        </div>
                    )}
                    
                    <div className="mt-8 pt-6 border-t border-gray-600/50">
                        <button 
                            onClick={handleSaveToServer}
                            className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 px-4 rounded transition flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Check size={20} />
                            Uložit změny v kalendáři pro všechny dny
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};`;

code = code.replace(rightPanelEnd, rightPanelNew);

fs.writeFileSync('components/AdminPanel.tsx', code);
