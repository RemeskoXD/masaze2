import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /try \{ await connection\.query\("ALTER TABLE reservations ADD COLUMN vs VARCHAR\(50\);"\); \} catch\(e\) \{\}/;

const replacement = `try { await connection.query("ALTER TABLE reservations ADD COLUMN vs VARCHAR(50);"); } catch(e) {}
    try { await connection.query("ALTER TABLE reservations ADD COLUMN endTime VARCHAR(10);"); } catch(e) {}`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('server.ts', code);
    console.log('patched db init successfully');
} else {
    console.log('failed to match regex db init');
}
