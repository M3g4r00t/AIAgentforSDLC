const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Load data
const insights = require('./data/insights.json');
const caseStudies = require('./data/case-studies.json');

// ─── Health Check ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ibm-consulting-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Insights API ───────────────────────────────────────────
app.get('/api/insights', (req, res) => {
  const { category, featured } = req.query;
  let result = [...insights];

  if (category) {
    result = result.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }
  if (featured === 'true') {
    result = result.filter(i => i.featured);
  }

  res.json({ data: result, total: result.length });
});

app.get('/api/insights/:slug', (req, res) => {
  const insight = insights.find(i => i.slug === req.params.slug);
  if (!insight) return res.status(404).json({ error: 'Insight not found' });
  res.json({ data: insight });
});

// ─── Case Studies API ───────────────────────────────────────
app.get('/api/case-studies', (req, res) => {
  const { industry } = req.query;
  let result = [...caseStudies];

  if (industry) {
    result = result.filter(c => c.industry.toLowerCase().includes(industry.toLowerCase()));
  }

  res.json({ data: result, total: result.length });
});

app.get('/api/case-studies/:slug', (req, res) => {
  const study = caseStudies.find(c => c.slug === req.params.slug);
  if (!study) return res.status(404).json({ error: 'Case study not found' });
  res.json({ data: study });
});

// ─── Services (static) ─────────────────────────────────────
app.get('/api/services', (req, res) => {
  res.json({
    data: [
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
    ],
  });
});

// ─── Contact form (mock) ────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // In production, this would send an email or write to a DB.
  console.log(`[CONTACT] From: ${name} <${email}> | Company: ${company || 'N/A'}`);
  res.json({ success: true, message: 'Thank you for your inquiry. We will be in touch shortly.' });
});

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 IBM Consulting API running on port ${PORT}`);
});
