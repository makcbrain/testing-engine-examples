import { join } from 'node:path';
import { $ } from 'bun';

const buildScript = join(import.meta.dir, 'build.ts');
const serverScript = join(import.meta.dir, 'server.ts');

console.log('Building React app...');
await $`bun run ${buildScript}`;

console.log('Starting server...');
await $`bun run ${serverScript}`;
