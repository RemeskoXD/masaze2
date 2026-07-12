import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldPool = `const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});`;

const newPool = `
let dbName = process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE;
if (!dbName && process.env.DATABASE_URL) {
    const match = process.env.DATABASE_URL.match(/\\/([^/?]+)(\\?|$)/);
    if (match) dbName = match[1];
}
if (!dbName) {
    dbName = process.env.DB_USER; // Fallback to user if name is missing (common in shared hosting)
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST,
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306,
  user: process.env.DB_USER || process.env.MYSQL_USER,
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});`;

if (code.includes(oldPool)) {
    code = code.replace(oldPool, newPool);
    fs.writeFileSync('server.ts', code);
    console.log("Patched pool to handle missing DB_NAME");
} else {
    console.log("Could not find pool to patch");
}
