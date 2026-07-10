import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes("if (!process.env.ADMIN_TOKEN)")) {
    code = code.replace(
        /const app = express\(\);/,
        `if (!process.env.ADMIN_TOKEN) {
  console.error('FATAL ERROR: ADMIN_TOKEN environment variable is missing.');
  process.exit(1);
}

const app = express();`
    );
    fs.writeFileSync('server.ts', code);
}
