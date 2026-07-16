import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const regex = /if \(serviceSearch && time && !endTime\) \{/;
const replacement = `if (serviceSearch && time) {`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched manual effect successfully');
} else {
    console.log('failed to patch manual effect');
}
