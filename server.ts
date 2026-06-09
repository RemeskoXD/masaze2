import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

// --- Bank account details and contact constants ---
const BANK_ACCOUNT = '3190751019/3030';
const IBAN = 'CZ0330300000003190751019';
const SWIFT = 'AIRACZPP';
const BANK_NAME = 'Air Bank';
const PHONE_NUMBER = '+420 739 303 702';

function removeDiacritics(str: string): string {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getServiceDetails(serviceId: any) {
  const sId = parseInt(serviceId as string);
  const services: { [key: number]: { title: string, price: number } } = {
    1: { title: "Masáž obličeje a hlavy", price: 600 },
    2: { title: "Masáž plosek nohou s peelingem", price: 600 },
    3: { title: "Liftingová masáž obličeje a Gua Sha", price: 900 },
    4: { title: "Hloubková masáž pro svalové uvolnění", price: 700 },
    5: { title: "Hloubková aromatická relaxační masáž (60 min)", price: 1000 },
    51: { title: "Hloubková aromatická relaxační masáž (90 min)", price: 1500 },
    6: { title: "Maderoterapie (tvarování postavy a lymfa)", price: 900 },
    7: { title: "Jemná dětská masáž", price: 400 },
    8: { title: "Uvolňující masáž pro dospívající (teenage)", price: 600 },
    9: { title: "Pečující těhotenská masáž", price: 800 },
    10: { title: "Maderoterapie & Gua Sha (Okamžitá LEHKOST těla i tváře)", price: 1700 },
    11: { title: "Rozjasňující rituál pro unavenou tvář a mysl", price: 1200 }
  };
  return services[sId] || { title: `Masáž (#${sId})`, price: 0 };
}

function getPriceForService(serviceName: string): number {
  if (!serviceName) return 0;
  const services = [
    { title: "Masáž obličeje a hlavy", price: 600 },
    { title: "Masáž plosek nohou s peelingem", price: 600 },
    { title: "Liftingová masáž obličeje a Gua Sha", price: 900 },
    { title: "Hloubková masáž pro svalové uvolnění", price: 700 },
    { title: "Hloubková aromatická relaxační masáž (60 min)", price: 1000 },
    { title: "Hloubková aromatická relaxační masáž", price: 1000 },
    { title: "Hloubková aromatická relaxační masáž (90 min)", price: 1500 },
    { title: "Maderoterapie (tvarování postavy a lymfa)", price: 900 },
    { title: "Jemná dětská masáž", price: 400 },
    { title: "Uvolňující masáž pro dospívající (teenage)", price: 600 },
    { title: "Pečující těhotenská masáž", price: 800 },
    { title: "Maderoterapie & Gua Sha (Okamžitá LEHKOST těla i tváře)", price: 1700 },
    { title: "Rozjasňující rituál pro unavenou tvář a mysl", price: 1200 }
  ];
  
  const found = services.find(s => s.title.toLowerCase().trim() === serviceName.toLowerCase().trim());
  if (found) return found.price;
  
  const match = serviceName.match(/(\d+)\s*(?:Kč)?/);
  if (match) return parseInt(match[1]);
  
  return 0;
}

// --- Simple Local Database ---
const DB_FILE = path.join(process.cwd(), 'db.json');

async function getDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const db = JSON.parse(data);
    if (!db.vouchers) {
      db.vouchers = [];
    }
    if (!db.reservations) {
      db.reservations = [];
    }
    return db;
  } catch (error) {
    // If file doesn't exist, return default structure
    return {
      settings: {
        clientSectionEnabled: false,
      },
      reservations: [],
      vouchers: []
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
  app.use(express.json({ limit: '10mb' }));

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
      const { serviceId, date, time, customerName, phone, email, note, totalPrice, surnameClean, vs } = req.body;

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
        totalPrice,
        vs,
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
      let qrCodeHtml = '';
      if (totalPrice && surnameClean && vs) {
        const qrMsg = removeDiacritics(`Masaze ${surnameClean}`.slice(0, 60));
        const qrData = `SPD*1.0*ACC:${IBAN}*AM:${totalPrice}.00*CC:CZK*X-VS:${vs}*MSG:${qrMsg}`.toUpperCase();
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
        qrCodeHtml = `
          <div style="margin: 25px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; max-width: 400px; font-family: sans-serif;">
            <h4 style="margin-top: 0; margin-bottom: 15px; font-weight: bold; color: #1e293b; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Platba převodem</h4>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; font-size: 24px; font-family: 'Georgia', serif; color: #1e293b;">${totalPrice} Kč</p>
              <p style="margin: 0; font-size: 14px; color: #64748b;">Číslo účtu: <strong>${BANK_ACCOUNT}</strong> (${BANK_NAME})</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Variabilní symbol: <strong>${vs}</strong></p>
            </div>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Naskenujte kód ve Vaší mobilní bankovní aplikaci pro okamžité vyplnění platebních údajů.</p>
            <img src="${qrImageUrl}" alt="QR Platba" width="160" height="160" style="display: block; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px; background-color: white; margin-bottom: 8px;" />
            <p style="font-size: 12px; color: #94a3b8; font-style: italic; margin: 0;">Při platbě přes QR kód se údaje vyplní automaticky.</p>
          </div>
        `;
      }

      const customerMailOptions = {
        from: `"Tereza Rozkošná" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Vaše žádost o rezervaci byla přijata',
        html: `
          <h3>Dobrý den, ${customerName},</h3>
          <p>Děkuji Vám za zájem. Vaše žádost o rezervaci byla úspěšně přijata.</p>
          <p>Zatím se jedná pouze o požadavek. <strong>Termín Vám ještě závazně potvrdím v dalším e-mailu.</strong> <br/><span style="font-size: 12px; color: #666;">(Zkontrolujte si prosím i složku Hromadné nebo SPAM)</span></p>
          <p><strong>Zvolený termín:</strong> ${date} v ${time}</p>
          ${qrCodeHtml}
          <p>V případě potřeby mě neváhejte kontaktovat na telefonu: <strong>${PHONE_NUMBER}</strong>.</p>
          <hr />
          <p>S pozdravem,</p>
          <p>Tereza Rozkošná<br>Zámek Načeradec 1<br>Telefon: ${PHONE_NUMBER}</p>
        `
      };

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          await transporter.sendMail(adminMailOptions);
          await transporter.sendMail(customerMailOptions);
        } catch (mailError) {
          console.error('Nepodařilo se odeslat e-maily pro rezervaci (zkontrolujte SMTP konfiguraci):', mailError);
        }
      }

      res.status(200).json({ success: true, message: 'Rezervace přijata' });
    } catch (error) {
      console.error('Rezervace error:', error);
      res.status(500).json({ success: false, message: 'Chyba serveru' });
    }
  });

  app.post('/api/voucher', async (req, res) => {
    try {
      const { type, value, service, recipientName, senderName, email, note } = req.body;

      if (!recipientName || !senderName || !email) {
        return res.status(400).json({ success: false, message: 'Chybí povinné údaje' });
      }

      const summary = type === 'value' ? `Poukaz v hodnotě ${value} Kč` : `Poukaz na službu: ${service}`;
      const amount = type === 'value' ? parseInt(value) : getPriceForService(service);

      const db = await getDB();
      const newVoucher = {
        id: Date.now(),
        type,
        value: type === 'value' ? parseInt(value) : null,
        service: type === 'service' ? service : null,
        summary,
        amount,
        recipientName,
        senderName,
        email,
        note,
        status: 'pending', // 'pending' | 'paid' | 'cancelled'
        voucherCode: '',
        createdAt: new Date().toISOString()
      };

      db.vouchers.push(newVoucher);
      await saveDB(db);

      const qrMsg = removeDiacritics(`Poukaz ${recipientName}`.slice(0, 60));
      const qrData = `SPD*1.0*ACC:${IBAN}*AM:${amount}.00*CC:CZK*MSG:${qrMsg}`;
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

      const customerMailOptions = {
        from: `"Tereza Rozkošná - Masáže" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Váš dárkový poukaz - pokyny k platbě',
        html: `
          <h3>Dobrý den, ${senderName},</h3>
          <p>děkuji za Váš zájem o dárkový poukaz (${summary}) pro ${recipientName}.</p>
          <p>Prosím o uhrazení částky na náš bankovní účet:</p>
          <ul>
            <li><strong>Banka:</strong> ${BANK_NAME}</li>
            <li><strong>Číslo účtu:</strong> ${BANK_ACCOUNT}</li>
            <li><strong>Částka:</strong> ${amount} Kč</li>
            <li><strong>IBAN:</strong> ${IBAN}</li>
            <li><strong>BIC (SWIFT):</strong> ${SWIFT}</li>
            <li><strong>Zpráva pro příjemce:</strong> Poukaz ${recipientName}</li>
          </ul>

          <div style="margin: 25px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; max-width: 400px; font-family: sans-serif;">
            <p style="margin-top: 0; font-weight: bold; color: #1e293b;">Rychlá platba přes QR kód:</p>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Naskenujte kód ve Vaší mobilní bankovní aplikaci pro okamžité vyplnění platebních údajů.</p>
            <img src="${qrImageUrl}" alt="QR Platba" width="200" height="200" style="display: block; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px; background-color: white;" />
          </div>

          <p>Jakmile obdržíme platbu na účet, Vaši objednávku a poukaz schválíme zpravidla do 48 hodin a pošleme Vám kompletní elektronickou verzi poukazu s jeho jedinečným kódem k vytištění.</p>
          <p><strong>Váš vzkaz na poukazu:</strong> ${note || '-'}</p>
          <p>Pokud budete mít jakékoliv dotazy, můžete mě kontaktovat na telefonu <strong>${PHONE_NUMBER}</strong>.</p>
          <br>
          <p>Hezký den přeje,</p>
          <p>Tereza Rozkošná<br>Zámek Načeradec 1<br>Telefon: ${PHONE_NUMBER}</p>
        `
      };

      const adminMailOptions = {
        from: `"Systém Poukazů" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `🎁 Objednán dárkový poukaz - ${senderName}`,
        html: `
          <h3>Nová objednávka dárkového poukazu</h3>
          <p>Bylo zažádáno o dárkový poukaz a přidáno do administrace ke schválení.</p>
          <p><strong>Typ poukazu:</strong> ${summary}</p>
          <p><strong>Pro koho:</strong> ${recipientName}</p>
          <p><strong>Od koho:</strong> ${senderName}</p>
          <p><strong>E-mail dárce:</strong> ${email}</p>
          <p><strong>Vzkaz:</strong> ${note || '-'}</p>
          <p>Čekáme na úhradu od zákazníka. Nyní naleznete tento poukaz v administraci pod záložkou "Dárkové poukazy".</p>
        `
      };

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          await transporter.sendMail(customerMailOptions);
          await transporter.sendMail(adminMailOptions);
        } catch (mailError) {
          console.error('Nepodařilo se odeslat e-maily pro dárkový poukaz (zkontrolujte SMTP konfiguraci):', mailError);
        }
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
    try {
      const db = await getDB();
      const sorted = [...(db.reservations || [])].sort((a: any, b: any) => b.id - a.id);
      res.json({ success: true, reservations: sorted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru při načítání' });
    }
  });

  app.get('/api/admin/vouchers', requireAdmin, async (req, res) => {
    try {
      const db = await getDB();
      const sorted = [...(db.vouchers || [])].sort((a: any, b: any) => b.id - a.id);
      res.json({ success: true, vouchers: sorted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru při načítání poukazů' });
    }
  });

  app.post('/api/admin/reservation/:id/reschedule', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { newDate, newTime } = req.body;
      const db = await getDB();
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
      
      await saveDB(db);

      // Email to the user about new term
      let htmlBody = `
        <h3>Dobrý den, ${reservation.customerName},</h3>
        <p>Váš termín rezervace masáže byl <strong>změněn z důvodu naší předchozí domluvy nebo organizačních důvodů</strong>.</p>
        <p>Váš nový závazný termín je:</p>
        <p style="font-size: 16px; font-weight: bold; color: #0f5132; background-color: #d1e7dd; padding: 12px 18px; border-radius: 8px; display: inline-block; border: 1px solid #badbcc; font-family: sans-serif; margin: 10px 0;">
          ${newDate} v ${newTime}
        </p>
        <p>Původní termín (${oldDate} v ${oldTime}) byl zrušen.</p>
        <p>Pokud by Vám tento nový termín nevyhovoval, ihned mě prosím informujte odpovědí na tento e-mail nebo telefonicky na čísle <strong>${PHONE_NUMBER}</strong>.</p>
        <p>Těším se na Vás,<br>Tereza Rozkošná</p>
      `;

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          await transporter.sendMail({
              from: `"Tereza Rozkošná" <${process.env.SMTP_USER}>`,
              to: reservation.email,
              subject: 'Změna termínu Vaší masáže',
              html: htmlBody
          });
        } catch (mailError) {
          console.error('Nepodařilo se odeslat e-mail po změně termínu:', mailError);
        }
      }

      res.json({ success: true, message: 'Termín úspěšně změněn.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru' });
    }
  });

  app.post('/api/admin/voucher/:id/status', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'paid' | 'cancelled' | 'pending'
      
      const db = await getDB();
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
      
      await saveDB(db);

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        let subject = '';
        let htmlBody = '';

        if (status === 'paid') {
          subject = `💝 Váš dárkový poukaz je připraven! (Kód: ${voucherCode})`;
          
          const recipientName = voucher.recipientName;
          const senderName = voucher.senderName;
          const summary = voucher.summary;
          const note = voucher.note;
          
          htmlBody = `
            <div style="font-family: 'Georgia', serif; color: #1c3d27; background-color: #f4f6f4; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e7e1;">
                
                <div style="background-color: #113f28; padding: 30px; text-align: center; border-bottom: 3px solid #d4af37;">
                  <h2 style="color: #d4af37; margin: 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: normal; letter-spacing: 1px;">Tereza Rozkošná</h2>
                  <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Celostní masáže & regenerace</p>
                </div>

                <div style="padding: 30px 40px;">
                  <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 25px; font-family: 'Arial', sans-serif;">
                    Dobrý den, ${senderName},<br><br>
                    s radostí Vám potvrzujeme přijetí platby za objednaný dárkový poukaz. V textu níže naleznete Váš aktivní <strong>Dárkový poukaz</strong>, který můžete vytisknout nebo jej přeposlat obdarované osobě.
                  </p>

                  <div style="background-color: #ffffff; border: 4px double #d4af37; border-radius: 12px; padding: 35px 25px; text-align: center; margin: 30px 0; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15); font-family: 'Georgia', serif; position: relative;">
                    
                    <div style="color: #8c102a; font-size: 36px; font-weight: normal; font-style: italic; margin-bottom: 20px; line-height: 1.1;">
                      Dárkový poukaz
                    </div>

                    <div style="font-size: 40px; color: #d4af37; margin-bottom: 25px;">
                      💝
                    </div>

                    <div style="margin: 20px 0 15px 0; text-align: left; border-bottom: 1px solid #d4af37; padding-bottom: 8px;">
                      <span style="font-size: 11px; color: #8e8d88; text-transform: uppercase; letter-spacing: 3px; display: block; margin-bottom: 4px; font-weight: bold; font-family: 'Arial', sans-serif;">PRO:</span>
                      <span style="font-size: 18px; color: #1c3d27; font-weight: bold; font-family: 'Arial', sans-serif;">${recipientName}</span>
                    </div>

                    <div style="margin: 15px 0; text-align: left; border-bottom: 1px solid #d4af37; padding-bottom: 8px;">
                      <span style="font-size: 11px; color: #8e8d88; text-transform: uppercase; letter-spacing: 3px; display: block; margin-bottom: 4px; font-weight: bold; font-family: 'Arial', sans-serif;">HODNOTA / SLUŽBA:</span>
                      <span style="font-size: 18px; color: #8c102a; font-weight: bold; font-family: 'Arial', sans-serif;">${summary}</span>
                    </div>

                    <div style="background-color: #fbfaf5; border: 1px dashed #d4af37; border-radius: 8px; padding: 12px; margin: 25px 0 10px 0; text-align: center;">
                      <span style="font-size: 11px; color: #8e8d88; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 4px; font-family: 'Arial', sans-serif;">JEDINEČNÝ KÓD POUKAZU (pro rezervaci):</span>
                      <strong style="font-size: 22px; color: #1c3d27; letter-spacing: 3px; font-family: 'Courier New', Courier, monospace;">${voucherCode}</strong>
                    </div>

                    ${note ? `
                    <div style="margin: 20px 0; padding: 10px; border-left: 3px solid #d4af37; background-color: #fcfcf9; text-align: left; font-family: 'Arial', sans-serif; font-size: 13px; color: #555555; font-style: italic;">
                      "${note}"
                    </div>
                    ` : ''}

                    <div style="font-size: 11px; color: #555555; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; font-family: 'Arial', sans-serif; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
                      <strong>TEREZA ROZKOŠNÁ — MASÁŽE & REGENERACE</strong><br>
                      ZÁMEK NAČERADEC, 257 08<br>
                      TEL: ${PHONE_NUMBER}<br>
                      celkovazdravi@gmail.com
                    </div>
                  </div>

                  <p style="font-size: 14px; line-height: 1.6; color: #555555; margin-top: 25px; font-family: 'Arial', sans-serif;">
                    <strong>Jak uplatnit poukaz?</strong><br>
                    Obdarovaný si může vybrat libovolný termín masáže prostřednictvím našich webových stránek a do poznámky při rezervaci uvést kód <strong>${voucherCode}</strong>. Případně nás může kontaktovat přímo telefonicky na čísle <strong>${PHONE_NUMBER}</strong>.
                  </p>

                  <p style="font-size: 14px; line-height: 1.6; color: #555555; margin-top: 20px; font-family: 'Arial', sans-serif;">
                    Děkujeme Vám za nákup a důvěru. Přejeme spoustu radosti z darovaného odpočinku!
                  </p>

                  <div style="margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center; font-size: 13px; color: #8e8d88; font-family: 'Arial', sans-serif;">
                    S přáním krásného dne,<br>
                    <strong>Tereza Rozkošná</strong><br>
                    Zámek Načeradec 1, 257 08 Načeradec
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (status === 'cancelled') {
          subject = `Upozornění ke stornu objednávky dárkového poukazu`;
          htmlBody = `
            <h3>Dobrý den, ${voucher.senderName},</h3>
            <p>Omlouváme se, Vaše objednávka dárkového poukazu pro <strong>${voucher.recipientName}</strong> byla stornována administrátorem.</p>
            <p>Pokud se jednalo o omyl nebo potřebujete více informací, kontaktujte nás na telefonu <strong>${PHONE_NUMBER}</strong>.</p>
            <br>
            <p>S pozdravem,<br>Tereza Rozkošná</p>
          `;
        }

        if (subject && htmlBody) {
          try {
            await transporter.sendMail({
              from: `"Tereza Rozkošná" <${process.env.SMTP_USER}>`,
              to: voucher.email,
              subject,
              html: htmlBody
            });
          } catch (mailError) {
            console.error('Nepodařilo se odeslat stavový e-mail poukazu:', mailError);
          }
        }
      }

      res.json({ success: true, voucherCode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Chyba serveru' });
    }
  });

  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const db = await getDB();
      db.settings = { ...db.settings, ...req.body };
      await saveDB(db);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  });

  app.get('/api/admin/backup', requireAdmin, async (req, res) => {
    try {
      const db = await getDB();
      res.json(db);
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: 'Chyba při zálohování' });
    }
  });

  app.post('/api/admin/restore', requireAdmin, async (req, res) => {
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
  });

  app.post('/api/admin/reservation/:id/status', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reason, alternativeTermin } = req.body; // 'confirmed', 'paid', 'cancelled', 'pending'
      
      const db = await getDB();
      const resIndex = db.reservations.findIndex((r: any) => r.id === parseInt(id as string));
      
      if (resIndex === -1) {
        return res.status(404).json({ success: false, message: 'Nenalezeno' });
      }

      const reservation = db.reservations[resIndex];
      reservation.status = status;
      if (reason) reservation.cancelReason = reason;
      if (alternativeTermin) reservation.alternativeTermin = alternativeTermin;
      await saveDB(db);

      // Send automated emails based on new status
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        let subject = '';
        let htmlBody = '';

        if (status === 'confirmed') {
          subject = 'Závazné potvrzení Vaší rezervace a instrukce';
          const sDetails = getServiceDetails(reservation.serviceId);
          const amount = reservation.totalPrice || sDetails.price;
          let qrCodeHtml = '';
          if (amount > 0) {
            const qrMsg = removeDiacritics(`Rezervace ${reservation.surnameClean || reservation.customerName}`).slice(0, 60);
            const qrData = `SPD*1.0*ACC:${IBAN}*AM:${amount}.00*CC:CZK${reservation.vs ? `*X-VS:${reservation.vs}` : ''}*MSG:${qrMsg}`.toUpperCase();
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
            qrCodeHtml = `
              <div style="margin: 25px 0; padding: 15px; border: 1px solid #e0eae0; border-radius: 12px; background-color: #f7f9f7; max-width: 400px; font-family: sans-serif;">
                <p style="margin-top: 0; font-weight: bold; color: #1e3a1e;">Údaje pro platbu (pokud si přejete zaplatit předem převodem):</p>
                <ul style="padding-left: 20px; font-size: 14px; margin-bottom: 10px; color: #2c4a2c;">
                  <li><strong>Banka:</strong> ${BANK_NAME}</li>
                  <li><strong>Číslo účtu:</strong> ${BANK_ACCOUNT}</li>
                  <li><strong>Částka:</strong> ${amount} Kč</li>
                  ${reservation.vs ? `<li><strong>Variabilní symbol:</strong> ${reservation.vs}</li>` : ''}
                  <li><strong>Zpráva pro příjemce:</strong> Rezervace ${reservation.surnameClean || reservation.customerName}</li>
                </ul>
                <p style="font-size: 13px; color: #4a5d4a; margin-bottom: 12px;">Nebo naskenujte QR kód pro rychlou platbu:</p>
                <img src="${qrImageUrl}" alt="QR Platba" width="180" height="180" style="display: block; border: 1px solid #cbd5cb; border-radius: 6px; padding: 4px; background-color: white;" />
                <p style="font-size: 12px; color: #94a3b8; font-style: italic; margin-top: 8px;">Při platbě přes QR kód se údaje vyplní automaticky.</p>
              </div>
            `;
          }

          htmlBody = `
            <h3>Dobrý den, ${reservation.customerName},</h3>
            <p>S radostí Vám potvrzuji Váš termín rezervace.</p>
            <p><strong>Služba:</strong> ${sDetails.title}</p>
            <p><strong>Termín:</strong> ${reservation.date} v ${reservation.time}</p>
            <p><strong>Instrukce před masáží:</strong></p>
            <ul>
              <li>Přijďte prosím cca 5-10 minut předem.</li>
              <li>Před masáží doporučuji nejíst těžká jídla.</li>
              <li>Najdete mě: Zámek Načeradec 1, 257 08.</li>
            </ul>
            ${qrCodeHtml}
            <p>V případě potřeby změny termínu mě prosím kontaktujte na telefonu <strong>${PHONE_NUMBER}</strong>.</p>
            <p>Těším se na Vás,<br>Tereza Rozkošná<br>Zámek Načeradec 1<br>Telefon: ${PHONE_NUMBER}</p>
          `;
        } else if (status === 'paid') {
          subject = 'Potvrzení přijetí platby za rezervaci';
          htmlBody = `
            <h3>Dobrý den, ${reservation.customerName},</h3>
            <p>potvrzuji, že Vaše úhrada za rezervaci v termínu <strong>${reservation.date} v ${reservation.time}</strong> byla v pořádku přijata na náš účet.</p>
            <p>Děkuji a budu se těšit!</p>
            <p>V případě jakýchkoliv dotazů nebo změn mě kontaktujte na telefonu <strong>${PHONE_NUMBER}</strong>.</p>
            <p>S pozdravem,<br>Tereza Rozkošná<br>Zámek Načeradec 1<br>Telefon: ${PHONE_NUMBER}</p>
          `;
        } else if (status === 'cancelled') {
          subject = 'Zrušení / úprava Vaší rezervace termínu';
          let bodyTextAlternative = '';
          if (alternativeTermin) {
            bodyTextAlternative = `
              <p>Jako náhradu Vám paní masérka navrhuje tento <strong>náhradní termín:</strong></p>
              <p style="font-size: 16px; font-weight: bold; color: #0f5132; background-color: #d1e7dd; padding: 12px 18px; border-radius: 8px; display: inline-block; border: 1px solid #badbcc; font-family: sans-serif; margin: 10px 0;">
                ${alternativeTermin}
              </p>
              <p>Pokud Vám navrhovaný náhradní termín vyhovuje, stačí odpovědět na tento e-mail nebo mě kontaktovat telefonicky.</p>
            `;
          }
          
          let bodyTextReason = '';
          if (reason) {
            bodyTextReason = `
              <p><strong>Důvod zrušení:</strong> ${reason}</p>
            `;
          }

          htmlBody = `
            <h3>Dobrý den, ${reservation.customerName},</h3>
            <p>Omlouváme se, Vaše rezervace na termín <strong>${reservation.date} v ${reservation.time}</strong> musela být zrušena.</p>
            ${bodyTextReason}
            ${bodyTextAlternative}
            <p>V případě dotazů mě neváhejte kontaktovat telefonicky na <strong>${PHONE_NUMBER}</strong>.</p>
            <p>Děkujeme za pochopení a budeme se těšit na náhradní setkání.</p>
            <hr />
            <p>S pozdravem,<br>Tereza Rozkošná<br>Zámek Načeradec 1<br>Telefon: ${PHONE_NUMBER}</p>
          `;
        }

        if (subject && htmlBody) {
           try {
              await transporter.sendMail({
                 from: `"Tereza Rozkošná" <${process.env.SMTP_USER}>`,
                 to: reservation.email,
                 subject,
                 html: htmlBody
              });
           } catch (mailError) {
              console.error('Nepodařilo se odeslat stavový e-mail (zkontrolujte SMTP konfiguraci):', mailError);
           }
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
        try {
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
                <p>S úctou a přáním pevného zdraví,<br>Tereza Rozkošná<br>Zámek Načeradec 1<br>Telefon: ${PHONE_NUMBER}</p>
              `
          });
        } catch (mailError) {
          console.error('Nepodařilo se odeslat poděkování (zkontrolujte SMTP konfiguraci):', mailError);
        }
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
