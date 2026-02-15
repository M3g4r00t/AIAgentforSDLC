import { test, expect } from '@playwright/test';

test.describe('Services Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/services');
    });

    test('displays page heading', async ({ page }) => {
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/service|capabilit|expertise/i);
    });

    test('shows service cards', async ({ page }) => {
        const cards = page.locator('[class*="card"], [class*="service"]');
        const count = await cards.count();
        expect(count).toBeGreaterThanOrEqual(4);
    });

    test('each service card has title and description', async ({ page }) => {
        const firstCard = page.locator('[class*="card"], [class*="service"]').first();
        await expect(firstCard).toBeVisible();

        const title = firstCard.locator('h2, h3, h4').first();
        await expect(title).toBeVisible();

        const description = firstCard.locator('p').first();
        await expect(description).toBeVisible();
    });

    test('has call-to-action section', async ({ page }) => {
        const cta = page.locator('a[href*="contact"]');
        const count = await cta.count();
        expect(count).toBeGreaterThan(0);
    });
});
