const passwordHasher = require('#common/passwordHasher');

module.exports = (storage, config) => ({
  create: async (user) => {
    user.password = passwordHasher(user.password, config.app.salt);
    const [newUserId] = await storage.create(user);
    // some additional logic
    // send an email for example
    return newUserId;
  },
  getAll: async () => {
    const users = await storage.getAll();
    // some additional logic
    return users;
  },
  getById: async (id) => {
    const user = await storage.getById(id);
    // some additional logic
    return user;
  },
  updateById: async (id, data) => {
    await storage.updateById(id, data);
    const user = storage.getById(id);
    // some additional logic
    return user;
  },
  deleteById: async (id) => {
    await storage.deleteById(id);
    // some additional logic
  },
  getByEmail: async (email) => {
    return storage.getByEmail(email);
  },
  checkPassword: (plainPassword, hash) =>
    hash === passwordHasher(plainPassword, config.app.salt),
});
