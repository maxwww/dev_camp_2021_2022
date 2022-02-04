module.exports = (storage) => ({
  create: async function (post) {
    const [newPostId] = await storage.create(post);
    // some additional logic
    // send an email for example
    return newPostId;
  },
  getAll: async () => {
    const posts = await storage.getAll();
    // some additional logic
    return posts;
  },
  getById: async (id) => {
    const post = await storage.getById(id);
    // some additional logic
    return post;
  },
  updateById: async (id, data) => {
    await storage.updateById(id, data);
    const post = storage.getById(id);
    // some additional logic
    return post;
  },
  deleteById: async (id) => {
    await storage.deleteById(id);
    // some additional logic
  },
});
