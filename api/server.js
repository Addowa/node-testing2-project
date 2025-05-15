const express = require('express');
const db = require('../data/db-config');
const server = express();

server.use(express.json());

server.get('/api/users', async (req, res) => {
  const users = await db('users');
  res.json(users);
});

server.post('/api/users', async (req, res) => {
  const [id] = await db('users').insert(req.body);
  const user = await db('users').where({ id }).first();
  res.status(201).json(user);
});

module.exports = server;
