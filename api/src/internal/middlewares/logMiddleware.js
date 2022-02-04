module.exports = (options) => (req, res, next) => {
  const { db, logTableName } = options;
  db(logTableName)
    .insert({
      method: req.method,
      path: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    })
    .then(() => {
      next();
    });
};
