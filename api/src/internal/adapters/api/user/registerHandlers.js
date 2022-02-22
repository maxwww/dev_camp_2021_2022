const asyncHandler = require('#common/asyncHandler');

module.exports = ({ router, service, authMiddleware, aclMiddleware }) => {
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const users = await service.getAll();
      res.send(users);
    }),
  );
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const user = await service.getById(req.params.id);
      if (user) {
        return res.send(user);
      }
      res.sendStatus(404);
    }),
  );
  router.post(
    '/',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const newUserId = await service.create(req.body);
      return res.status(201).send({
        id: newUserId,
      });
    }),
  );
  router.put(
    '/:id',
    authMiddleware,
    aclMiddleware({
      resource: 'user',
      action: 'update',
      possession: 'own',
      getResource: (req) => service.getById(req.params.id),
      isOwn: (resource, userId) => resource.id === userId,
    }),
    asyncHandler(async (req, res) => {
      const newUserId = await service.updateById(req.params.id, req.body);
      return res.status(201).send({
        id: newUserId,
      });
    }),
  );
};
