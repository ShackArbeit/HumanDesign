const express = require('express');
const app = express();
const connectToDB=require('../Databse/ConnectToMongoDB')
const BookingModel=require('../Model/ForBooking')

const sessionMiddleware=require('../Databse/Session')

app.use(sessionMiddleware)

const router = require('express').Router();


router.get('/checkBooking', async (req, res) => {
    try {
       await connectToDB()
      const uniqueBookingPersons = await BookingModel.distinct('BookingPerson');
  
      const allBookings = await Promise.all(
        uniqueBookingPersons.map(async (BookingPerson) => {
          const bookings = await BookingModel.find({ BookingPerson }).lean().exec();
          return { BookingPerson, bookings };
        })
      );
      const accumulatedValues = [];

      for (let i = 0; i < allBookings[0].bookings.length; i++) {
          const allValues = allBookings[0].bookings[i];
          accumulatedValues.push(allValues);
          console.log(allValues);
      }

      res.json(accumulatedValues);

    } catch (error) {
      console.error('Error checking bookings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports=router