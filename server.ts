import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

// --- Simple Local Database ---
const DB_FILE = path.join(process.cwd(), 'db.json');

async function getDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return default structure
    return {
      settings: {
        clientSectionEnabled: false,
      },
      reservations: []
    };
  }
}

async function saveDB(data: any) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Ensure DB exists on startup
getDB().then(saveDB);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Basic admin authentication middleware for /api/admin/* routes
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'admin123') { // in real world, use secure token/password logic
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };

  // --- PUBLIC API Routes ---

  app.get('/api/settings', async (req, res) => {
    const db = await getDB();
    res.json(db.settings);
  });

  app.post('/api/reservation', async (req, res) => {
    try {
      const { serviceId, date, time, customerName, phone, email, note } = req.body;

      if (!serviceId || !date || !time || !customerName || !phone || !email) {
        return res.status(400).json({ success: false, message: 'Chybí povinné údaje' });
      }

      const db = await getDB();
      const newReservation = {
        id: Date.now(),
        serviceId,
        date,
        time,
        customerName,
        phone,
        email,
        note,
        status: 'pending', // 'pending' | 'confirmed' | 'paid' | 'cancelled'
        createdAt: new Date().toISOString()
      };

      db.reservations.push(newReservation);
      await saveDB(db);

      // 1. Zpráva pro Terezu (administrátora)
      const adminMailOptions = {
        from: `"Rezervační systém" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `📍 Nová rezervace: ${customerName}`,
        html: `
          <h3>Nová rezervace z webu</h3>
          <p><strong>Zákazník:</strong> ${customerName}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Služba ID:</strong> ${serviceId}</p>
          <p><strong>Termín:</strong> ${date} v ${time}</p>
          <p><strong>Poznámka:</strong> ${note || '-'}</p>
        `
      };

      // 2. Zpráva pro zákazníka - Jen informace o přijetí bez příliš slibů
      const customerMailOptions = {
        from: `"Tereza Rozkošná" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Vaše žádost o rezervaci byla přijata',
        html: `
          <h3>Dobrý den, ${customerName},</h3>
          <p>Děkuji Vám za zájem. Vaše žádost o rezervaci byla úspěšně přijata.</p>
          <p>Zatím se jedná pouze o požadavek. <strong>Termín Vám ještě závazně potvrdím v dalším e-mailu.</strong></p>
          <p><strong>Zvolený termín:</strong> ${date} v ${time}</p>
          <hr />
          <p>S pozdravem,</p>
          <p>Tereza Rozkošná<br>Zámek Načeradec</p>
        `
      };

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(customerMailOptions);
      }

      res.status(200).json({ success: true, message: 'Rezervace přijata' });
    } catch (error) {
      console.error('Rezervace error:', error);
      res.status(500).json({ success: false, message: 'Chyba serveru' });
    }
  });

  app.post('/api/voucher', async (req, res) => {
    // ... existující kód voucheru beze změny logic, upraven export
    try {
      const { type, value, service, recipientName, senderName, email, note } = req.body;

      if (!recipientName || !senderName || !email) {
        return res.status(400).json({ success: false, message: 'Chybí povinné údaje' });
      }

      const summary = type === 'value' ? `Poukaz v hodnotě ${value} Kč` : `Poukaz na službu: ${service}`;

      const customerMailOptions = {
        from: `"Tereza Rozkošná - Masáže" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Váš dárkový poukaz - pokyny k platbě',
        html: `
          <h3>Dobrý den, ${senderName},</h3>
          <p>děkuji za Váš zájem o dárkový poukaz (${summary}) pro ${recipientName}.</p>
          <p>Prosím o uhrazení částky na náš bankovní účet:</p>
          <ul>
            <li><strong>Číslo účtu:</strong> 123456789/0100 (Doplnit reálný účet)</li>
            <li><strong>Zpráva pro příjemce:</strong> Poukaz ${recipientName}</li>
          </ul>
          <p>Jakmile přijmeme platbu, pošleme Vám elektronickou verzi poukazu.</p>
          <p><strong>Váš vzkaz na poukazu:</strong> ${note || '-'}</p>
          <br>
          <p>Hezký den přeje,</p>
          <p>Tereza Rozkošná</p>
        `
      };

      const adminMailOptions = {
        from: `"Systém Poukazů" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `🎁 Objednán dárkový poukaz - ${senderName}`,
        html: `
          <h3>Nová objednávka dárkového poukazu</h3>
          <p>Bylo zažádáno o dárkový poukaz.</p>
          <p><strong>Typ poukazu:</strong> ${summary}</p>
          <p><strong>Pro koho:</strong> ${recipientName}</p>
          <p><strong>Od koho:</strong> ${senderName}</p>
          <p><strong>E-mail dárce:</strong> ${email}</p>
          <p><strong>Vzkaz:</strong> ${note || '-'}</p>
          <p>Čekáme na úhradu od zákazníka.</p>
        `
      };

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        await transporter.sendMail(customerMailOptions);
        await transporter.sendMail(adminMailOptions);
      }

      res.status(200).json({ success: true, message: 'Objednávka poukazu odeslána' });
    } catch (error) {
      console.error('Voucher error:', error);
      res.status(500).json({ success: false, message: 'Chyba serveru při objednávce' });
    }
  });

  // --- ADMIN API Routes ---
  
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') { // heslo natvrdo pro demonstraci
      res.json({ success: true, token: 'admin123' });
    } else {
      res.json({ success: false });
    }
  });

  app.get('/api/admin/reservations', requireAdmin, async (req, res) => {
    const db = await getDB();
    // Sort reservations new -> old
    const sorted = [...db.reservations].sort((a,b) => b.id - a.id);
    res.json({ success: true, reservations: sorted });
  });

  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    const db = await getDB();
    db.settings = { ...db.settings, ...req.body };
    await saveDB(db);
    res.json({ success: true });
  });

  // Status updates and automated emails
  app.post('/api/admin/reservation/:id/status', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'confirmed', 'paid', 'cancelled'
      
      const db = await getDB();
      const resIndex = db.reservations.findIndex((r: any) => r.id === parseInt(id as string));
      
      if (resIndex === -1) {
        return res.status(404).json({ success: false, message: 'Nenalezeno' });
      }

      const reservation = db.reservations[resIndex];
      reservation.status = status;
      await saveDB(db);

      // Send automated emails based on new status
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        let subject = '';
        let htmlBody = '';

        if (status === 'confirmed') {
          subject = 'Závazné potvrzení Vaší rezervace a instrukce';
          htmlBody = `
            <h3>Dobrý den, ${reservation.customerName},</h3>
            <p>S radostí Vám potvrzuji Váš termín rezervace.</p>
            <p><strong>Termín:</strong> ${reservation.date} v ${reservation.time}</p>
            <p><strong>Instrukce před masáží:</strong></p>
            <ul>
              <li>Přijďte prosím cca 5-10 minut předem.</li>
              <li>Před masáží doporučuji nejíst těžká jídla.</li>
              <li>Najdete mě: Zámek Načeradec 1, 257 08.</li>
            </ul>
            <p>V případě potřeby změny termínu mě prosím kontaktujte.</p>
            <p>Těším se na Vás,<br>Tereza Rozkošná</p>
          `;
        } else if (status === 'paid') {
          subject = 'Potvrzení přijetí platby za rezervaci';
          htmlBody = `
            <h3>Dobrý den, ${reservation.customerName},</h3>
            <p>potvrzuji, že Vaše úhrada za rezervaci v termínu <strong>${reservation.date} v ${reservation.time}</strong> byla v pořádku přijata na náš účet.</p>
            <p>Děkuji a budu se těšit!</p>
            <p>Tereza Rozkošná</p>
          `;
        }

        if (subject && htmlBody) {
           await transporter.sendMail({
              from: `"Tereza Rozkošná" <${process.env.SMTP_USER}>`,
              to: reservation.email,
              subject,
              html: htmlBody
           });
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru' });
    }
  });

  // Manual thank you email
  app.post('/api/admin/reservation/:id/thankyou', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const db = await getDB();
      const reservation = db.reservations.find((r: any) => r.id === parseInt(id as string));
      
      if (!reservation) {
        return res.status(404).json({ success: false });
      }

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        await transporter.sendMail({
            from: `"Tereza Rozkošná" <${process.env.SMTP_USER}>`,
            to: reservation.email,
            subject: 'Poděkování za návštěvu masáže',
            html: `
              <h3>Dobrý den, ${reservation.customerName},</h3>
              <p>ještě jednou moc děkuji za Vaši dnešní návštěvu. Doufám, že se po masáži cítíte uvolněně a zregenerovaně.</p>
              <p>Nezapomeňte dnes pít více vody, aby se podpořilo vyplavování toxinů a dozněly uvolňující účinky masáže.</p>
              <p>Kdykoliv budete potřebovat znovu zrelaxovat, ráda Vás opět uvidím.</p>
              <p>Mějte krásný zbytek dne.</p>
              <p>S úctou,<br>Tereza Rozkošná</p>
            `
        });
      }

      res.json({ success: true, message: 'Poděkování odesláno' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  });

  // Vite middleware for development or Express static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
