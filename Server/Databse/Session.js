const session = require('express-session');

// const myMiddleware = (req, res, next) => {
//     console.log('This is my middleware!');
//     next(); 
//   };

const sessionMiddleware=session({
    secret: 'HumanDesign Booking',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week,
    },
  })

module.exports = sessionMiddleware