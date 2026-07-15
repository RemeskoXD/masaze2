import fs from 'fs';
let code = fs.readFileSync('components/ReservationCalendar.tsx', 'utf-8');

const regex = /const \{ top, height, isPast \} = getReservationStyle\(res\);([\s\S]*?)<div className="text-xs bg-black\/30 px-2 py-0\.5 rounded text-gray-300 font-mono">\{res\.time\}<\/div>/;

const replacement = `const { top, height, isPast, endTimeStr } = getReservationStyle(res);$1<div className="text-xs bg-black/30 px-2 py-0.5 rounded text-gray-300 font-mono">{res.time} - {endTimeStr}</div>`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ReservationCalendar.tsx', code);
    console.log('patched calendar render successfully');
} else {
    console.log('failed to match regex calendar render');
}
