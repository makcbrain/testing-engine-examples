import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = join(import.meta.dir, 'public', 'dist');

try {
	await rm(distDir, { recursive: true, force: true });
} catch {}

await mkdir(distDir, { recursive: true });

await Bun.build({
	entrypoints: [join(import.meta.dir, 'src', 'main.tsx')],
	outdir: distDir,
	target: 'browser',
	minify: false,
	sourcemap: 'external',
	splitting: false,
});

console.log('Build completed successfully!');
