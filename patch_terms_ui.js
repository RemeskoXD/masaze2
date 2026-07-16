import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const regexUi = /\{errorMsg && \(/;
const replacementUi = `
                            <div className="flex items-start gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setTermsAccepted(!termsAccepted)}
                                    className={\`mt-1 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors \${termsAccepted ? 'bg-gold border-gold text-white' : 'border-gold/40 text-transparent hover:border-gold/70'}\`}
                                >
                                    <Check size={14} />
                                </button>
                                <label className="text-sm text-text-muted cursor-pointer font-light leading-relaxed select-none" onClick={() => setTermsAccepted(!termsAccepted)}>
                                    Souhlasím s <a href="/obchodni-podminky" target="_blank" className="text-gold hover:underline" onClick={(e) => e.stopPropagation()}>obchodními podmínkami</a>, podmínkami storna a zpracováním osobních údajů.
                                </label>
                            </div>

                            {errorMsg && (`;

code = code.replace(regexUi, replacementUi);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('patched terms ui successfully');
