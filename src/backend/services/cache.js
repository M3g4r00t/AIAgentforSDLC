/**
 * Content Cache Service
 * 
 * ADR-003: In-memory cache using node-cache with TTL-based eviction.
 * Falls back to static JSON files when scraper fails.
 * 
 * Cache warming runs on:
 *   - Server startup
 *   - Scheduled interval (default: every 6 hours)
 */

const NodeCache = require('node-cache');
const path = require('path');
const scraper = require('./scraper');

// TTL in seconds
const TTL_ARTICLES = 6 * 60 * 60;     // 6 hours
const TTL_CASE_STUDIES = 6 * 60 * 60;  // 6 hours
const TTL_SERVICES = 24 * 60 * 60;     // 24 hours

const cache = new NodeCache({
    stdTTL: TTL_ARTICLES,
    checkperiod: 600, // Check for expired keys every 10 min
    useClones: false,  // Performance: return references, not copies
});

// ─── Static fallback data ───────────────────────────────────

function getStaticInsights() {
    try {
        delete require.cache[require.resolve('../data/insights.json')];
        return require('../data/insights.json');
    } catch {
        return [];
    }
}

function getStaticCaseStudies() {
    try {
        delete require.cache[require.resolve('../data/case-studies.json')];
        return require('../data/case-studies.json');
    } catch {
        return [];
    }
}

function getStaticServices() {
    return [
        {
            id: 'strategy',
            title: 'Strategy Consulting',
            description: 'Transform your business model with data-driven strategy and AI-powered decision frameworks.',
            icon: 'strategy',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
            partners: ['IBM watsonx', 'Microsoft OpenAI', 'Adobe']
        },
        {
            id: 'experience',
            title: 'Experience Design (iX)',
            description: 'Create human-centric digital experiences that drive customer loyalty and business growth.',
            icon: 'design',
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'technology',
            title: 'Technology Transformation',
            description: 'Build robust, scalable platforms with hybrid cloud technology and modern engineering.',
            icon: 'code',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
            partners: ['Microsoft Azure', 'AWS', 'Red Hat', 'Google Cloud']
        },
        {
            id: 'operations',
            title: 'Business Operations',
            description: 'Optimize workflows and supply chains with intelligent automation and process mining.',
            icon: 'operations',
            image: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'data',
            title: 'Data & Analytics',
            description: 'Unlock the value of your data with modern data platforms, governance, and real-time analytics.',
            icon: 'data',
            image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'finance',
            title: 'Finance Transformation',
            description: 'Modernize finance operations with AI-driven insights and automated reporting.',
            icon: 'finance',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'talent',
            title: 'Talent & Transformation',
            description: 'Empower your workforce with HR transformation and digital skills development.',
            icon: 'people',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'security',
            title: 'Cybersecurity Services',
            description: 'Protect your enterprise with zero-trust architecture and quantum-safe security strategies.',
            icon: 'security',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'sustainability',
            title: 'Sustainability',
            description: 'Accelerate your ESG goals with IBM Envizi and end-to-end sustainability transformation.',
            icon: 'sustainability',
            image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
        },
    ];
}

// ─── Cache Access Methods ───────────────────────────────────

function getInsights() {
    const cached = cache.get('insights');
    if (cached && cached.length > 0) return { data: cached, source: 'live' };
    return { data: getStaticInsights(), source: 'static' };
}

function getCaseStudies() {
    const cached = cache.get('caseStudies');
    if (cached && cached.length > 0) return { data: cached, source: 'live' };
    return { data: getStaticCaseStudies(), source: 'static' };
}

function getServices() {
    const cached = cache.get('services');
    if (cached && cached.length > 0) return { data: cached, source: 'live' };
    return { data: getStaticServices(), source: 'static' };
}

// ─── Cache Warming ──────────────────────────────────────────

async function warmCache() {
    console.log('[CACHE] Warming cache...');
    const results = { insights: false, caseStudies: false, services: false };

    try {
        const insights = await scraper.scrapeInsights();
        if (insights && insights.length > 0) {
            cache.set('insights', insights, TTL_ARTICLES);
            results.insights = true;
            console.log(`[CACHE] Cached ${insights.length} insights (TTL: ${TTL_ARTICLES}s)`);
        } else {
            console.log('[CACHE] Insights scrape returned empty, using static fallback');
        }
    } catch (e) {
        console.error(`[CACHE] Insights warming failed: ${e.message}`);
    }

    try {
        const studies = await scraper.scrapeCaseStudies();
        if (studies && studies.length > 0) {
            cache.set('caseStudies', studies, TTL_CASE_STUDIES);
            results.caseStudies = true;
            console.log(`[CACHE] Cached ${studies.length} case studies (TTL: ${TTL_CASE_STUDIES}s)`);
        } else {
            console.log('[CACHE] Case studies scrape returned empty, using static fallback');
        }
    } catch (e) {
        console.error(`[CACHE] Case studies warming failed: ${e.message}`);
    }

    try {
        const services = await scraper.scrapeServices();
        if (services && services.length > 0) {
            cache.set('services', services, TTL_SERVICES);
            results.services = true;
            console.log(`[CACHE] Cached ${services.length} services (TTL: ${TTL_SERVICES}s)`);
        } else {
            console.log('[CACHE] Services scrape returned empty, using static fallback');
        }
    } catch (e) {
        console.error(`[CACHE] Services warming failed: ${e.message}`);
    }

    console.log(`[CACHE] Warming complete: ${JSON.stringify(results)}`);
    return results;
}

// ─── Cache Status ───────────────────────────────────────────

function getStatus() {
    const stats = cache.getStats();
    return {
        keys: cache.keys(),
        hits: stats.hits,
        misses: stats.misses,
        ksize: stats.ksize,
        vsize: stats.vsize,
        insights: {
            cached: cache.has('insights'),
            count: cache.get('insights')?.length || 0,
            ttl: cache.getTtl('insights') ? Math.round((cache.getTtl('insights') - Date.now()) / 1000) : 0,
        },
        caseStudies: {
            cached: cache.has('caseStudies'),
            count: cache.get('caseStudies')?.length || 0,
            ttl: cache.getTtl('caseStudies') ? Math.round((cache.getTtl('caseStudies') - Date.now()) / 1000) : 0,
        },
        services: {
            cached: cache.has('services'),
            count: cache.get('services')?.length || 0,
            ttl: cache.getTtl('services') ? Math.round((cache.getTtl('services') - Date.now()) / 1000) : 0,
        },
    };
}

module.exports = {
    getInsights,
    getCaseStudies,
    getServices,
    warmCache,
    getStatus,
};
