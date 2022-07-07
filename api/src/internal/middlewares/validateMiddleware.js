const UnprocessableEntityException = require('#internal/errors/UnprocessableEntityException');

module.exports = (validationRules, services) => async (req, res, next) => {
  const errors = {};
  for await (const field of Object.keys(validationRules)) {
    const rules = validationRules[field].split('|');
    const fieldErrors = [];
    for await (const rule of rules) {
      const [ruleName, ruleParams] = rule.split(':');
      switch (ruleName) {
        case 'required':
          if (!req.body[field]) {
            fieldErrors.push('field is required');
          }
          break;
        case 'email':
          if (
            !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(req.body[field])
          ) {
            fieldErrors.push('valid email is required');
          }
          break;
        case 'min': {
          const min = parseInt(ruleParams);
          if (req.body[field] && req.body[field].length < min) {
            fieldErrors.push(`value is to short. min = ${min}`);
          }
          break;
        }
        case 'unique': {
          const { getResource, getResourceByField } = services[field];
          const resourceByEmail = await getResourceByField(req.body[field]);
          let resource;
          if (getResource) {
            resource = await getResource(req);
          }
          if (
            resourceByEmail &&
            (!resource || resourceByEmail.id !== resource.id)
          ) {
            fieldErrors.push('already taken');
          }
          break;
        }
      }
    }
    if (fieldErrors.length) {
      errors[field] = fieldErrors;
    }
  }

  if (Object.keys(errors).length === 0) {
    return next();
  }
  next(new UnprocessableEntityException(errors));
};
