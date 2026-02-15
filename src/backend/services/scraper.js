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

// ─── Image Fallbacks (Unsplash Source) ──────────────────────
const FALLBACK_IMAGES = {
    ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    cybersecurity: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    data: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80',
    automation: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=800&q=80',
    quantum: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    consulting: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    sustainability: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    finance: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    supply: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    talent: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    experience: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    operations: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&w=800&q=80',
    strategy: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    marketing: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
    modernization: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    default: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
};

function getImageForTopic(title, category, scrapedImage) {
    // If scraped image looks valid (e.g. from known reliable CDNs), try to use it
    // But for this fix, we prioritize reliability over exact match if scraped one might be hotlink-blocked
    // IBM Assets (assets.ibm.com) usually work, but let's be safe.

    const text = (title + ' ' + category).toLowerCase();

    // Service-specific matches (high priority)
    if (text.includes('finance') || text.includes('fintech')) return FALLBACK_IMAGES.finance;
    if (text.includes('supply') || text.includes('chain') || text.includes('logistics')) return FALLBACK_IMAGES.supply;
    if (text.includes('talent') || text.includes('people') || text.includes('hr') || text.includes('workforce')) return FALLBACK_IMAGES.talent;
    if (text.includes('experience') || text.includes('design') || text.includes('customer') || text.includes('ix')) return FALLBACK_IMAGES.experience;
    if (text.includes('operations') || text.includes('business') || text.includes('process') || text.includes('operate')) return FALLBACK_IMAGES.operations;
    if (text.includes('strategy') || text.includes('advise')) return FALLBACK_IMAGES.strategy;
    if (text.includes('market') || text.includes('brand') || text.includes('commerce')) return FALLBACK_IMAGES.marketing;
    if (text.includes('modern') || text.includes('app') || text.includes('legacy') || text.includes('build')) return FALLBACK_IMAGES.modernization;

    // General topics
    if (text.includes('ai') || text.includes('generative') || text.includes('intelligence')) return FALLBACK_IMAGES.ai;
    if (text.includes('cloud') || text.includes('hybrid') || text.includes('openshift')) return FALLBACK_IMAGES.cloud;
    if (text.includes('security') || text.includes('cyber') || text.includes('hack') || text.includes('trust')) return FALLBACK_IMAGES.cybersecurity;
    if (text.includes('data') || text.includes('analytics') || text.includes('lakehouse')) return FALLBACK_IMAGES.data;
    if (text.includes('auto') || text.includes('robot') || text.includes('efficient')) return FALLBACK_IMAGES.automation;
    if (text.includes('quantum') || text.includes('compute')) return FALLBACK_IMAGES.quantum;
    if (text.includes('sustain') || text.includes('green') || text.includes('climate')) return FALLBACK_IMAGES.sustainability;
    if (text.includes('consult') || text.includes('strat') || text.includes('transform')) return FALLBACK_IMAGES.consulting;

    // Use scraped image if available and no specific topic match found, otherwise default
    return scrapedImage || FALLBACK_IMAGES.default;
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
                    image: getImageForTopic(title, category || 'Technology', extractImageUrl(img)),
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
                    image: getImageForTopic(title, 'Case Study', extractImageUrl(img)),
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
                    image: getImageForTopic(title, 'Consulting Service', null),
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
