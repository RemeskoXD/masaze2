import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const regex = /time,\n                    customerName,/;
const replacement = `time,
                    endTime,
                    customerName,`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched manual api successfully');
} else {
    console.log('failed to match regex manual api');
}
