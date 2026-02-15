import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration
 * ADR-002: Multi-browser testing with Chromium, Firefox, and WebKit
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { open: 'never' }],
        ['list'],
    ],
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],
    webServer: [
        {
            command: 'cd src/backend && npm start',
            port: 4000,
            reuseExistingServer: !process.env.CI,
            cwd: '../../',
        },
        {
            command: 'cd src/frontend && npm run dev',
            port: 3000,
            reuseExistingServer: !process.env.CI,
            cwd: '../../',
        },
    ],
});
