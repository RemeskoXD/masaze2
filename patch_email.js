import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /\/\/ 2\. Zpráva pro zákazníka - Jen informace o přijetí bez příliš slibů[\s\S]*?Telefon: \$\{PHONE_NUMBER\}<\/p>\n        `\n      \};/;

const replacement = `// 2. Zpráva pro zákazníka - Jen informace o přijetí bez příliš slibů
      let qrCodeHtml = '';
      let paymentInstructions = '';
      let paymentConfirmationInfo = '';

      if (finalPrice > 0) {
          if (surnameClean && vs) {
            const depositPrice = finalPrice;
            const qrMsg = removeDiacritics(\`Zaloha Masaze \${surnameClean}\`.slice(0, 60));
            const qrData = \`SPD*1.0*ACC:\${IBAN}*AM:\${depositPrice}.00*CC:CZK*X-VS:\${vs}*MSG:\${qrMsg}\`.toUpperCase();
            const qrImageUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=\${encodeURIComponent(qrData)}\`;
            
            qrCodeHtml = \`
              <div style="margin: 25px 0; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; max-width: 450px; font-family: sans-serif;">
                <h4 style="margin-top: 0; margin-bottom: 15px; font-weight: bold; color: #1e293b; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Jak zálohu zaplatit?</h4>
                <div style="margin-bottom: 20px; font-size: 14px; color: #475569;">
                  <ol style="margin-top: 0; padding-left: 20px; line-height: 1.6;">
                    <li style="margin-bottom: 8px;">Otevřete si v mobilu aplikaci Vaší banky (tzv. mobilní bankovnictví).</li>
                    <li style="margin-bottom: 8px;">Zvolte možnost "Platba QR kódem" (nebo ikonku fotoaparátu).</li>
                    <li>Namiřte fotoaparát na tento QR kód (černobílý čtverec) a údaje se samy vyplní. Pak jen platbu potvrďte.</li>
                  </ol>
                </div>
                <img src="\${qrImageUrl}" alt="QR Platba" width="160" height="160" style="display: block; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px; background-color: white; margin-bottom: 15px;" />
                <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">Nebo můžete zadat údaje ručně:</p>
                  <p style="margin: 0 0 5px 0; font-size: 20px; font-family: 'Georgia', serif; color: #1e293b;">Záloha k úhradě: \${depositPrice} Kč</p>
                  <p style="margin: 0; font-size: 14px; color: #64748b;">Číslo účtu: <strong>\${BANK_ACCOUNT}</strong> (\${BANK_NAME})</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Variabilní symbol: <strong>\${vs}</strong></p>
                </div>
              </div>
            \`;
          }

          paymentInstructions = \`
            <p><strong>Pro potvrzení termínu je potřeba uhradit zálohu ve výši \${finalPrice} Kč.</strong></p>
            \${appliedVoucherCode ? \`<p><em>Z původní ceny byla odečtena hodnota uplatněného poukazu (\${appliedVoucherCode}).</em></p>\` : ''}
            <p>Zálohu prosím uhraďte <strong>nejpozději 24 hodin</strong> před domluveným termínem. Teprve po zaplacení zálohy je Váš termín platný.</p>
            \${qrCodeHtml}
            <div style="background-color: #f8fafc; border-left: 4px solid #cbd5e1; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="margin-top: 0; font-weight: bold; color: #334155;">Storno podmínky a zrušení termínu</p>
              <p style="margin-bottom: 0; color: #475569; font-size: 14px; line-height: 1.5;">Pokud potřebujete termín zrušit nebo přesunout, dejte mi prosím vědět <strong>nejpozději 24 hodin předem</strong> – v takovém případě Vám zálohu v plné výši vrátím. Při pozdějším zrušení bohužel záloha propadá, pokud se spolu nedomluvíme jinak.</p>
            </div>
          \`;
          paymentConfirmationInfo = '<p>Poté, co platbu přijmu (případně schválím termín), Vám zašlu finální potvrzení.</p>';
      } else {
          paymentInstructions = \`
            <p>Vaše rezervace byla plně hrazena z dárkového poukazu <strong>\${appliedVoucherCode}</strong>.</p>
            <div style="background-color: #f8fafc; border-left: 4px solid #cbd5e1; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="margin-top: 0; font-weight: bold; color: #334155;">Storno podmínky a zrušení termínu</p>
              <p style="margin-bottom: 0; color: #475569; font-size: 14px; line-height: 1.5;">Pokud potřebujete termín zrušit nebo přesunout, dejte mi prosím vědět <strong>nejpozději 24 hodin předem</strong>. Při pozdějším zrušení bohužel poukaz propadá, pokud se spolu nedomluvíme jinak.</p>
            </div>
          \`;
          paymentConfirmationInfo = '<p>Jakmile rezervaci schválím, zašlu Vám finální potvrzení.</p>';
      }

      const customerMailOptions = {
        from: \`"Tereza Rozkošná" <\${process.env.SMTP_USER}>\`,
        to: email,
        subject: 'Vaše žádost o rezervaci byla přijata',
        html: \`
          <h3>Dobrý den, \${customerName},</h3>
          <p>Děkuji Vám za zájem. Vaše žádost o rezervaci byla úspěšně přijata.</p>
          <p><strong>Zvolený termín:</strong> \${date} v \${time}</p>
          \${paymentInstructions}
          \${paymentConfirmationInfo}
          <p>V případě potřeby mě neváhejte kontaktovat na telefonu: <strong>\${PHONE_NUMBER}</strong>.</p>
          <hr />
          <p>S pozdravem,</p>
          <p>Tereza Rozkošná<br>Zámek Načeradec 1<br>Telefon: \${PHONE_NUMBER}</p>
        \`
      };`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('server.ts', code);
    console.log('patched email successfully');
} else {
    console.log('failed to match regex');
}
