const session = require('express-session');
const requireEnv = require('../config/requireEnv');

const sessionMiddleware=session({
    secret: requireEnv('SESSION_SECRET'),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week,
    },
  })

module.exports = sessionMiddleware