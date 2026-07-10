import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

code = code.replace(
/<AdminCalendar\s+selectedServiceId=\{cancelModalReservation\.serviceId\}\s+onSelectDateTime=\{\(d, t\) => \{\s+const dObj = new Date\(d\);\s+setCancelAlternativeTermin\(`\$\{dObj\.getDate\(\)\}\.\$\{dObj\.getMonth\(\)\+1\}\.\$\{dObj\.getFullYear\(\)\} v \$\{t\}`\);\s+\}\}\s+\/>/,
`                    <div className="flex gap-2 mb-4">
                        <input 
                            type="date" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => {
                                const d = e.target.value;
                                if (d) {
                                    const dObj = new Date(d);
                                    setCancelAlternativeTermin(\`\${dObj.getDate()}.\${dObj.getMonth()+1}.\${dObj.getFullYear()} - čeká na čas\`);
                                }
                            }} 
                        />
                        <input 
                            type="time" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => {
                                const t = e.target.value;
                                setCancelAlternativeTermin(prev => prev.replace(' - čeká na čas', '') + ' v ' + t);
                            }} 
                        />
                    </div>`
);

code = code.replace(
/<AdminCalendar\s+selectedServiceId=\{rescheduleModalReservation\.serviceId\}\s+onSelectDateTime=\{\(d, t\) => \{ setRescheduleDate\(d\); setRescheduleTime\(t\); \}\}\s+\/>/,
`                    <div className="flex gap-2">
                        <input 
                            type="date" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => setRescheduleDate(e.target.value)} 
                        />
                        <input 
                            type="time" 
                            className="bg-black/20 text-white p-2 border border-gray-600 rounded focus:border-gold outline-none flex-1" 
                            onChange={(e) => setRescheduleTime(e.target.value)} 
                        />
                    </div>`
);

fs.writeFileSync('components/AdminPanel.tsx', code);
