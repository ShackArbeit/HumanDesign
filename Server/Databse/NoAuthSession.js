const session = require('express-session');
const requireEnv = require('../config/requireEnv');

const AuthsessionMiddleware=session({
    secret: requireEnv('NO_AUTH_SESSION_SECRET'),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30 // 1 Month,
    },
  })

module.exports = AuthsessionMiddleware