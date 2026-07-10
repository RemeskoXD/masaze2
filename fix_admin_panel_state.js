import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

// Replace closedDates state with specificDatesStr
code = code.replace(/const \[closedDates, setClosedDates\] = useState<string>\(''\);/, "const [specificDatesStr, setSpecificDatesStr] = useState<string>('');");

const fetchSettingsOld = `            if (data.clientSectionEnabled) setClientSectionEnabled(data.clientSectionEnabled);
            if (data.openingHours) setOpeningHours(data.openingHours);
            if (data.closedDates) setClosedDates(data.closedDates);`;

const fetchSettingsNew = `            if (data.clientSectionEnabled) setClientSectionEnabled(data.clientSectionEnabled);
            if (data.specificDates) setSpecificDatesStr(data.specificDates);`;

code = code.replace(fetchSettingsOld, fetchSettingsNew);

fs.writeFileSync('components/AdminPanel.tsx', code);
