import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./engines/vitest/vitest.setup.ts'],
		include: ['./engines/vitest/tests/**/*.test.{ts,tsx}'],
		css: false,
	},
});
