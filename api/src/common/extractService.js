module.exports = (service) =>
  typeof service === 'function' ? service() : service;
