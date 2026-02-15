/**
 * IBM Content Scraper Service
 * 
 * Fetches and normalizes content from IBM's public web properties:
 *   - ibm.com/consulting  → Services & customer stories
 *   - ibm.com/think       → Articles & thought leadership
 *   - ibm.com/case-studies → Client success stories
 * 
 * ADR-001: Hybrid approach — scrape on schedule, cache results, fall back to static JSON.
 */

const axios = require('axios');
const cheerio = require('cheerio');

const USER_AGENT = 'IBMConsultingShowcase/1.0 (+https://github.com/M3g4r00t/AIAgentforSDLC)';
const TIMEOUT = 15000;

const http = axios.create({
    timeout: TIMEOUT,
    headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
    },
});

// ─── Helpers ────────────────────────────────────────────────

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 80);
}

function extractImageUrl(src) {
    if (!src) return null;
    if (src.startsWith('http')) return src;
    if (src.startsWith('//')) return `https:${src}`;
    return `https://www.ibm.com${src}`;
}

// ─── Scrape IBM Think (Articles) ────────────────────────────

async function scrapeInsights() {
    try {
        const { data: html } = await http.get('https://www.ibm.com/think');
        const $ = cheerio.load(html);
        const articles = [];

        // Extract article links and metadata from the Think page
        $('a[href*="/think/"]').each((_, el) => {
            const $el = $(el);
            const href = $el.attr('href') || '';
            const title = $el.find('h3, h4, [class*="title"]').first().text().trim()
                || $el.text().trim();
            const summary = $el.find('p, [class*="description"], [class*="summary"]').first().text().trim();
            const category = $el.find('[class*="category"], [class*="eyebrow"], [class*="tag"]').first().text().trim();
            const author = $el.find('[class*="author"]').first().text().trim();
            const img = $el.find('img').first().attr('src');

            // Filter: only real articles with proper titles
            if (
                title.length > 10 &&
                title.length < 200 &&
                href.includes('/think/') &&
                !href.includes('/think/podcasts') &&
                !href.includes('#')
            ) {
                const fullUrl = href.startsWith('http') ? href : `https://www.ibm.com${href}`;
                articles.push({
                    slug: slugify(title),
                    title,
                    summary: summary || `Explore IBM's latest insights on ${category || 'technology'}.`,
                    category: category || 'Technology',
                    author: author || 'IBM Think',
                    date: new Date().toISOString().split('T')[0],
                    readTime: `${Math.floor(Math.random() * 8) + 4} min read`,
                    featured: articles.length < 3,
                    url: fullUrl,
                    image: extractImageUrl(img),
                });
            }
        });

        // Deduplicate by slug
        const seen = new Set();
        const unique = articles.filter(a => {
            if (seen.has(a.slug)) return false;
            seen.add(a.slug);
            return true;
        });

        console.log(`[SCRAPER] Scraped ${unique.length} insights from IBM Think`);
        return unique.slice(0, 20); // Cap at 20 articles
    } catch (error) {
        console.error(`[SCRAPER] Failed to scrape insights: ${error.message}`);
        return null; // Signals cache to use fallback
    }
}

// ─── Scrape IBM Case Studies ────────────────────────────────

async function scrapeCaseStudies() {
    try {
        const { data: html } = await http.get('https://www.ibm.com/case-studies');
        const $ = cheerio.load(html);
        const studies = [];

        // Extract case study cards
        $('a[href*="/case-studies/"]').each((_, el) => {
            const $el = $(el);
            const href = $el.attr('href') || '';
            const title = $el.find('h2, h3, h4, [class*="title"]').first().text().trim()
                || $el.text().trim();
            const description = $el.find('p, [class*="description"]').first().text().trim();
            const img = $el.find('img').first().attr('src');

            // Extract the client name from the URL slug
            const urlSlug = href.split('/case-studies/').pop()?.split('?')[0] || '';

            if (
                urlSlug &&
                urlSlug.length > 2 &&
                title.length > 5 &&
                title.length < 200 &&
                !href.includes('#search')
            ) {
                const fullUrl = href.startsWith('http') ? href : `https://www.ibm.com${href}`;
                studies.push({
                    slug: urlSlug,
                    client: title,
                    industry: 'Technology',
                    challenge: description || `See how IBM Consulting helped transform ${title}.`,
                    results: [
                        { metric: 'Digital Transformation', value: 'Achieved' },
                        { metric: 'Time to Value', value: 'Accelerated' },
                    ],
                    technologies: ['IBM Consulting', 'Cloud', 'AI'],
                    url: fullUrl,
                    image: extractImageUrl(img),
                    featured: studies.length < 2,
                });
            }
        });

        // Deduplicate by slug
        const seen = new Set();
        const unique = studies.filter(s => {
            if (seen.has(s.slug)) return false;
            seen.add(s.slug);
            return true;
        });

        console.log(`[SCRAPER] Scraped ${unique.length} case studies from IBM`);
        return unique.slice(0, 15);
    } catch (error) {
        console.error(`[SCRAPER] Failed to scrape case studies: ${error.message}`);
        return null;
    }
}

// ─── Scrape IBM Consulting (Services) ───────────────────────

async function scrapeServices() {
    try {
        const { data: html } = await http.get('https://www.ibm.com/consulting');
        const $ = cheerio.load(html);
        const services = [];

        // Look for service/capability sections
        $('a[href*="/consulting/"]').each((_, el) => {
            const $el = $(el);
            const href = $el.attr('href') || '';
            const title = $el.find('h2, h3, h4, [class*="title"]').first().text().trim()
                || $el.text().trim();
            const description = $el.find('p, [class*="description"]').first().text().trim();

            const serviceSlug = href.split('/consulting/').pop()?.split('?')[0] || '';

            if (
                serviceSlug &&
                serviceSlug.length > 2 &&
                serviceSlug.length < 40 &&
                title.length > 3 &&
                title.length < 100 &&
                !serviceSlug.includes('/')
            ) {
                const fullUrl = href.startsWith('http') ? href : `https://www.ibm.com${href}`;
                services.push({
                    id: serviceSlug,
                    title,
                    description: description || `IBM Consulting ${title} services.`,
                    icon: serviceSlug,
                    url: fullUrl,
                });
            }
        });

        // Deduplicate by id
        const seen = new Set();
        const unique = services.filter(s => {
            if (seen.has(s.id)) return false;
            seen.add(s.id);
            return true;
        });

        console.log(`[SCRAPER] Scraped ${unique.length} services from IBM Consulting`);
        return unique.length > 0 ? unique : null; // Fall back if nothing scraped
    } catch (error) {
        console.error(`[SCRAPER] Failed to scrape services: ${error.message}`);
        return null;
    }
}

// ─── Scrape individual article for full content ─────────────

async function scrapeArticle(url) {
    try {
        const { data: html } = await http.get(url);
        const $ = cheerio.load(html);

        const title = $('h1').first().text().trim();
        const content = $('article, [class*="article"], [class*="content"]')
            .first()
            .find('p')
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(p => p.length > 20)
            .join('\n\n');

        const author = $('[class*="author"], [rel="author"]').first().text().trim();
        const date = $('time, [class*="date"]').first().text().trim();

        return {
            title: title || null,
            content: content || null,
            author: author || null,
            date: date || null,
        };
    } catch (error) {
        console.error(`[SCRAPER] Failed to scrape article ${url}: ${error.message}`);
        return null;
    }
}

module.exports = {
    scrapeInsights,
    scrapeCaseStudies,
    scrapeServices,
    scrapeArticle,
};
