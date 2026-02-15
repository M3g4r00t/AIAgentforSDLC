const cacheService = require('./cache');

/**
 * Simulates a RAG (Retrieval-Augmented Generation) system.
 * It searches the cache for relevant content based on queries and
 * generates a "persona-aware" response.
 */

// Keyword mappings to simulate "understanding" without a real LLM for MVP
const KEYWORDS = {
    finance: ['cost', 'risk', 'profit', 'finance', 'money', 'budget', 'audit'],
    tech: ['cloud', 'ai', 'data', 'security', 'cyber', 'architecture', 'code', 'stack'],
    marketing: ['brand', 'customer', 'experience', 'design', 'growth', 'sales', 'campaign'],
    strategy: ['transformation', 'model', 'operating', 'change', 'vision'],
};

function getRelevanceScore(text, query) {
    if (!text) return 0;
    const qWords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    const tWords = text.toLowerCase();
    let score = 0;
    qWords.forEach(w => {
        if (tWords.includes(w)) score += 1;
    });
    return score;
}

exports.askStrategist = async (query, persona) => {
    // 1. Get cached data
    const insights = cacheService.getInsights().data || [];
    const caseStudies = cacheService.getCaseStudies().data || [];
    const services = cacheService.getServices().data || [];

    const allContent = [
        ...insights.map(i => ({ ...i, type: 'Insight' })),
        ...caseStudies.map(c => ({ ...c, type: 'Case Study' })),
        ...services.map(s => ({ ...s, type: 'Service' }))
    ];

    // 2. Search for relevant content
    const results = allContent
        .map(item => ({
            item,
            score: getRelevanceScore((item.title + ' ' + item.summary + ' ' + (item.description || '')), query)
        }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3) // Top 3 results
        .map(r => r.item);

    // 3. Generate "AI" Response (Template-based for MVP)
    let answer = '';
    const context = results.length > 0 ? results[0].title : null;

    if (results.length === 0) {
        answer = "I'm analyzing our global database, but I couldn't find specific cached insights matching your query right now. However, I can connect you with an IBM expert who specializes in this area.";
    } else {
        // Persona-based customization
        const baseAnswer = `Based on our latest ${results[0].type.toLowerCase()}, "${results[0].title}", `;

        switch (persona) {
            case 'cfo':
                answer = `${baseAnswer} implementing this approach can significantly optimize operational costs and mitigate financial risk. It's a key driver for ROI in the current market.`;
                break;
            case 'cto':
                answer = `${baseAnswer} this technology stack is critical for scalable architecture. It integrates seamlessly with hybrid cloud environments and leverages generative AI to accelerate development.`;
                break;
            case 'cmo':
                answer = `${baseAnswer} this strategy is proven to enhance customer engagement and drive brand loyalty. It focuses on personalized experiences that convert.`;
                break;
            default:
                answer = `${baseAnswer} IBM Consulting recommends this approach to drive business transformation and innovation.`;
        }
    }

    return {
        answer,
        sources: results.map(r => ({ title: r.title, url: r.link || '#' }))
    };
};
