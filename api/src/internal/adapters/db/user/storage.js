module.exports = (db) => ({
  create: (user) => db('users').returning('id').insert(user),
  getAll: () => db.select().from('users').orderBy('id'),
  getById: (id) => db.select().first().where('id', id).from('users'),
  updateById: (id, data) => db('users').where('id', id).update(data),
  deleteById: (id) => db('users').where('id', id).del(),
  getByEmail: (email) =>
    db.select().first().where('email', email).from('users'),
});
