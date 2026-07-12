import fs from 'fs';

let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const theadRegex = /<th className="p-4 border-b border-gold\/10">Datum<\/th>\s*<th className="p-4 border-b border-gold\/10">Dárce \(Odesílatel\)<\/th>\s*<th className="p-4 border-b border-gold\/10">Obdarovaný \(Pro\)<\/th>\s*<th className="p-4 border-b border-gold\/10">Typ & Částka<\/th>\s*<th className="p-4 border-b border-gold\/10">Jedinečný Kód<\/th>\s*<th className="p-4 border-b border-gold\/10">Stav<\/th>\s*<th className="p-4 border-b border-gold\/10">Akce<\/th>/;

const newThead = `<th className="p-4 border-b border-gold/10">Datum (vytvoření)</th>
                                  <th className="p-4 border-b border-gold/10">Kdo</th>
                                  <th className="p-4 border-b border-gold/10">Hodnota/na co</th>
                                  <th className="p-4 border-b border-gold/10">Jedinečný code</th>
                                  <th className="p-4 border-b border-gold/10">Stav</th>
                                  <th className="p-4 border-b border-gold/10">Akce</th>`;

code = code.replace(theadRegex, newThead);

// Also need to adjust the <td> to match these 6 columns:
// Previously there were 7 columns.
// 1. Datum
// 2. Dárce
// 3. Obdarovaný
// 4. Typ & částka
// 5. Code
// 6. Stav
// 7. Akce

// Merge Dárce and Obdarovaný into Kdo.
const tdsRegex = /<td className="p-4">\s*<div className="font-medium text-white">\{vouch\.senderName\}<\/div>\s*<div className="text-xs text-gray-400">\{vouch\.email\}<\/div>\s*<\/td>\s*<td className="p-4">\s*<div className="font-medium text-white">\{vouch\.recipientName\}<\/div>\s*\{vouch\.note && <div className="text-xs text-gold\/75 italic mt-1 font-serif">"\{vouch\.note\}"<\/div>\}\s*<\/td>/;

const newTds = `<td className="p-4">
                                          <div className="font-medium text-white">Pro: <span className="text-gold">{vouch.recipientName}</span></div>
                                          <div className="text-xs text-gray-400">Od: {vouch.senderName} ({vouch.email})</div>
                                          {vouch.note && <div className="text-xs text-gold/75 italic mt-1 font-serif">"{vouch.note}"</div>}
                                      </td>`;

code = code.replace(tdsRegex, newTds);

fs.writeFileSync('components/AdminPanel.tsx', code);
console.log('patched table headers and cells');
