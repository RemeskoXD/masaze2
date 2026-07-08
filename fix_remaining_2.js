import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

// 1. reschedule
const oldReschedule = `      const db = await getDB();
      const reservation = db.reservations.find((r: any) => r.id === parseInt(id as string));
      
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Rezervace nenalezena' });
      }

      const oldDate = reservation.date;
      const oldTime = reservation.time;
      
      reservation.date = newDate;
      reservation.time = newTime;
      
      // Optionally change status back to pending or keep it as is, or confirmed. Let's keep status.
      // Usually reschedule implies it's confirmed or pending, let's keep current status.
      
      await saveDB(db);`;

const newReschedule = `      const [rows]: any = await pool.query('SELECT * FROM reservations WHERE id = ?', [parseInt(id as string)]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Rezervace nenalezena' });
      }
      const reservation = rows[0];

      const oldDate = reservation.date;
      const oldTime = reservation.time;
      
      await pool.query('UPDATE reservations SET date = ?, time = ? WHERE id = ?', [newDate, newTime, parseInt(id as string)]);
      
      reservation.date = newDate;
      reservation.time = newTime;`;

code = code.replace(oldReschedule, newReschedule);

// 2. reservation status
const oldStatus = `      const db = await getDB();
      const resIndex = db.reservations.findIndex((r: any) => r.id === parseInt(id as string));
      
      if (resIndex === -1) {
        return res.status(404).json({ success: false, message: 'Nenalezeno' });
      }

      const reservation = db.reservations[resIndex];
      reservation.status = status;
      if (reason) reservation.cancelReason = reason;
      if (alternativeTermin) reservation.alternativeTermin = alternativeTermin;
      
      await saveDB(db);`;

const newStatus = `      const [rows]: any = await pool.query('SELECT * FROM reservations WHERE id = ?', [parseInt(id as string)]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Nenalezeno' });
      }
      const reservation = rows[0];
      reservation.status = status;
      if (reason) reservation.cancelReason = reason;
      if (alternativeTermin) reservation.alternativeTermin = alternativeTermin;
      
      await pool.query('UPDATE reservations SET status = ?, note = ? WHERE id = ?', [status, reservation.note || '', parseInt(id as string)]);`;

code = code.replace(oldStatus, newStatus);
fs.writeFileSync('server.ts', code);
