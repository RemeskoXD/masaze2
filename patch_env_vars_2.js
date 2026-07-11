import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldPool = `const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST,
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306,
  user: process.env.DB_USER || process.env.DB_USERNAME || process.env.MYSQL_USER,
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
  database: process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});`;

const newPool = `const pool = process.env.DATABASE_URL 
? mysql.createPool(process.env.DATABASE_URL)
: mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST,
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306,
  user: process.env.DB_USER || process.env.DB_USERNAME || process.env.MYSQL_USER,
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
  database: process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE || process.env.MYSQL_DB || process.env.DB_SCHEMA,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});`;

if (code.includes(oldPool)) {
    code = code.replace(oldPool, newPool);
    fs.writeFileSync('server.ts', code);
    console.log("Patched pool env vars 2");
} else {
    console.log("Could not find pool to patch");
}
