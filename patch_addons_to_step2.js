import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

// The block to extract
const addonBlockRegex = /\s*{\/\* Doplnky Selection \*\/}[\s\S]*?(?=<\!-- |{error &&)/;
const addonBlockStart = code.indexOf('{/* Doplnky Selection */}');
const addonBlockEnd = code.indexOf('{error &&', addonBlockStart);

if (addonBlockStart === -1 || addonBlockEnd === -1) {
    console.log("Could not find addon block");
    process.exit(1);
}

// Extract the addon block
let addonBlock = code.substring(addonBlockStart, addonBlockEnd);
// Remove it from current location (step 3)
code = code.substring(0, addonBlockStart) + code.substring(addonBlockEnd);

// Find where to insert it in step 2. Let's insert it before the calendar
const insertTarget = `<div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-text-dark text-sm uppercase tracking-[0.15em] font-medium flex items-center gap-2">`;
                                
const insertIndex = code.indexOf(insertTarget);
if (insertIndex === -1) {
    console.log("Could not find insert target in step 2");
    process.exit(1);
}

// Ensure the addon block is wrapped in a container that fits step 2
// Wait, the addon block already has a div. We might want to remove its top margin if it's the first thing, but it's fine.
code = code.substring(0, insertIndex) + addonBlock + "\n                        " + code.substring(insertIndex);

fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('Moved addon selection to step 2');
