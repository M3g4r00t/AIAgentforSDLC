const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const contentCache = require('./services/cache');
const strategistService = require('./services/strategist');

const app = express();
const PORT = process.env.PORT || 4000;
const CACHE_REFRESH_INTERVAL = process.env.CACHE_REFRESH_MS || 6 * 60 * 60 * 1000; // 6 hours

// ─── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ibm-consulting-api',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    cache: contentCache.getStatus(),
  });
});

// ─── Insights API ───────────────────────────────────────────
app.get('/api/insights', (req, res) => {
  const { category, featured } = req.query;
  const { data, source } = contentCache.getInsights();
  let result = [...data];

  if (category) {
    result = result.filter(i =>
      (i.category || '').toLowerCase() === category.toLowerCase()
    );
  }
  if (featured === 'true') {
    result = result.filter(i => i.featured);
  }

  res.json({ data: result, total: result.length, source });
});

app.get('/api/insights/:slug', (req, res) => {
  const { data } = contentCache.getInsights();
  const insight = data.find(i => i.slug === req.params.slug);
  if (!insight) return res.status(404).json({ error: 'Insight not found' });
  res.json({ data: insight });
});

// ─── Case Studies API ───────────────────────────────────────
app.get('/api/case-studies', (req, res) => {
  const { industry } = req.query;
  const { data, source } = contentCache.getCaseStudies();
  let result = [...data];

  if (industry) {
    result = result.filter(c =>
      (c.industry || '').toLowerCase().includes(industry.toLowerCase())
    );
  }

  res.json({ data: result, total: result.length, source });
});

app.get('/api/case-studies/:slug', (req, res) => {
  const { data } = contentCache.getCaseStudies();
  const study = data.find(c => c.slug === req.params.slug);
  if (!study) return res.status(404).json({ error: 'Case study not found' });
  res.json({ data: study });
});

// ─── Services API ───────────────────────────────────────────
app.get('/api/services', (req, res) => {
  const { data, source } = contentCache.getServices();
  res.json({ data, source });
});

// ─── Contact form (mock) ────────────────────────────────────
// ─── Contact form (mock) ────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  console.log(`[CONTACT] From: ${name} <${email}> | Company: ${company || 'N/A'}`);
  res.json({ success: true, message: 'Thank you for your inquiry. We will be in touch shortly.' });
});

// ─── Oracle API ─────────────────────────────────────────────
app.post('/api/oracle/ask', async (req, res) => {
  try {
    const { query, persona } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const response = await oracleService.askOracle(query, persona || 'default');
    res.json(response);
  } catch (error) {
    console.error('Oracle Error:', error);
    res.status(500).json({ error: 'Oracle unavailable' });
  }
});

// ─── Error handling ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start server & warm cache ──────────────────────────────
async function start() {
  // Warm cache on startup (non-blocking)
  contentCache.warmCache().catch(err => {
    console.error(`[STARTUP] Cache warming failed: ${err.message}`);
  });

  // Schedule periodic cache refresh
  setInterval(() => {
    console.log('[SCHEDULER] Refreshing content cache...');
    contentCache.warmCache().catch(err => {
      console.error(`[SCHEDULER] Cache refresh failed: ${err.message}`);
    });
  }, CACHE_REFRESH_INTERVAL);

  app.listen(PORT, () => {
    console.log(`🚀 IBM Consulting API v2.0 running on port ${PORT}`);
    console.log(`📦 Cache refresh interval: ${CACHE_REFRESH_INTERVAL / 1000 / 60} minutes`);
  });
}

// Export app for testing (supertest)
module.exports = app;

// Start if run directly
if (require.main === module) {
  start();
}
