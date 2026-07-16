import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const targetRegex = /\{\/\* Doplnky Selection \*\/\}[\s\S]*?<\/div>\s*<\/div>\n/m;
const match = code.match(targetRegex);

if (!match) {
    console.log("Could not find addon block");
    process.exit(1);
}

const addonBlock = match[0];
code = code.replace(targetRegex, '');

const insertRegex = /<div className="mb-10">\s*<div className="flex items-center justify-between mb-4">/m;
const insertMatch = code.match(insertRegex);

if (!insertMatch) {
    console.log("Could not find insert point");
    process.exit(1);
}

// Adjust classes to fit step 2 layout
let newAddonBlock = addonBlock.replace('pt-6 pb-2 border-t border-gold/10 mt-6', 'mb-10');

code = code.replace(insertRegex, newAddonBlock + '\n                        ' + insertMatch[0]);

fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('Moved addons to step 2');
