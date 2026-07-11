import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

// 1. Update updateSetting to return boolean
const oldUpdateSetting = `  const updateSetting = async (key: string, value: any) => {
    try {
        await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${adminToken}\`
            },
            body: JSON.stringify({ [key]: value })
        });
    } catch (e) {
        console.error(e);
    }
  };`;

const newUpdateSetting = `  const updateSetting = async (key: string, value: any) => {
    try {
        const res = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${adminToken}\`
            },
            body: JSON.stringify({ [key]: value })
        });
        if (!res.ok) {
            console.error('Failed to update setting', await res.text());
            return false;
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
  };`;

code = code.replace(oldUpdateSetting, newUpdateSetting);

// 2. Update updateSetting type signature in AdminDailySchedulePicker
code = code.replace(
  "updateSetting: (k: string, v: string) => void }",
  "updateSetting: (k: string, v: any) => Promise<boolean> | void }"
);

// 3. Update handleSaveToServer
const oldHandleSave = `    const handleSaveToServer = () => {
        try {
            const parsed = typeof specificDatesStr === 'string' && specificDatesStr ? JSON.parse(specificDatesStr) : specificDatesStr;
            updateSetting('specificDates', parsed || {});
            // Show a small UI feedback instead of alert if possible, or just alert
            alert('Změny v kalendáři byly úspěšně uloženy.');
        } catch(e) {
            console.error(e);
            alert('Chyba při ukládání.');
        }
    };`;

const newHandleSave = `    const handleSaveToServer = async () => {
        try {
            // First let's make sure we have the correct string representation
            const strToSave = typeof specificDatesStr === 'object' ? JSON.stringify(specificDatesStr) : specificDatesStr;
            // Send exactly the string to keep compatibility with double stringified or not
            const success = await updateSetting('specificDates', strToSave || "");
            if (success !== false) {
                alert('Změny v kalendáři byly úspěšně uloženy do databáze.');
            } else {
                alert('Chyba při ukládání do databáze.');
            }
        } catch(e) {
            console.error(e);
            alert('Chyba při ukládání.');
        }
    };`;

code = code.replace(oldHandleSave, newHandleSave);

fs.writeFileSync('components/AdminPanel.tsx', code);
