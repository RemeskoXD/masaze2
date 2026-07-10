import fs from 'fs';
let code = fs.readFileSync('components/ReservationSystem.tsx', 'utf8');

const handleTimeSelectStr = `  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };`;

const handleTimeSelectNewStr = `  const handleTimeSelect = (time: string) => {
    if (selectedTime === time) {
        setStep(3);
    } else {
        setSelectedTime(time);
    }
  };`;

code = code.replace(handleTimeSelectStr, handleTimeSelectNewStr);

const step2BottomStr = `                                            </motion.button>
                                        )})}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Step 3: Details */}`;

const step2BottomNewStr = `                                            </motion.button>
                                        )})}
                                    </motion.div>
                                    <AnimatePresence>
                                        {selectedTime && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, y: 10, height: 0 }}
                                                className="mt-8 flex justify-end overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => setStep(3)}
                                                    className="px-8 py-3 bg-gold text-white rounded-full font-medium tracking-wide hover:bg-gold-dark transition-colors shadow-md flex items-center gap-2"
                                                >
                                                    Pokračovat k údajům
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Step 3: Details */}`;

code = code.replace(step2BottomStr, step2BottomNewStr);

fs.writeFileSync('components/ReservationSystem.tsx', code);
