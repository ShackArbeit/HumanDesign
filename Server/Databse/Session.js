const session = require('express-session');

const sessionMiddleware=session({
    secret: 'HumanDesign Booking',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week,
    },
  })

module.exports = sessionMiddleware