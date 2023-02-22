import { defineConfig } from "@playwright/test"
/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testIdAttribute: 'data-tid',
	expect: {
		timeout: 15000,
	},
	use: {
		trace: 'on-first-retry',
	},
});

