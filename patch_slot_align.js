import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regex = /currentMinutes = br\.end; \/\/ Jump to the end of the break/;
const replacement = `currentMinutes = Math.ceil(br.end / 15) * 15; // Jump to the end of the break, aligned to 15m`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/ReservationSystem.tsx', code);
    console.log('patched slot align successfully');
} else {
    console.log('failed to patch slot align');
}
