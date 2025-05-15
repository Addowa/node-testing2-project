const request = require('supertest');
const server = require('../api/server');
const db = require('../data/db-config');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe('Users endpoints', () => {
    test('GET /api/users returns [] initially', async () => {
      const res = await request(server).get('/api/users');
      expect(res.body).toEqual([]);
    });
  
    test('POST /api/users creates a new user', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({ username: 'Alice' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('username', 'Alice');
    });
  
    test('GET /api/users returns the new user', async () => {
      await request(server).post('/api/users').send({ username: 'Bob' });
      const res = await request(server).get('/api/users');
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('username', 'Bob');
    });
  
    test('GET /api/users/:id returns the correct user', async () => {
      await request(server).post('/api/users').send({ username: 'Charlie' });
      const res = await request(server).get('/api/users/1');
      expect(res.body).toHaveProperty('username', 'Charlie');
    });
  
    test('PUT /api/users/:id updates the user', async () => {
      await request(server).post('/api/users').send({ username: 'Dan' });
      const res = await request(server)
        .put('/api/users/1')
        .send({ username: 'Daniel' });
      expect(res.body).toHaveProperty('username', 'Daniel');
    });
  
    test('DELETE /api/users/:id removes the user', async () => {
      await request(server).post('/api/users').send({ username: 'Eve' });
      const res = await request(server).delete('/api/users/1');
      expect(res.body).toEqual({ message: 'Deleted' });
  
      const res2 = await request(server).get('/api/users');
      expect(res2.body).toEqual([]);
    });
  
    test('GET /api/users/:id returns 404 for missing user', async () => {
      const res = await request(server).get('/api/users/123');
      expect(res.status).toBe(404);
    });
});
