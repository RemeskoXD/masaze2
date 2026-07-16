import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

code = code.replace(
  /{new Date\\(selectedDate!\\).toLocaleDateString\\('cs-CZ'\\)} v {selectedTime}/g,
  "{new Date(selectedDate!).toLocaleDateString('cs-CZ')} v {selectedTime} - {selectedEndTime}"
);

fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched step 3 end time');
