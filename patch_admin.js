import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const regex = /\{(res\.totalPrice \|\| res\.vs) && \(\s*<div className="mt-3 text-gold\/80 bg-gold\/10 inline-flex flex-wrap items-center gap-3 px-2 py-1 rounded">\s*\{res\.totalPrice && <span className="font-medium text-gold">\{res\.totalPrice\} Kč<\/span>\}\s*\{res\.vs && <span>VS: \{res\.vs\}<\/span>\}\s*<\/div>\s*\)\}/;

const replacement = `{(res.totalPrice || res.vs) && (
                                              <div className="mt-3 text-gold/80 bg-gold/10 inline-flex flex-wrap items-center gap-3 px-2 py-1 rounded">
                                                  {res.totalPrice !== undefined && <span className="font-medium text-gold">{res.totalPrice} Kč</span>}
                                                  {res.vs && <span>VS: {res.vs}</span>}
                                              </div>
                                          )}
                                          {res.voucherCode && (
                                              <div className="mt-2 text-green-400 bg-green-900/30 inline-flex flex-wrap items-center gap-2 px-2 py-1 rounded border border-green-500/20">
                                                  <Gift size={12} /> <span className="font-mono">{res.voucherCode}</span>
                                              </div>
                                          )}`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('components/AdminPanel.tsx', code);
    console.log('patched admin panel');
} else {
    console.log('no match for admin panel patch');
}
