const { v4: uuidv4 } = require('uuid');
const extractService = require('#common/extractService');
const jwt = require('jsonwebtoken');

module.exports = (storage, getUserService, appKey) => ({
  authorize: async (email, password) => {
    const userService = extractService(getUserService);
    const user = await userService.getByEmail(email);
    if (user) {
      if (userService.checkPassword(password, user.password)) {
        const accessToken = jwt.sign(
          { user_id: user.id, name: user.name },
          appKey,
          {
            expiresIn: '30m',
          },
        );
        const refreshToken = uuidv4();
        await storage.create({
          user_id: user.id,
          token: refreshToken,
        });
        return { accessToken, refreshToken };
      }
    }
    return {};
  },
  refresh: async (refreshToken) => {
    const session = await storage.getByToken(refreshToken);
    if (session) {
      const userService = extractService(getUserService);
      const user = await userService.getById(session.user_id);
      const accessToken = jwt.sign(
        { user_id: user.id, name: user.name },
        appKey,
        {
          expiresIn: '30m',
        },
      );
      const refreshToken = uuidv4();
      await storage.deleteByToken(session.token);
      await storage.create({
        user_id: session.user_id,
        token: refreshToken,
      });
      return { accessToken, refreshToken };
    }
    return {};
  },
  authorizeById: async (id) => {
    const userService = extractService(getUserService);
    const user = await userService.getById(id);
    if (user) {
      const accessToken = jwt.sign(
        { user_id: user.id, name: user.name },
        appKey,
        {
          expiresIn: '30m',
        },
      );
      const refreshToken = uuidv4();
      await storage.create({
        user_id: user.id,
        token: refreshToken,
      });
      return { accessToken, refreshToken };
    }
    return {};
  },
  logout: async (token) => {
    await storage.deleteByToken(token);
  },
  getByToken: async (token) => {
    const session = await storage.getByToken(token);

    return session;
  },
});
