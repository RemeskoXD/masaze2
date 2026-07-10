import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const newPicker = `
const AdminDailySchedulePicker = ({ specificDatesStr, setSpecificDatesStr, updateSetting }: { specificDatesStr: string, setSpecificDatesStr: (s: string) => void, updateSetting: (k: string, v: string) => void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
    
    const specificDates = specificDatesStr ? JSON.parse(specificDatesStr) : {};

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Start on Monday
    
    const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const selectedSettings = selectedDateStr ? (specificDates[selectedDateStr] || { isOpen: false, start: '09:00', end: '18:00', breaks: [] }) : null;

    const saveDaySettings = (newSettings: any) => {
        if (!selectedDateStr) return;
        const updated = { ...specificDates, [selectedDateStr]: newSettings };
        const updatedStr = JSON.stringify(updated);
        setSpecificDatesStr(updatedStr);
        updateSetting('specificDates', updatedStr);
    };

    const toggleOpen = (checked: boolean) => {
        saveDaySettings({ ...selectedSettings, isOpen: checked });
    };

    const addBreak = () => {
        const breaks = [...(selectedSettings.breaks || []), { start: '12:00', end: '13:00' }];
        saveDaySettings({ ...selectedSettings, breaks });
    };

    const removeBreak = (idx: number) => {
        const breaks = [...(selectedSettings.breaks || [])];
        breaks.splice(idx, 1);
        saveDaySettings({ ...selectedSettings, breaks });
    };

    const updateBreak = (idx: number, field: string, val: string) => {
        const breaks = [...(selectedSettings.breaks || [])];
        breaks[idx] = { ...breaks[idx], [field]: val };
        saveDaySettings({ ...selectedSettings, breaks });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="bg-black/40 border border-gray-600/50 rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <h4 className="text-xl font-bold text-white tracking-wider">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h4>
                    <button onClick={nextMonth} className="p-2 hover:bg-gold/20 hover:text-gold rounded transition text-gray-400">
                        <ChevronRight size={20} />
                    </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div>Po</div><div>Út</div><div>St</div><div>Čt</div><div>Pá</div><div>So</div><div>Ne</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startingDay }).map((_, i) => (
                        <div key={\`empty-\${i}\`} className="p-3" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dateString = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                        const isPast = dateString < new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
                        const settings = specificDates[dateString];
                        const isOpen = settings?.isOpen;
                        const isSelected = selectedDateStr === dateString;
                        
                        return (
                            <button
                                key={day}
                                onClick={() => !isPast && setSelectedDateStr(dateString)}
                                disabled={isPast}
                                className={\`
                                    p-3 rounded flex items-center justify-center text-sm font-medium transition-all relative
                                    \${isPast ? 'opacity-20 cursor-not-allowed text-gray-500' : 'hover:border-gold border border-transparent'}
                                    \${isSelected ? 'border-gold bg-gold/20 shadow-[0_0_10px_rgba(197,168,128,0.5)]' : ''}
                                    \${!isPast && isOpen ? 'bg-green-900/40 text-green-400' : ''}
                                    \${!isPast && !isOpen ? 'bg-red-900/20 text-red-400/50' : ''}
                                \`}
                            >
                                {day}
                                {isOpen && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-green-400"></div>}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-6 flex flex-col gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Otevřeno (nastaveno)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-900/20"></div> Zavřeno (nenastaveno)</div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {selectedDateStr && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-black/30 border border-gold/30 rounded-xl p-6 w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h3 className="text-xl font-bold text-white">
                                Nastavení pro: <span className="text-gold">{new Date(selectedDateStr).toLocaleDateString('cs-CZ')}</span>
                            </h3>
                            <button onClick={() => setSelectedDateStr(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                        </div>

                        <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-gray-700 mb-6">
                            <span className="text-white font-medium">Otevřeno v tento den?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={selectedSettings.isOpen}
                                    onChange={(e) => toggleOpen(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        {selectedSettings.isOpen && (
                            <div className="space-y-6">
                                <div className="bg-black/20 p-4 rounded-lg border border-gray-700/50">
                                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">Pracovní doba</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 block mb-1">Od</label>
                                            <input 
                                                type="text" 
                                                value={selectedSettings.start} 
                                                onChange={(e) => saveDaySettings({...selectedSettings, start: e.target.value})}
                                                className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                placeholder="09:00"
                                            />
                                        </div>
                                        <span className="text-gray-500 mt-5">-</span>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 block mb-1">Do</label>
                                            <input 
                                                type="text" 
                                                value={selectedSettings.end} 
                                                onChange={(e) => saveDaySettings({...selectedSettings, end: e.target.value})}
                                                className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                placeholder="18:00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/20 p-4 rounded-lg border border-gray-700/50">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Přestávky</h4>
                                        <button onClick={addBreak} className="text-xs bg-gold/20 text-gold px-2 py-1 rounded hover:bg-gold hover:text-white transition">+ Přidat přestávku</button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {(!selectedSettings.breaks || selectedSettings.breaks.length === 0) ? (
                                            <p className="text-sm text-gray-500 italic text-center py-2">Žádné přestávky nejsou nastaveny.</p>
                                        ) : (
                                            selectedSettings.breaks.map((br: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={br.start} 
                                                        onChange={(e) => updateBreak(idx, 'start', e.target.value)}
                                                        className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                        placeholder="12:00"
                                                    />
                                                    <span className="text-gray-500">-</span>
                                                    <input 
                                                        type="text" 
                                                        value={br.end} 
                                                        onChange={(e) => updateBreak(idx, 'end', e.target.value)}
                                                        className="w-full bg-black/50 border border-gray-600 text-white rounded p-2 focus:border-gold outline-none text-center"
                                                        placeholder="13:00"
                                                    />
                                                    <button onClick={() => removeBreak(idx)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded ml-2">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
`;

const oldPickerRegex = /const AdminCalendarPicker.*?\}\);\n\};/s;
code = code.replace(oldPickerRegex, newPicker);

fs.writeFileSync('components/AdminPanel.tsx', code);
