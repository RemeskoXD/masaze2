import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DB_FILE = path.join(process.cwd(), 'db.json');

async function migrate() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Připojeno k databázi.');

    // Vytvoření tabulek
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value JSON
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id BIGINT PRIMARY KEY,
        serviceId INT,
        date VARCHAR(50),
        time VARCHAR(50),
        customerName VARCHAR(255),
        phone VARCHAR(100),
        email VARCHAR(255),
        note TEXT,
        totalPrice INT,
        vs VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        createdAt VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id BIGINT PRIMARY KEY,
        type VARCHAR(50),
        value INT NULL,
        service VARCHAR(255) NULL,
        summary VARCHAR(255),
        amount INT,
        recipientName VARCHAR(255),
        senderName VARCHAR(255),
        email VARCHAR(255),
        note TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        voucherCode VARCHAR(50),
        createdAt VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT PRIMARY KEY,
        author VARCHAR(255),
        rating INT,
        text TEXT,
        date VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabulky byly vytvořeny.');

    // Načtení dat z db.json
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const db = JSON.parse(data);

    // Migrace settings
    if (db.settings) {
      for (const [key, value] of Object.entries(db.settings)) {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, JSON.stringify(value), JSON.stringify(value)]
        );
      }
      console.log('✅ Settings migrováno.');
    }

    // Migrace reservations
    if (db.reservations && db.reservations.length > 0) {
      for (const res of db.reservations) {
        await connection.execute(
          `INSERT INTO reservations (id, serviceId, date, time, customerName, phone, email, note, totalPrice, vs, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE id=id`,
          [
            res.id,
            res.serviceId,
            res.date,
            res.time,
            res.customerName,
            res.phone,
            res.email,
            res.note || '',
            res.totalPrice || 0,
            res.vs || '',
            res.status || 'pending',
            res.createdAt || new Date().toISOString()
          ]
        );
      }
      console.log(`✅ Rezervace migrovány (${db.reservations.length}).`);
    } else {
      console.log('ℹ️ Žádné rezervace k migraci.');
    }

    // Migrace vouchers
    if (db.vouchers && db.vouchers.length > 0) {
      for (const vou of db.vouchers) {
        await connection.execute(
          `INSERT INTO vouchers (id, type, value, service, summary, amount, recipientName, senderName, email, note, status, voucherCode, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE id=id`,
          [
            vou.id,
            vou.type,
            vou.value || null,
            vou.service || null,
            vou.summary || '',
            vou.amount || 0,
            vou.recipientName || '',
            vou.senderName || '',
            vou.email || '',
            vou.note || '',
            vou.status || 'pending',
            vou.voucherCode || '',
            vou.createdAt || new Date().toISOString()
          ]
        );
      }
      console.log(`✅ Poukazy migrovány (${db.vouchers.length}).`);
    } else {
      console.log('ℹ️ Žádné poukazy k migraci.');
    }

    await connection.end();
    console.log('🎉 Migrace dokončena!');
  } catch (error) {
    console.error('❌ Chyba při migraci:', error);
  }
}

migrate();
