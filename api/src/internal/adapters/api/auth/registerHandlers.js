const asyncHandler = require('#common/asyncHandler');

module.exports = ({ router, service, authMiddleware }) => {
  router.post(
    '/login',
    asyncHandler(async (req, res) => {
      const token = await service.authorize(req.body.email, req.body.password);
      if (token) {
        res.cookie('session_id', token, {
          maxAge: 3600,
          httpOnly: true,
        });

        return res.send({
          success: true,
        });
      }
      res.sendStatus(401);
    }),
  );
  router.post(
    '/logout',
    authMiddleware,
    asyncHandler(async (req, res) => {
      await service.logout(req.session.token);
      res.clearCookie('session_id');

      return res.send({
        success: true,
      });
    }),
  );
};
