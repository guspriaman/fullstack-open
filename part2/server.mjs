import { mkdir, copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

// Seed only once. Restarting never overwrites the learner's saved lab entries.
const root = import.meta.dirname;
await mkdir(resolve(root, '.data'), { recursive: true });
const database = resolve(root, '.data/db.json');
try { await copyFile(resolve(root, 'db.json'), database, constants.COPYFILE_EXCL); }
catch (error) { if (error.code !== 'EEXIST') throw error; }
const child = spawn(process.execPath, [resolve(root, 'node_modules/json-server/lib/bin.js'), database, '--host', '127.0.0.1', '--port', '3001'], { stdio: 'inherit', windowsHide: true });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
