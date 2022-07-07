const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// composites
const newPostgresqlComposite = require('./internal/composites/postgresqlComposite');
const newUserComposite = require('./internal/composites/userComposite');
const newPostComposite = require('./internal/composites/postComposite');
const newAuthComposite = require('./internal/composites/authComposite');
const newAuthMiddlewareComposite = require('./internal/composites/authMiddlewareComposite');
const newAclMiddlewareComposite = require('./internal/composites/aclMiddlewareComposite');

// // middlewares
const errorMiddleware = require('./internal/middlewares/errorMiddleware');
const logMiddleware = require('./internal/middlewares/logMiddleware');
const validateMiddleware = require('./internal/middlewares/validateMiddleware');

// config
const config = require('./internal/config');
const port = config.app.port;

// create app
const app = express();

// composites
const postgresqlComposite = newPostgresqlComposite(config.db);

// TODO: refactor!!!
const authMiddlewareComposite = {};
const aclMiddlewareComposite = {};
const authComposite = {};
const userComposite = {};
const postComposite = {};

Object.assign(
  authMiddlewareComposite,
  newAuthMiddlewareComposite({
    config,
    getAuthService: () => authComposite.service,
  }),
);
Object.assign(
  aclMiddlewareComposite,
  newAclMiddlewareComposite({
    getUserService: () => userComposite.service,
  }),
);
Object.assign(
  authComposite,
  newAuthComposite({
    postgresqlComposite,
    config,
    getUserService: () => userComposite.service,
  }),
);
Object.assign(
  userComposite,
  newUserComposite({
    postgresqlComposite,
    config,
    authMiddleware: authMiddlewareComposite.middleware,
    aclMiddleware: aclMiddlewareComposite.middleware,
    validateMiddleware: validateMiddleware,
  }),
);
Object.assign(
  postComposite,
  newPostComposite({
    postgresqlComposite,
    authMiddleware: authMiddlewareComposite.middleware,
    aclMiddleware: aclMiddlewareComposite.middleware,
  }),
);

// 3-rd party middlewares
app.use(cors());
app.use(authComposite.passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// request logger
app.use(
  logMiddleware({
    logTableName: 'logs',
    db: postgresqlComposite.db,
  }),
);

// register handlers
app.use('/users', userComposite.router);
app.use('/posts', postComposite.router);
app.use('/auth', authComposite.router);

// // handle errors
app.use(errorMiddleware);

// run application
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
