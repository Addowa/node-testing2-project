const express = require('express');
const db = require('../../data/db-config');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await db('users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const [{ count }] = await db('users').count('id as count');
    res.json({ count: Number(count) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get count' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await db('users').where({ id: req.params.id }).first();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user' });
  }
});

router.post('/', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  try {
    const [id] = await db('users').insert({ username });
    const newUser = await db('users').where({ id }).first();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const count = await db('users').where({ id: req.params.id }).update(req.body);
    if (count) {
      const updated = await db('users').where({ id: req.params.id }).first();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const count = await db('users').where({ id: req.params.id }).del();
    if (count) {
      res.json({ message: 'Deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;

