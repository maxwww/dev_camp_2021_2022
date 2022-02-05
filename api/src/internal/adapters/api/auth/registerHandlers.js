const asyncHandler = require('#common/asyncHandler');

module.exports = ({ router, service }) => {
  router.post(
    '/login',
    asyncHandler(async (req, res) => {
      const { accessToken, refreshToken } = await service.authorize(
        req.body.email,
        req.body.password,
      );
      if (accessToken) {
        return res.send({
          accessToken,
          refreshToken,
          success: true,
        });
      }
      res.sendStatus(401);
    }),
  );
  router.post(
    '/refresh',
    asyncHandler(async (req, res) => {
      const { accessToken, refreshToken } = await service.refresh(
        req.body.refreshToken,
      );
      if (accessToken) {
        return res.send({
          accessToken: accessToken,
          refreshToken: refreshToken,
          success: true,
        });
      }
      res.sendStatus(401);
    }),
  );
  router.post(
    '/logout',
    asyncHandler(async (req, res) => {
      await service.logout(req.body.refreshToken);
      return res.send({
        success: true,
      });
    }),
  );
};
