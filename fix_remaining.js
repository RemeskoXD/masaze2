import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

// 1. reschedule
code = code.replace(
`      const db = await getDB();
      const reservation = db.reservations.find((r: any) => r.id === parseInt(id as string));
      
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Rezervace nenalezena' });
      }

      const oldDate = reservation.date;
      const oldTime = reservation.time;
      
      reservation.date = newDate;
      reservation.time = newTime;
      await saveDB(db);`,
`      const [rows]: any = await pool.query('SELECT * FROM reservations WHERE id = ?', [parseInt(id as string)]);
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

// 2. voucher status
code = code.replace(
`      const db = await getDB();
      const vIndex = db.vouchers.findIndex((v: any) => v.id === parseInt(id as string));
      
      if (vIndex === -1) {
        return res.status(404).json({ success: false, message: 'Poukaz nenalezen' });
      }

      const voucher = db.vouchers[vIndex];
      voucher.status = status;
      
      let voucherCode = voucher.voucherCode;
      if (status === 'paid' && !voucherCode) {
        voucherCode = 'TR-' + Math.floor(100000 + Math.random() * 900000).toString();
        voucher.voucherCode = voucherCode;
      }
      
      await saveDB(db);`,
`      const [rows]: any = await pool.query('SELECT * FROM vouchers WHERE id = ?', [parseInt(id as string)]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Poukaz nenalezen' });
      }
      const voucher = rows[0];
      voucher.status = status;
      
      let voucherCode = voucher.voucherCode;
      if (status === 'paid' && !voucherCode) {
        voucherCode = 'TR-' + Math.floor(100000 + Math.random() * 900000).toString();
        voucher.voucherCode = voucherCode;
      }
      
      await pool.query('UPDATE vouchers SET status = ?, voucherCode = ? WHERE id = ?', [status, voucherCode || '', parseInt(id as string)]);`
);

// 3. settings
code = code.replace(
`  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const db = await getDB();
      db.settings = { ...db.settings, ...req.body };
      await saveDB(db);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  });`,
`  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      for (const [key, value] of Object.entries(req.body)) {
        await pool.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', [key, JSON.stringify(value), JSON.stringify(value)]);
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  });`
);

// 4. backup
code = code.replace(
`  app.get('/api/admin/backup', requireAdmin, async (req, res) => {
    try {
      const db = await getDB();
      res.json(db);
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: 'Chyba při zálohování' });
    }
  });`,
`  app.get('/api/admin/backup', requireAdmin, async (req, res) => {
    try {
      const [reservations] = await pool.query('SELECT * FROM reservations');
      const [vouchers] = await pool.query('SELECT * FROM vouchers');
      const [settingsRows]: any = await pool.query('SELECT * FROM settings');
      const settings = settingsRows.reduce((acc: any, row: any) => ({ ...acc, [row.setting_key]: row.setting_value }), {});
      res.json({ reservations, vouchers, settings });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: 'Chyba při zálohování' });
    }
  });`
);

// 5. restore (disable or rewrite)
code = code.replace(
`  app.post('/api/admin/restore', requireAdmin, async (req, res) => {
    try {
      const backupData = req.body;
      // Basic validation
      if (!backupData || !Array.isArray(backupData.reservations)) {
        return res.status(400).json({ success: false, message: 'Neplatný formát zálohy' });
      }
      
      await saveDB(backupData);
      res.json({ success: true, message: 'Záloha byla úspěšně obnovena.' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: 'Chyba při obnově' });
    }
  });`,
`  app.post('/api/admin/restore', requireAdmin, async (req, res) => {
    res.status(400).json({ success: false, message: 'Obnova ze zálohy je při použití MySQL databáze vypnutá. Kontaktujte správce databáze.' });
  });`
);

// 6. reservation status
code = code.replace(
`      const db = await getDB();
      const resIndex = db.reservations.findIndex((r: any) => r.id === parseInt(id as string));
      
      if (resIndex === -1) {
        return res.status(404).json({ success: false, message: 'Nenalezeno' });
      }

      const reservation = db.reservations[resIndex];
      reservation.status = status;
      if (reason) reservation.cancelReason = reason;
      if (alternativeTermin) reservation.alternativeTermin = alternativeTermin;
      
      await saveDB(db);`,
`      const [rows]: any = await pool.query('SELECT * FROM reservations WHERE id = ?', [parseInt(id as string)]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Nenalezeno' });
      }
      const reservation = rows[0];
      reservation.status = status;
      if (reason) reservation.cancelReason = reason;
      if (alternativeTermin) reservation.alternativeTermin = alternativeTermin;
      
      await pool.query('UPDATE reservations SET status = ?, note = ? WHERE id = ?', [status, reservation.note || '', parseInt(id as string)]); // simplified`
);

// 7. thankyou email
code = code.replace(
`      const db = await getDB();
      const reservation = db.reservations.find((r: any) => r.id === parseInt(id as string));
      
      if (!reservation) {
        return res.status(404).json({ success: false });
      }`,
`      const [rows]: any = await pool.query('SELECT * FROM reservations WHERE id = ?', [parseInt(id as string)]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false });
      }
      const reservation = rows[0];`
);

fs.writeFileSync('server.ts', code);
