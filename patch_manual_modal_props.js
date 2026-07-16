import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf-8');

code = code.replace(
    'export default function ManualReservationModal({ isOpen, onClose, onSave }: any) {',
    'export default function ManualReservationModal({ isOpen, onClose, onSave, reservations = [], specificDatesStr = "{}", openingHours = {} }: any) {'
);

fs.writeFileSync('components/ManualReservationModal.tsx', code);
console.log('patched manual modal component signature');
