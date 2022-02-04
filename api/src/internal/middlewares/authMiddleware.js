const extractService = require('#common/extractService');
module.exports = (getAuthService) => async (req, res, next) => {
  if (req.cookies.session_id) {
    const authService = extractService(getAuthService);
    const session = await authService.getByToken(req.cookies.session_id);
    if (session) {
      req.session = session;
      return next();
    }
  }
  res.sendStatus(401);
};
