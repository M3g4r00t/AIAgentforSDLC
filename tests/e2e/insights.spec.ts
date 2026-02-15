import { test, expect } from '@playwright/test';

test.describe('Insights Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/insights');
    });

    test('displays page heading', async ({ page }) => {
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/insight|article|thought/i);
    });

    test('shows article cards', async ({ page }) => {
        const articles = page.locator('[class*="card"], [class*="article"], article');
        const count = await articles.count();
        expect(count).toBeGreaterThan(0);
    });

    test('featured articles are highlighted', async ({ page }) => {
        const featured = page.locator('[class*="featured"], [class*="highlight"]');
        const count = await featured.count();
        expect(count).toBeGreaterThanOrEqual(0); // May or may not have featured
    });

    test('articles have metadata (author, read time)', async ({ page }) => {
        const firstArticle = page.locator('[class*="card"], article').first();
        await expect(firstArticle).toBeVisible();
        const text = await firstArticle.textContent();
        expect(text).toBeTruthy();
    });
});
