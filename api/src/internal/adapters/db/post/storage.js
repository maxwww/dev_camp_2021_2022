module.exports = (db) => ({
  create: (post) => db('posts').returning('id').insert(post),
  getAll: () => db.select().from('posts').orderBy('id'),
  getById: (id) => db.select().first().where('id', id).from('posts'),
  updateById: (id, data) => db('posts').where('id', id).update(data),
  deleteById: (id) => db('posts').where('id', id).del(),
});
