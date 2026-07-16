import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const regex = /<ManualReservationModal \n          isOpen=\{isManualModalOpen\}\n          onClose=\{\(\) => setIsManualModalOpen\(false\)\}\n          onSave=\{fetchData\}\n          reservations=\{reservations\}\n          specificDatesStr=\{specificDatesStr\}\n      \/>/;
const replacement = `<ManualReservationModal 
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          onSave={fetchData}
          reservations={reservations}
          specificDatesStr={specificDatesStr}
          openingHours={openingHours}
      />`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/AdminPanel.tsx', code);
    console.log('patched admin modal props successfully');
} else {
    console.log('failed to patch admin modal props');
}
