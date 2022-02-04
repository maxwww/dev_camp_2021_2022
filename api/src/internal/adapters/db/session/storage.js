module.exports = (db) => ({
  create: (session) => db('sessions').insert(session),
  getByToken: (token) =>
    db.select().first().where('token', token).from('sessions'),
  deleteByToken: (token) => db('sessions').where('token', token).del(),
  deleteAllTokens: (userId) => db('sessions').where('user_id', userId).del(),
});
