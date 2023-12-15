const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const url = "mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority"


const myMiddleware = (req, res, next) => {
    console.log('This is my middleware!');
    next(); 
  };



const sessionMiddleware=session({
    secret: 'HumanDesign Booking',
    resave: false,
    saveUninitialized: true,
    store:new MongoDBStore({
      uri:url,
      databaseName: 'myWebsite',
      collection: 'users'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
  })

module.exports = {sessionMiddleware,myMiddleware};