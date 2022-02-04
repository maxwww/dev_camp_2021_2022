const authMiddleware = require('#internal/middlewares/authMiddleware');

module.exports = ({ getAuthService }) => {
  const middleware = authMiddleware(getAuthService);

  return {
    middleware,
  };
};
