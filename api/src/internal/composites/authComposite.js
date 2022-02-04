const router = require('express').Router();

const sessionStorage = require('../adapters/db/session/storage');
const authService = require('../domain/auth/service');
const registerHandlers = require('../adapters/api/auth/registerHandlers');

module.exports = ({ postgresqlComposite, getUserService, authMiddleware }) => {
  const storage = sessionStorage(postgresqlComposite.db);
  const service = authService(storage, getUserService);

  registerHandlers({ router, service, authMiddleware });

  return {
    storage,
    service,
    router,
  };
};
