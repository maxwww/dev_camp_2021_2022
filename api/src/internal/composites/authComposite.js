const router = require('express').Router();
const passport = require('passport');

const sessionStorage = require('../adapters/db/session/storage');
const authService = require('../domain/auth/service');
const registerHandlers = require('../adapters/api/auth/registerHandlers');
const getGoogleStrategy = require('../domain/auth/google.strategy');

module.exports = ({ postgresqlComposite, config, getUserService }) => {
  const storage = sessionStorage(postgresqlComposite.db);
  const service = authService(storage, getUserService, config.app.appKey);
  getGoogleStrategy({
    clientID: config.auth.clientId,
    clientSecret: config.auth.clientSecret,
    getUserService,
    passport,
  });
  registerHandlers({
    router,
    service,
  });

  return {
    storage,
    service,
    router,
    passport,
  };
};
