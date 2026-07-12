import fs from 'fs';
let code = fs.readFileSync('components/ManualReservationModal.tsx', 'utf8');

const target = "finalNote = finalNote ? `\\${finalNote} (+ \\${addon.title})` : `+ \\${addon.title}`;".replace(/\\/g, '\\\\');

const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('finalNote = finalNote ?')) {
        lines[i] = '                finalNote = finalNote ? `${finalNote} (+ ${addon.title})` : `+ ${addon.title}`;';
    }
}

fs.writeFileSync('components/ManualReservationModal.tsx', lines.join('\n'));
