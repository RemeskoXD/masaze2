import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf-8');

const faultyBlockRegex = /\{(\/\* Doplnky Selection \*\/)[\s\S]*?<div className="text-xs text-text-muted font-light leading-relaxed">\{addon.description\}<\/div>\s*<\/div>/m;
const match = code.match(faultyBlockRegex);
if (!match) {
    console.log("Could not find faulty block");
    process.exit(1);
}

const fixedBlock = `{/* Doplnky Selection */}
                            <div className="mb-10">
                                <h4 className="text-sm uppercase tracking-[0.15em] font-medium text-text-dark mb-4">Máte zájem o doplňkovou péči? (volitelné)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {SERVICES_LIST.filter(s => s.id === 12 || s.id === 13).map((addon) => {
                                        const isSelected = selectedAddons.includes(addon.id);
                                        return (
                                            <button
                                                type="button"
                                                key={addon.id}
                                                onClick={() => setSelectedAddons(prev => prev.includes(addon.id) ? prev.filter(id => id !== addon.id) : [...prev, addon.id])}
                                                className={\`group flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-300 \${
                                                    isSelected 
                                                    ? 'border-gold bg-gold/5 shadow-sm' 
                                                    : 'border-gold/20 hover:border-gold/50 bg-transparent'
                                                }\`}
                                            >
                                                <div className={\`mt-1 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors \${isSelected ? 'bg-gold border-gold text-white' : 'border-gold/40 text-transparent group-hover:border-gold/70'}\`}>
                                                    <Check size={14} />
                                                </div>
                                                <div>
                                                    <div className={\`font-serif text-lg mb-1 leading-tight \${isSelected ? 'text-gold-dark' : 'text-text-dark group-hover:text-gold-dark'}\`}>
                                                        {addon.title.replace(' (Doplňková služba)', '')}
                                                    </div>
                                                    <div className="text-sm font-medium text-text-dark mb-2">{addon.price} <span className="text-text-muted font-light">/ {addon.duration}</span></div>
                                                    <div className="text-xs text-text-muted font-light leading-relaxed">{addon.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>`;

code = code.replace(faultyBlockRegex, fixedBlock);
fs.writeFileSync('components/ReservationSystem.tsx', code);
console.log('Fixed addons block');
