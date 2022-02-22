const aclMiddleware = require('#internal/middlewares/aclMiddleware');

module.exports = ({ getUserService }) => {
  const middleware = aclMiddleware(getUserService);

  return {
    middleware,
  };
};
