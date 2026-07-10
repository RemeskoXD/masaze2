import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

// Step 1: Service click
code = code.replace(
/onClick=\{\(\) => setSelectedService\(service\.id\)\}/g,
"onClick={() => { if (selectedService === service.id) setStep(2); else setSelectedService(service.id); }}"
);

// Step 1: Pokračovat button
const step1BottomStr = `                        </div>
                    </motion.div>
                )}

                {/* Step 2: Date & Time */}`;

const step1BottomNewStr = `                        </div>
                        <AnimatePresence>
                            {selectedService && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: 10, height: 0 }}
                                    className="mt-8 flex justify-end overflow-hidden"
                                >
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-8 py-3 bg-gold text-white rounded-full font-medium tracking-wide hover:bg-gold-dark transition-colors shadow-md flex items-center gap-2"
                                    >
                                        Pokračovat k výběru termínu
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Step 2: Date & Time */}`;
code = code.replace(step1BottomStr, step1BottomNewStr);

fs.writeFileSync('components/ReservationSystem.tsx', code);
