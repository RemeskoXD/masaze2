import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// Reschedule
code = code.replace(/const db = await getDB\(\);\s*const reservation = db\.reservations\.find\(\(r: any\) => r\.id === parseInt\(id as string\)\);\s*if \(\!reservation\) \{\s*return res\.status\(404\)\.json\(\{ success: false, message: 'Rezervace nenalezena' \}\);\s*\}\s*const oldDate = reservation\.date;\s*const oldTime = reservation\.time;\s*reservation\.date = newDate;\s*reservation\.time = newTime;\s*\/\/ Optionally change status back to pending or keep it as is, or confirmed\. Let's keep status\.\s*\/\/ Usually reschedule implies it's confirmed or pending, let's keep current status\.\s*await saveDB\(db\);/, 
`const [rows]: any = await pool.query('SELECT * FROM reservations WHERE id = ?', [parseInt(id as string)]);
if (rows.length === 0) {
  return res.status(404).json({ success: false, message: 'Rezervace nenalezena' });
}
const reservation = rows[0];
const oldDate = reservation.date;
const oldTime = reservation.time;
await pool.query('UPDATE reservations SET date = ?, time = ? WHERE id = ?', [newDate, newTime, parseInt(id as string)]);
reservation.date = newDate;
reservation.time = newTime;`
);

// Status
code = code.replace(/const db = await getDB\(\);\s*const resIndex = db\.reservations\.findIndex\(\(r: any\) => r\.id === parseInt\(id as string\)\);\s*if \(resIndex === -1\) \{\s*return res\.status\(404\)\.json\(\{ success: false, message: 'Nenalezeno' \}\);\s*\}\s*const reservation = db\.reservations\[resIndex\];\s*reservation\.status = status;\s*if \(reason\) reservation\.cancelReason = reason;\s*if \(alternativeTermin\) reservation\.alternativeTermin = alternativeTermin;\s*await saveDB\(db\);/, 
`const [rows]: any = await pool.query('SELECT * FROM reservations WHERE id = ?', [parseInt(id as string)]);
if (rows.length === 0) {
  return res.status(404).json({ success: false, message: 'Nenalezeno' });
}
const reservation = rows[0];
reservation.status = status;
if (reason) reservation.cancelReason = reason;
if (alternativeTermin) reservation.alternativeTermin = alternativeTermin;
await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, parseInt(id as string)]);`
);

fs.writeFileSync('server.ts', code);
