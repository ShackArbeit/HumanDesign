const session = require('express-session');

const AuthsessionMiddleware=session({
    secret: 'HumanDesign Booking For No Auth',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30 // 1 Month,
    },
  })

module.exports = AuthsessionMiddleware