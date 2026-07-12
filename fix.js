import fs from 'fs';
let content = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

// Find the section for reservations tab closing
// we know it ends with:
//                       )}
//                   </div>
//                </motion.div>
//           )}

const pattern = `                      )}
                  </div>
               </motion.div>
          )}`;

const replacement = `                      )}
                    </>
                  ) : (
                    <ReservationCalendar 
                        reservations={reservations}
                        updateReservationStatus={updateReservationStatus}
                        handleOpenCancelModal={handleOpenCancelModal}
                        openRescheduleModal={openRescheduleModal}
                        setThankYouModalReservation={setThankYouModalReservation}
                    />
                  )}
               </motion.div>
          )}`;

content = content.replace(pattern, replacement);

fs.writeFileSync('components/AdminPanel.tsx', content);
