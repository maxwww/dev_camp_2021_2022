const router = require('express').Router();

const sessionStorage = require('../adapters/db/session/storage');
const authService = require('../domain/auth/service');
const registerHandlers = require('../adapters/api/auth/registerHandlers');
const getGoogleStrategy = require('../domain/auth/google.strategy');

module.exports = ({ postgresqlComposite, config, getUserService }) => {
  const storage = sessionStorage(postgresqlComposite.db);
  const service = authService(storage, getUserService, config.app.appKey);
  const googleStrategy = getGoogleStrategy({
    clientID: config.auth.clientId,
    clientSecret: config.auth.clientSecret,
    getUserService,
  });
  registerHandlers({
    router,
    service,
  });

  return {
    storage,
    service,
    router,
    googleStrategy,
  };
};
