import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from './server';

describe('API Endpoints', () => {
  it('should fetch gold price', async () => {
    const res = await request(app).get('/api/gold/price');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('price');
    expect(res.body.unit).toBe('gram');
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('should login successfully with dummy user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
