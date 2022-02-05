module.exports = {
  app: {
    port: process.env.APP_PORT,
    salt: process.env.SALT,
    appKey: process.env.APP_KEY,
  },
  db: {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
  },
};
