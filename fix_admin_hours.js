import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const oldFetch = `            if (data.specificDates) setSpecificDatesStr(data.specificDates);`;
const newFetch = `            if (data.specificDates) setSpecificDatesStr(data.specificDates);
            if (data.openingHours) {
                try {
                    let oh = data.openingHours;
                    if (typeof oh === 'string') oh = JSON.parse(oh);
                    if (typeof oh === 'string') oh = JSON.parse(oh);
                    if (oh && typeof oh === 'object') setOpeningHours(oh);
                } catch(e) {}
            }`;
code = code.replace(oldFetch, newFetch);

fs.writeFileSync('components/AdminPanel.tsx', code);
