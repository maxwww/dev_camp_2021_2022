const jwt = require('jsonwebtoken');

module.exports = (getAuthService, appKey) => async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    let decoded;
    try {
      decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, appKey, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    } catch (e) {
      // do nothing
    }
    if (decoded) {
      req.session = decoded;
      return next();
    }
  }
  res.sendStatus(401);
};
