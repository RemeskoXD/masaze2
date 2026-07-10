import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

// I need to add a month calendar component inside AdminPanel or as a helper.
// Let's add it right before AdminPanel.

const calendarCode = `
const AdminCalendarPicker = ({ closedDatesStr, setClosedDates, updateSetting }: { closedDatesStr: string, setClosedDates: (s: string) => void, updateSetting: (k: string, v: string) => void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Start on Monday
    
    const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    
    const closedDates = closedDatesStr ? closedDatesStr.split(',').filter(Boolean) : [];

    const toggleDate = (day: number) => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Format as YYYY-MM-DD local time
        const dateString = d.toLocaleDateString('en-CA'); 
        
        let newDates;
        if (closedDates.includes(dateString)) {
            newDates = closedDates.filter(cd => cd !== dateString);
        } else {
            newDates = [...closedDates, dateString];
        }
        
        const newDatesStr = newDates.join(',');
        setClosedDates(newDatesStr);
        updateSetting('closedDates', newDatesStr);
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    return (
        <div className="bg-black/40 border border-gray-600/50 rounded-xl p-6 max-w-md">
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
                    const dateString = d.toLocaleDateString('en-CA');
                    const isClosed = closedDates.includes(dateString);
                    const isPast = d < new Date(new Date().setHours(0,0,0,0));
                    
                    return (
                        <button
                            key={day}
                            onClick={() => !isPast && toggleDate(day)}
                            disabled={isPast}
                            className={\`
                                p-3 rounded flex items-center justify-center text-sm font-medium transition-all
                                \${isPast ? 'opacity-20 cursor-not-allowed text-gray-500' : 'hover:border-gold border border-transparent'}
                                \${isClosed ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-gray-800/50 text-gray-300'}
                            \`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
                <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50"></div>
                <span>= Den označen jako zavřeno (Dovolená)</span>
            </div>
        </div>
    );
};

const AdminPanel: React.FC = () => {`;

code = code.replace("const AdminPanel: React.FC = () => {", calendarCode);

fs.writeFileSync('components/AdminPanel.tsx', code);
