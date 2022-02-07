const NotFoundException = require('#internal/errors/NotFoundException');
const UnauthorizedException = require('#internal/errors/UnauthorizedException');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.log('_______________________');
  console.log(err);
  if (err instanceof NotFoundException) {
    return res.status(404).send({ error: err.message });
  } else if (err instanceof UnauthorizedException) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  res.status(500).send('something went wrong ¯\\_(ツ)_/¯');
};
