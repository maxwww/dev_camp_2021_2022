const router = require('express').Router();
const db = require('../services/db');

router.get('/', async (req, res) => {
  // TODO: implement me

  res.send(await db.select().from('users').orderBy('id'));
});

router.get('/:id', (req, res) => {
  // TODO: implement me

  res.send('Single record Ok');
});

router.post('/', (req, res) => {
  // TODO: implement me

  console.log(req.url);
  console.log(req.method);
  console.log(req.query);
  console.log(req.params);
  console.log(req.body);

  res.send('Create Ok');
});

router.put('/:id', (req, res) => {
  // TODO: implement me

  res.send('Update Ok');
});

router.delete('/:id', (req, res) => {
  // TODO: implement me

  res.send('Delete Ok');
});

module.exports = router;
