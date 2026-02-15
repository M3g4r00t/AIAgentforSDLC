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
        },
        {
            id: 'ai',
            title: 'AI & Automation',
            description: 'Deploy enterprise AI at scale with IBM watsonx and intelligent automation platforms.',
            icon: 'ai',
        },
        {
            id: 'cloud',
            title: 'Cloud Transformation',
            description: 'Modernize infrastructure with hybrid cloud architectures on Red Hat OpenShift and IBM Cloud.',
            icon: 'cloud',
        },
        {
            id: 'security',
            title: 'Cybersecurity Services',
            description: 'Protect your enterprise with zero-trust architecture and quantum-safe security strategies.',
            icon: 'security',
        },
        {
            id: 'data',
            title: 'Data & Analytics',
            description: 'Unlock the value of your data with modern data platforms, governance, and real-time analytics.',
            icon: 'data',
        },
        {
            id: 'sustainability',
            title: 'Sustainability',
            description: 'Accelerate your ESG goals with IBM Envizi and end-to-end sustainability transformation.',
            icon: 'sustainability',
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
