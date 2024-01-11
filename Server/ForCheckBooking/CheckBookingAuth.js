const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const BookingModel = require('../Model/ForBooking');
const SignUpModel = require('../Model/ForAuth');
const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);

const router = require('express').Router();

router.get('/checkBooking', async (req, res) => {
  try {
    await connectToDB();
    const SeesionForAuth = await SignUpModel.distinct('Sessions');
    if (SeesionForAuth[0].sessionID
      ) {
      const User = await SignUpModel.findOne({ 'Sessions.sessionID': SeesionForAuth[0].sessionID
       });
      if (User) {
        const UserId = User._id;
        const userBookings = await BookingModel.find({ BookingPerson: UserId }).lean().exec();

        res.json(userBookings);
      } else {
        res.status(401).json({
          success: false,
          message: 'User not found based on the session ID.'
        });
      }
    }
  } catch (error) {
    console.error('Error checking bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
