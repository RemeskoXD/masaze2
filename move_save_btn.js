import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

// Remove the button from the end
const endHtml = `            </AnimatePresence>
            <div className="flex flex-col gap-4 mt-6 w-full lg:w-auto">
                <button 
                    onClick={handleSaveToServer}
                    className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 px-4 rounded transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(197,168,128,0.4)]"
                >
                    <Check size={20} />
                    Uložit změny v kalendáři na server
                </button>
            </div>
        </div>
    );
};`;

code = code.replace(endHtml, `            </AnimatePresence>\n        </div>\n    );\n};`);

// Add it under the calendar grid (before `</div> <AnimatePresence>`)
const calEndHtml = `                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-900/20"></div> Zavřeno (nenastaveno)</div>
                </div>
            </div>`;

const calEndWithBtn = `                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-900/20"></div> Zavřeno (nenastaveno)</div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-600/50">
                    <button 
                        onClick={handleSaveToServer}
                        className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 px-4 rounded transition flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Check size={20} />
                        Uložit změny v kalendáři na server
                    </button>
                </div>
            </div>`;

code = code.replace(calEndHtml, calEndWithBtn);

fs.writeFileSync('components/AdminPanel.tsx', code);
