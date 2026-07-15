import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const effectRegex = /useEffect\(\(\) => \{\n        let price = 0;/;
const effectReplacement = `useEffect(() => {
        if (serviceSearch && time && !endTime) {
            const service = SERVICES_LIST.find(s => s.title === serviceSearch);
            if (service && service.duration) {
                const durationMins = parseInt(service.duration.replace(/\\D/g, '')) + 15;
                if (!isNaN(durationMins)) {
                    const [hours, minutes] = time.split(':').map(Number);
                    const totalMins = (hours * 60) + minutes + durationMins;
                    const endH = Math.floor(totalMins / 60) % 24;
                    const endM = totalMins % 60;
                    setEndTime(\`\${endH.toString().padStart(2, '0')}:\${endM.toString().padStart(2, '0')}\`);
                }
            }
        }
    }, [serviceSearch, time]);

    useEffect(() => {
        let price = 0;`;

if (effectRegex.test(code)) {
    code = code.replace(effectRegex, effectReplacement);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched manual res effect successfully');
} else {
    console.log('failed to match regex manual res effect');
}

const uiRegex = /<div className="grid grid-cols-2 gap-4">\n\s*<div className="space-y-2">\n\s*<label className="text-sm text-gray-300">Datum \*\w*<\/label>\n\s*<input\s*type="date"[\s\S]*?<\/div>\n\s*<div className="space-y-2">\n\s*<label className="text-sm text-gray-300">Čas \*\w*<\/label>\n\s*<input\s*type="time"[\s\S]*?<\/div>\n\s*<\/div>/;

const uiReplacement = `<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Datum *</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Čas *</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Do kdy (konec)</label>
                                    <input 
                                        type="time" 
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>`;

if (uiRegex.test(code)) {
    code = code.replace(uiRegex, uiReplacement);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched manual res ui successfully');
} else {
    console.log('failed to match regex manual res ui');
}
