import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

const oldReservationLogic = `      const db = await getDB();
      const newReservation = {
        id: Date.now(),
        serviceId,
        date,
        time,
        customerName,
        phone,
        email,
        note,
        totalPrice,
        vs,
        status: 'pending', // 'pending' | 'confirmed' | 'paid' | 'cancelled'
        createdAt: new Date().toISOString()
      };

      db.reservations.push(newReservation);
      await saveDB(db);`;

const newReservationLogic = `      const connection = await pool.getConnection();
      let resId;
      try {
        await connection.beginTransaction();

        // ZAMKNE záznamy pro daný datum a čas, takže žádný jiný request nemůže tento termín zarezervovat
        const [existing]: any = await connection.query(
          'SELECT id FROM reservations WHERE date = ? AND time = ? AND status != ? FOR UPDATE',
          [date, time, 'cancelled']
        );

        if (existing.length > 0) {
          await connection.rollback();
          return res.status(409).json({ success: false, message: 'Tento termín již někdo před zlomkem sekundy obsadil. Vyberte si prosím jiný.' });
        }

        resId = Date.now();
        await connection.query(
          \`INSERT INTO reservations (id, serviceId, date, time, customerName, phone, email, note, totalPrice, vs, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
          [resId, serviceId, date, time, customerName, phone, email, note || '', totalPrice || 0, vs || '', 'pending', new Date().toISOString()]
        );

        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
      
      const newReservation = {
        id: resId,
        serviceId,
        date,
        time,
        customerName,
        phone,
        email,
        note,
        totalPrice,
        vs,
        status: 'pending'
      };`;

code = code.replace(oldReservationLogic, newReservationLogic);
fs.writeFileSync('server.ts', code);
