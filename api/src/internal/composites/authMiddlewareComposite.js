const authMiddleware = require('#internal/middlewares/authMiddleware');

module.exports = ({ getAuthService, config }) => {
  const middleware = authMiddleware(getAuthService, config.app.appKey);

  return {
    middleware,
  };
};
