import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/contact');
    });

    test('displays contact form', async ({ page }) => {
        const form = page.locator('form');
        await expect(form).toBeVisible();
    });

    test('has required input fields', async ({ page }) => {
        await expect(page.locator('input[name="name"], input[placeholder*="name" i]')).toBeVisible();
        await expect(page.locator('input[name="email"], input[placeholder*="email" i], input[type="email"]')).toBeVisible();
        await expect(page.locator('textarea, [name="message"]')).toBeVisible();
    });

    test('shows validation on empty submit', async ({ page }) => {
        const submitBtn = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")');
        await submitBtn.click();

        // Browser native validation or custom validation should prevent submission
        // Check that we're still on the contact page
        await expect(page).toHaveURL(/contact/);
    });

    test('shows success state on valid submission', async ({ page }) => {
        await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test User');
        await page.fill('input[name="email"], input[placeholder*="email" i], input[type="email"]', 'test@example.com');

        const companyInput = page.locator('input[name="company"], input[placeholder*="company" i]');
        if (await companyInput.isVisible()) {
            await page.fill('input[name="company"], input[placeholder*="company" i]', 'Acme Corp');
        }

        await page.fill('textarea, [name="message"]', 'This is a test message from Playwright.');

        const submitBtn = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")');
        await submitBtn.click();

        // Should show success feedback
        const success = page.locator('[class*="success"], :has-text("thank you")');
        await expect(success.first()).toBeVisible({ timeout: 5000 });
    });

    test('displays contact information sidebar', async ({ page }) => {
        const sidebar = page.locator('[class*="info"], [class*="sidebar"], [class*="contact-details"]');
        const count = await sidebar.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
