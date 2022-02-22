const router = require('express').Router();

const userStorage = require('../adapters/db/user/storage');
const userService = require('../domain/user/service');
const registerHandlers = require('../adapters/api/user/registerHandlers');

module.exports = ({
  postgresqlComposite,
  config,
  authMiddleware,
  aclMiddleware,
}) => {
  const storage = userStorage(postgresqlComposite.db);
  const service = userService(storage, config);
  registerHandlers({ router, service, authMiddleware, aclMiddleware });

  return {
    storage,
    service,
    router,
  };
};
