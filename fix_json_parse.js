import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

code = code.replace("const specificDates = specificDatesStr ? JSON.parse(specificDatesStr) : {};", 
`let specificDates = {};
    try {
        if (typeof specificDatesStr === 'string') {
            specificDates = specificDatesStr ? JSON.parse(specificDatesStr) : {};
        } else if (typeof specificDatesStr === 'object') {
            specificDates = specificDatesStr;
        }
    } catch(e) {
        console.error("Failed to parse specificDatesStr", e);
        specificDates = {};
    }`);

fs.writeFileSync('components/AdminPanel.tsx', code);
