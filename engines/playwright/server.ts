import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PORT = 3000;

Bun.serve({
	port: PORT,
	fetch(req) {
		const url = new URL(req.url);
		const pathname = url.pathname === '/' ? '/app.html' : url.pathname;

		try {
			const filePath = join(import.meta.dir, 'public', pathname);
			const file = readFileSync(filePath);

			let contentType = 'text/html';
			if (pathname.endsWith('.js')) {
				contentType = 'application/javascript';
			} else if (pathname.endsWith('.css')) {
				contentType = 'text/css';
			} else if (pathname.endsWith('.map')) {
				contentType = 'application/json';
			}

			return new Response(file, {
				headers: { 'Content-Type': contentType },
			});
		} catch {
			return new Response('Not Found', { status: 404 });
		}
	},
});

console.log(`Server running at http://localhost:${PORT}`);
