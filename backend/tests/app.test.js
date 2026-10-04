const request = require('supertest');
const app = require('../src/app');

describe('DMS Backend Base API Tests', () => {
  it('GET /api/health should return 200 OK with success status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'DMS API is operational');
  });

  it('GET /api/unknown-route should return 404 Not Found', async () => {
    const res = await request(app).get('/api/non-existent-endpoint');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toContain('Cannot find route');
  });
});
