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
  it('GET /api/users should return an empty array initially', async () => {
    const res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/users creates a user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({ name: 'Jane', email: 'jane@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Jane');
  });

  it('GET /api/users should return the new user', async () => {
    await db('users').insert({ name: 'Tom', email: 'tom@example.com' });
    const res = await request(server).get('/api/users');
    expect(res.body.length).toBe(1);
    expect(res.body[0].email).toBe('tom@example.com');
  });
});
