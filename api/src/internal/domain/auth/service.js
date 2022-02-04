const { v4: uuidv4 } = require('uuid');
const extractService = require('#common/extractService');

module.exports = (storage, getUserService) => ({
  authorize: async (email, password) => {
    const userService = extractService(getUserService);
    const user = await userService.getByEmail(email);
    if (user) {
      if (userService.checkPassword(password, user.password)) {
        const token = uuidv4();
        await storage.create({
          user_id: user.id,
          token,
        });

        return token;
      }
    }
    return '';
  },
  logout: async (token) => {
    await storage.deleteByToken(token);
  },
  getByToken: async (token) => {
    const session = await storage.getByToken(token);

    return session;
  },
});
