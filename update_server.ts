import fs from 'fs/promises';

async function main() {
  const code = await fs.readFile('server.ts', 'utf8');
  // I will just use sed or completely write it.
}
main();
