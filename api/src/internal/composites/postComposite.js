const router = require('express').Router();

const postStorage = require('../adapters/db/post/storage');
const postService = require('../domain/post/service');
const registerHandlers = require('../adapters/api/post/registerHandlers');

module.exports = ({ postgresqlComposite, authMiddleware }) => {
  const storage = postStorage(postgresqlComposite.db);
  const service = postService(storage);
  registerHandlers({ router, service, authMiddleware });

  return {
    storage,
    service,
    router,
  };
};
