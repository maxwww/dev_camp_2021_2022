const knex = require('knex');

module.exports = ({ dbHost, dbUser, dbPassword, dbDatabase }) => ({
  db: knex({
    client: 'pg',
    connection: {
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbDatabase,
    },
  }),
});
