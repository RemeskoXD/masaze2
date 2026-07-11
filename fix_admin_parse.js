import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const oldParse = `        if (typeof specificDatesStr === 'string') {
            specificDates = specificDatesStr ? JSON.parse(specificDatesStr) : {};
        } else if (typeof specificDatesStr === 'object') {
            specificDates = specificDatesStr;
        }`;

const newParse = `        if (typeof specificDatesStr === 'string') {
            let parsed = specificDatesStr ? JSON.parse(specificDatesStr) : {};
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            specificDates = parsed;
        } else if (typeof specificDatesStr === 'object') {
            specificDates = specificDatesStr;
        }`;

code = code.replace(oldParse, newParse);
fs.writeFileSync('components/AdminPanel.tsx', code);
