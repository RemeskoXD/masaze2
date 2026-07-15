import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

const regex1 = /const \[time, setTime\] = useState\(''\);/;
const replacement1 = `const [time, setTime] = useState('');
    const [endTime, setEndTime] = useState('');`;

if (regex1.test(code)) {
    code = code.replace(regex1, replacement1);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched manual res 1 successfully');
} else {
    console.log('failed to match regex manual res 1');
}

const regex2 = /setTime\(''\);\n            setNote\(''\);/;
const replacement2 = `setTime('');
            setEndTime('');
            setNote('');`;

if (regex2.test(code)) {
    code = code.replace(regex2, replacement2);
    fs.writeFileSync('components/ManualReservationModal.tsx', code);
    console.log('patched manual res 2 successfully');
} else {
    console.log('failed to match regex manual res 2');
}
