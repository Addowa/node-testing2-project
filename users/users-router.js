const express = require('express');
const db = require('../data/db-config');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await db('users');
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await db('users').where('id', req.params.id).first();
  user ? res.json(user) : res.status(404).json({ message: 'Not found' });
});

router.post('/', async (req, res) => {
  const [id] = await db('users').insert(req.body);
  const newUser = await db('users').where('id', id).first();
  res.status(201).json(newUser);
});

router.put('/:id', async (req, res) => {
  const count = await db('users').where('id', req.params.id).update(req.body);
  count
    ? res.json(await db('users').where('id', req.params.id).first())
    : res.status(404).json({ message: 'Not found' });
});

router.delete('/:id', async (req, res) => {
  const count = await db('users').where('id', req.params.id).del();
  count ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' });
});

module.exports = router;
