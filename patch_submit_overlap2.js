import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const regex = /if \(!date \|\| !time \|\| !customerName\) \{\n\s*setError\('Vyplňte prosím všechna povinná pole \(Jméno, Datum, Čas, Masáž\)\.'\);\n\s*return;\n\s*\}/;

const replacement = `if (!date || !time || !customerName) {
            setError('Vyplňte prosím všechna povinná pole (Jméno, Datum, Čas, Masáž).');
            return;
        }

        if (time && endTime && reservations) {
            const parseTime = (t: string) => {
                if (!t) return 0;
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };
            const formatTime = (mins: number) => {
                const h = Math.floor(mins / 60) % 24;
                const m = Math.floor(mins % 60);
                return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}\`;
            };
            const reqStart = parseTime(time);
            const reqEnd = parseTime(endTime);
            
            const dayReservations = reservations.filter((r: any) => r.date === date && r.status !== 'cancelled');
            for (const r of dayReservations) {
                let rStart = parseTime(r.time);
                let rEnd = rStart;
                if (r.endTime) {
                    rEnd = parseTime(r.endTime);
                } else {
                    const srv = SERVICES_LIST.find(s => s.id === r.serviceId);
                    if (srv && srv.duration) {
                        const m = srv.duration.match(/(\\d+)/);
                        if (m) rEnd = rStart + parseInt(m[0]) + 15;
                        else rEnd = rStart + 60;
                    }
                }
                
                if (reqStart < rEnd && reqEnd > rStart) {
                    setError(\`Zvolený čas se překrývá s existující rezervací (\${r.time} - \${r.endTime || formatTime(rEnd)}).\`);
                    return;
                }
            }
        }`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched submit overlap 2 successfully');
} else {
    console.log('failed to patch submit overlap 2');
}
