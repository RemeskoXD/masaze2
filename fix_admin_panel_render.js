import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const regex = /<h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Pracovní doba a Přestávky<\/h3>.*?(?=<div className="pt-6 border-t border-gray-700">)/s;
const newRender = `
<h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Pracovní doba (Dle dnů)</h3>
<p className="text-sm text-gray-400 mb-6">Nastavte otevírací dobu a přestávky pro konkrétní dny. Dny, které nemají nastavenou otevírací dobu, jsou považovány za zavřené.</p>
<AdminDailySchedulePicker 
    specificDatesStr={specificDatesStr}
    setSpecificDatesStr={setSpecificDatesStr}
    updateSetting={updateSetting}
/>
</div>
`;
code = code.replace(regex, newRender);

fs.writeFileSync('components/AdminPanel.tsx', code);
