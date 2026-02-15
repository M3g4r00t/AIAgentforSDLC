import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('displays hero section with headline', async ({ page }) => {
        const hero = page.locator('h1');
        await expect(hero).toBeVisible();
        await expect(hero).toContainText(/consulting|transform|ibm/i);
    });

    test('shows animated stats counters', async ({ page }) => {
        // Stats section should exist with multiple counters
        const statsSection = page.locator('[class*="stats"], [class*="counter"], [class*="metric"]').first();
        await expect(statsSection).toBeVisible({ timeout: 5000 });
    });

    test('has working CTA buttons', async ({ page }) => {
        const ctaLinks = page.locator('a[href*="services"], a[href*="contact"]');
        const count = await ctaLinks.count();
        expect(count).toBeGreaterThan(0);
    });

    test('displays capabilities preview section', async ({ page }) => {
        // Look for capability/service cards on the homepage
        const cards = page.locator('[class*="card"], [class*="capability"], [class*="service"]');
        await expect(cards.first()).toBeVisible({ timeout: 5000 });
    });

    test('page has proper meta title', async ({ page }) => {
        const title = await page.title();
        expect(title.toLowerCase()).toContain('ibm');
    });
});
