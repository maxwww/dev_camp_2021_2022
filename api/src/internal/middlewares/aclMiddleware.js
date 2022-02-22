const ForbiddenException = require('#internal/errors/ForbiddenException');

// TODO: move to separate file
const Action = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

const Possession = {
  ANY: 'any',
  OWN: 'own',
};

const Resources = {
  POST: 'post',
  USER: 'user',
};

const Roles = {
  ADMIN: 'admin',
  USER: 'user',
};

const allowAny = [
  {
    action: Action.CREATE,
    possession: Possession.ANY,
  },
  {
    action: Action.READ,
    possession: Possession.ANY,
  },
  {
    action: Action.UPDATE,
    possession: Possession.ANY,
  },
  {
    action: Action.DELETE,
    possession: Possession.ANY,
  },
];

const allowOwn = [
  {
    action: Action.CREATE,
    possession: Possession.ANY,
  },
  {
    action: Action.READ,
    possession: Possession.ANY,
  },
  {
    action: Action.UPDATE,
    possession: Possession.OWN,
  },
];

const aclRules = {
  [Roles.ADMIN]: {
    [Resources.USER]: allowAny,
    [Resources.POST]: allowAny,
  },
  [Roles.USER]: {
    [Resources.USER]: allowOwn,
    [Resources.POST]: allowOwn,
  },
};

module.exports = (getUserService) => (rule) => async (req, res, next) => {
  const rules = Array.isArray(rule) ? rule : [rule];
  let isAllow = false;

  const userService = getUserService();
  const user = await userService.getById(req.auth.user_id);
  if (user) {
    for await (const checkRule of rules) {
      if (aclRules[user.role] && aclRules[user.role][checkRule.resource]) {
        for await (const permission of aclRules[user.role][
          checkRule.resource
        ]) {
          const canUseAnyAction =
            permission.possession === Possession.ANY &&
            permission.action === checkRule.action;

          if (checkRule.possession === Possession.ANY) {
            if (canUseAnyAction) {
              isAllow = true;
            }
          } else {
            if (canUseAnyAction) {
              isAllow = true;
            } else {
              const resource = await checkRule.getResource(req);
              if (checkRule.isOwn(resource, user.id)) {
                isAllow = true;
              }
            }
          }
        }
      }
    }
  }

  if (isAllow) {
    return next();
  }

  next(new ForbiddenException());
};
