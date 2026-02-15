/**
 * Scraper Service Tests
 * Tests the scraper's ability to parse HTML and handle errors gracefully.
 * Mocks the http instance inside scraper via explicit module patching.
 */

// We need to mock axios BEFORE requiring the scraper
const mockGet = jest.fn();

jest.mock('axios', () => ({
    create: () => ({
        get: mockGet,
    }),
}));

const scraper = require('../services/scraper');

beforeEach(() => {
    mockGet.mockReset();
});

describe('Scraper — Insights', () => {
    test('returns null on network error', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));
        const result = await scraper.scrapeInsights();
        expect(result).toBeNull();
    });

    test('returns empty array for HTML with no matching articles', async () => {
        mockGet.mockResolvedValueOnce({
            data: '<html><body><h1>Empty page</h1></body></html>',
        });
        const result = await scraper.scrapeInsights();
        // No articles matched the filter criteria, so should return empty array
        expect(result).toEqual([]);
    });

    test('extracts articles from valid HTML', async () => {
        const html = `
      <html><body>
        <a href="/think/insights/test-article-about-the-future">
          <h3>The Future of AI in Enterprise Consulting is Now</h3>
          <p>A deep dive into how AI is transforming consulting across industries.</p>
          <span class="category">Artificial Intelligence</span>
        </a>
      </body></html>
    `;
        mockGet.mockResolvedValueOnce({ data: html });
        const result = await scraper.scrapeInsights();
        expect(result).not.toBeNull();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].title).toContain('Future of AI');
        expect(result[0].slug).toBeDefined();
        expect(result[0].url).toContain('ibm.com');
    });
});

describe('Scraper — Case Studies', () => {
    test('returns null on network error', async () => {
        mockGet.mockRejectedValueOnce(new Error('Timeout'));
        const result = await scraper.scrapeCaseStudies();
        expect(result).toBeNull();
    });

    test('extracts case studies from valid HTML', async () => {
        const html = `
      <html><body>
        <a href="/case-studies/ferrari">
          <h3>Scuderia Ferrari HP transforms fan engagement with AI</h3>
          <p>IBM helped Ferrari build an AI-driven platform for millions of fans.</p>
        </a>
      </body></html>
    `;
        mockGet.mockResolvedValueOnce({ data: html });
        const result = await scraper.scrapeCaseStudies();
        expect(result).not.toBeNull();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].slug).toBe('ferrari');
        expect(result[0].url).toContain('ibm.com');
    });
});

describe('Scraper — Services', () => {
    test('returns null on failure', async () => {
        mockGet.mockRejectedValueOnce(new Error('503'));
        const result = await scraper.scrapeServices();
        expect(result).toBeNull();
    });

    test('returns null when no services found', async () => {
        mockGet.mockResolvedValueOnce({
            data: '<html><body><h1>No services here</h1></body></html>',
        });
        const result = await scraper.scrapeServices();
        expect(result).toBeNull();
    });
});
