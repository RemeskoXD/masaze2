import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

code = code.replace(
  "{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime}</span>",
  "{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime} - {selectedEndTime}</span>"
);

code = code.replace(
  "v {selectedTime}</strong> byla úspěšně přijata.",
  "v {selectedTime} - {selectedEndTime}</strong> byla úspěšně přijata."
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched step 3 end time 2');
