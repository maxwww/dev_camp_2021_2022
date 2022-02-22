const router = require('express').Router();

const postStorage = require('../adapters/db/post/storage');
const postService = require('../domain/post/service');
const registerHandlers = require('../adapters/api/post/registerHandlers');

module.exports = ({ postgresqlComposite, authMiddleware, aclMiddleware }) => {
  const storage = postStorage(postgresqlComposite.db);
  const service = postService(storage);
  registerHandlers({ router, service, authMiddleware, aclMiddleware });

  return {
    storage,
    service,
    router,
  };
};
