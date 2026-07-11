import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const btnHtml = `                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center gap-2">
                        <h4 className="text-xl font-bold text-white tracking-wider">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h4>
                        <button 
                            onClick={setDefaultsForMonth} 
                            className="text-xs text-gold border border-gold/50 px-3 py-1 rounded hover:bg-gold hover:text-deep-green transition"
                        >
                            Nastavit defaultní pro tento měsíc
                        </button>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronRight size={20} />
                    </button>
                </div>`;

code = code.replace(
  `                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <h4 className="text-xl font-bold text-white tracking-wider">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h4>
                    <button onClick={nextMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronRight size={20} />
                    </button>
                </div>`,
  btnHtml
);

fs.writeFileSync('components/AdminPanel.tsx', code);
