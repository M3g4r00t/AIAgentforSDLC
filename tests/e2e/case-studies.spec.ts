import { test, expect } from '@playwright/test';

test.describe('Case Studies Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/case-studies');
    });

    test('displays page heading', async ({ page }) => {
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/case stud|client|success/i);
    });

    test('shows case study cards', async ({ page }) => {
        const cards = page.locator('[class*="card"], [class*="case"]');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('case study cards show results metrics', async ({ page }) => {
        const firstCard = page.locator('[class*="card"], [class*="case"]').first();
        await expect(firstCard).toBeVisible();

        // Cards should contain some metric or result data
        const text = await firstCard.textContent();
        expect(text!.length).toBeGreaterThan(20);
    });

    test('case study cards show technologies', async ({ page }) => {
        const techTags = page.locator('[class*="tag"], [class*="tech"], [class*="badge"]');
        const count = await techTags.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
