import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('navbar has all main links', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav, header');
        await expect(nav.first()).toBeVisible();

        // Check all main navigation links exist
        const links = ['services', 'insights', 'case-studies', 'contact'];
        for (const link of links) {
            const navLink = page.locator(`a[href*="${link}"]`).first();
            await expect(navLink).toBeVisible();
        }
    });

    test('navbar links navigate correctly', async ({ page }) => {
        await page.goto('/');

        // Click Services link
        await page.locator('a[href*="services"]').first().click();
        await expect(page).toHaveURL(/services/);

        // Click Insights link
        await page.locator('a[href*="insights"]').first().click();
        await expect(page).toHaveURL(/insights/);

        // Click Case Studies link
        await page.locator('a[href*="case-studies"]').first().click();
        await expect(page).toHaveURL(/case-studies/);

        // Click Contact link
        await page.locator('a[href*="contact"]').first().click();
        await expect(page).toHaveURL(/contact/);
    });

    test('IBM logo navigates to home', async ({ page }) => {
        await page.goto('/services');

        // Click the logo/brand link
        const logo = page.locator('a[href="/"]').first();
        await logo.click();
        await expect(page).toHaveURL('/');
    });

    test('footer has link groups', async ({ page }) => {
        await page.goto('/');

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();

        const footerLinks = footer.locator('a');
        const count = await footerLinks.count();
        expect(count).toBeGreaterThan(3);
    });

    test('mobile menu works', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');

        // Look for hamburger menu button
        const menuBtn = page.locator('button[class*="menu"], button[class*="mobile"], button[aria-label*="menu" i]');
        if (await menuBtn.isVisible()) {
            await menuBtn.click();

            // Mobile nav should appear
            const mobileNav = page.locator('[class*="mobile"], [class*="drawer"], [class*="menu"]');
            await expect(mobileNav.first()).toBeVisible({ timeout: 2000 });
        }
    });
});
