import { defineConfig } from "@playwright/test"
/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',

	expect: {
		timeout: 15000,
	},
	// retries: 2,
	use: {
		trace: 'on-first-retry',
		launchOptions: {
			// slowMo: 1000,
		}
	},
});

