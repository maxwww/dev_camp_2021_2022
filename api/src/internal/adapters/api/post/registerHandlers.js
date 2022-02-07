const asyncHandler = require('#common/asyncHandler');
const NotFoundException = require('#internal/errors/NotFoundException');

module.exports = ({ router, service, authMiddleware }) => {
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const posts = await service.getAll();
      res.send(posts);
    }),
  );
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const post = await service.getById(req.params.id);
      if (post) {
        return res.send(post);
      }

      throw new NotFoundException('post not found');
    }),
  );
  router.post(
    '/',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const newPostId = await service.create({
        ...req.body,
        user_id: req.auth.user_id,
      });
      return res.status(201).send({
        id: newPostId,
      });
    }),
  );
  router.put(
    '/:id',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const newPostId = await service.create(req.body);
      return res.status(201).send({
        id: newPostId,
      });
    }),
  );
};
