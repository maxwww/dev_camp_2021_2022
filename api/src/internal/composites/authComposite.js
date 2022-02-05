const router = require('express').Router();

const sessionStorage = require('../adapters/db/session/storage');
const authService = require('../domain/auth/service');
const registerHandlers = require('../adapters/api/auth/registerHandlers');

module.exports = ({ postgresqlComposite, config, getUserService }) => {
  const storage = sessionStorage(postgresqlComposite.db);
  const service = authService(storage, getUserService, config.app.appKey);

  registerHandlers({
    router,
    service,
  });

  return {
    storage,
    service,
    router,
  };
};
