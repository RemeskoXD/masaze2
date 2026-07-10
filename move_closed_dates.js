import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

// Extract the closed dates div
const closedDatesMatch = code.match(/<div className="mt-8">\s*<h4 className="text-lg text-white mb-2 font-serif">Nedostupné dny \(Dovolená\)<\/h4>[\s\S]*?<\/div>\s*<div className="pt-6 border-t border-gray-700 mt-6">\s*<h3 className="text-xl text-white mb-4">Stav serveru<\/h3>/);

if (closedDatesMatch) {
    const closedDatesCode = closedDatesMatch[0];
    
    // Remove it from current location
    code = code.replace(closedDatesCode, `<div className="pt-6 border-t border-gray-700 mt-6">
                      <h3 className="text-xl text-white mb-4">Stav serveru</h3>`);

    // Extract just the UI block without the stav serveru part
    const justClosedDatesUI = closedDatesCode.replace(/<div className="pt-6 border-t border-gray-700 mt-6">\s*<h3 className="text-xl text-white mb-4">Stav serveru<\/h3>/, '');

    // Inject it under the Pracovní doba a Přestávky section
    code = code.replace(/<p className="text-\[10px\] text-gray-500 text-center mt-1">Smažte časy pro označení dne jako zavřeno<\/p>\s*<\/div>\s*\)\)\}\s*<\/div>\s*<\/div>/, (match) => {
        return `${match}\n\n${justClosedDatesUI}`;
    });

    fs.writeFileSync('components/AdminPanel.tsx', code);
    console.log("Moved successfully.");
} else {
    console.log("Could not find match.");
}
