import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const regex = /<div className="space-y-2">\n\s*<label className="text-sm text-gray-300">Datum \*\w*<\/label>\n\s*<input \n\s*type="date" \n\s*required\n\s*value=\{date\}\n\s*onChange=\{e => setDate\(e.target.value\)\}\n\s*className="w-full bg-\[#0a2f1c\] border border-gold\/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none \[color-scheme:dark\]"\n\s*\/>\n\s*<\/div>\n\s*<div className="space-y-2">\n\s*<label className="text-sm text-gray-300">Čas \*\w*<\/label>\n\s*<input \n\s*type="time" \n\s*required\n\s*value=\{time\}\n\s*onChange=\{e => setTime\(e.target.value\)\}\n\s*className="w-full bg-\[#0a2f1c\] border border-gold\/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none \[color-scheme:dark\]"\n\s*\/>\n\s*<\/div>/;

const replacement = `<div className="space-y-2">
                                    <label className="text-sm text-gray-300">Datum *</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Čas *</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Konec (rezerva 15m)</label>
                                    <input 
                                        type="time" 
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="w-full bg-[#0a2f1c] border border-gold/20 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
                                    />
                                </div>`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched manual ui 2 successfully');
} else {
    console.log('failed to match regex manual ui 2');
}
