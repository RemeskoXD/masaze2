import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const replacement = `            </AnimatePresence>
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

code = code.replace(
  `            </AnimatePresence>
        </div>
    );
};`,
  replacement
);

fs.writeFileSync('components/AdminPanel.tsx', code);
