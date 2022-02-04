const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// composites
const newPostgresqlComposite = require('./internal/composites/postgresqlComposite');
const newUserComposite = require('./internal/composites/userComposite');
const newPostComposite = require('./internal/composites/postComposite');
const newAuthComposite = require('./internal/composites/authComposite');
const newAuthMiddlewareComposite = require('./internal/composites/authMiddlewareComposite');

// // middlewares
const errorMiddleware = require('./internal/middlewares/errorMiddleware');
const logMiddleware = require('./internal/middlewares/logMiddleware');

// config
const config = require('./internal/config');
const port = config.app.port;

// create app
const app = express();

// composites
const postgresqlComposite = newPostgresqlComposite(config.db);

// TODO: refactor!!!
const authMiddlewareComposite = {};
const authComposite = {};
const userComposite = {};
const postComposite = {};

Object.assign(
  authMiddlewareComposite,
  newAuthMiddlewareComposite({
    getAuthService: () => authComposite.service,
  }),
);
Object.assign(
  authComposite,
  newAuthComposite({
    postgresqlComposite,
    getUserService: () => userComposite.service,
    authMiddleware: authMiddlewareComposite.middleware,
  }),
);
Object.assign(
  userComposite,
  newUserComposite({
    postgresqlComposite,
    config,
    authMiddleware: authMiddlewareComposite.middleware,
  }),
);

Object.assign(
  postComposite,
  newPostComposite({
    postgresqlComposite,
    authMiddleware: authMiddlewareComposite.middleware,
  }),
);

// 3-rd party middlewares
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
