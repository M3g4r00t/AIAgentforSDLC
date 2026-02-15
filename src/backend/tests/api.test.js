/**
 * API Tests — Health, Insights, Case Studies, Services, Contact
 * Uses supertest to test Express routes without starting the server.
 */

const request = require('supertest');
const app = require('../index');

describe('Health Endpoints', () => {
    test('GET / returns status ok', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('ibm-consulting-api');
        expect(res.body.version).toBeDefined();
    });

    test('GET /api/health returns cache status', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.cache).toBeDefined();
        expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    });
});

describe('Insights API', () => {
    test('GET /api/insights returns array of insights', async () => {
        const res = await request(app).get('/api/insights');
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.total).toBeGreaterThanOrEqual(0);
        expect(res.body.source).toBeDefined();
    });

    test('GET /api/insights?featured=true returns only featured', async () => {
        const res = await request(app).get('/api/insights?featured=true');
        expect(res.status).toBe(200);
        res.body.data.forEach(insight => {
            expect(insight.featured).toBe(true);
        });
    });

    test('GET /api/insights?category=AI filters by category', async () => {
        const res = await request(app).get('/api/insights?category=AI');
        expect(res.status).toBe(200);
        res.body.data.forEach(insight => {
            expect(insight.category.toLowerCase()).toBe('ai');
        });
    });

    test('GET /api/insights/:slug returns 404 for unknown slug', async () => {
        const res = await request(app).get('/api/insights/nonexistent-slug');
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
    });
});

describe('Case Studies API', () => {
    test('GET /api/case-studies returns array', async () => {
        const res = await request(app).get('/api/case-studies');
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.total).toBeGreaterThanOrEqual(0);
    });

    test('GET /api/case-studies/:slug returns 404 for unknown', async () => {
        const res = await request(app).get('/api/case-studies/nonexistent');
        expect(res.status).toBe(404);
    });
});

describe('Services API', () => {
    test('GET /api/services returns services array', async () => {
        const res = await request(app).get('/api/services');
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);

        // Each service should have required fields
        res.body.data.forEach(service => {
            expect(service.id).toBeDefined();
            expect(service.title).toBeDefined();
            expect(service.description).toBeDefined();
        });
    });
});

describe('Contact API', () => {
    test('POST /api/contact succeeds with valid data', async () => {
        const res = await request(app)
            .post('/api/contact')
            .send({ name: 'Test User', email: 'test@example.com', message: 'Hello!' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/contact fails with missing fields', async () => {
        const res = await request(app)
            .post('/api/contact')
            .send({ name: 'Test' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });
});
